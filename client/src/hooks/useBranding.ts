import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface PlatformSettings {
  id?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  lightBgColor?: string;
  lightTextColor?: string;
  lightCardColor?: string;
  darkBgColor?: string;
  darkTextColor?: string;
  darkCardColor?: string;
  platformName?: string;
  [key: string]: any;
}

// Convert hex color to HSL format for CSS variables
function hexToHSL(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lightness = Math.round(l * 100);
  
  return `${h} ${s}% ${lightness}%`;
}

// Build a dynamic style block reflecting current branding settings
function buildDynamicBrandingCSS(settings: PlatformSettings): string {
  const primary = settings.primaryColor ? hexToHSL(settings.primaryColor) : undefined;
  const secondary = settings.secondaryColor ? hexToHSL(settings.secondaryColor) : undefined;
  const accent = settings.accentColor ? hexToHSL(settings.accentColor) : undefined;
  const lightBg = settings.lightBgColor ? hexToHSL(settings.lightBgColor) : undefined;
  const lightText = settings.lightTextColor ? hexToHSL(settings.lightTextColor) : undefined;
  const lightCard = settings.lightCardColor ? hexToHSL(settings.lightCardColor) : undefined;
  const darkBg = settings.darkBgColor ? hexToHSL(settings.darkBgColor) : undefined;
  const darkText = settings.darkTextColor ? hexToHSL(settings.darkTextColor) : undefined;
  const darkCard = settings.darkCardColor ? hexToHSL(settings.darkCardColor) : undefined;

  // Helper: derive readable foreground (white/black) for a hex color
  const pickForeground = (hex?: string) => {
    if (!hex) return undefined;
    const c = hex.replace('#','');
    const r = parseInt(c.slice(0,2),16);
    const g = parseInt(c.slice(2,4),16);
    const b = parseInt(c.slice(4,6),16);
    // Per W3C relative luminance
    const srgb = [r,g,b].map(v=>{v/=255;return v<=0.03928? v/12.92: Math.pow((v+0.055)/1.055,2.4);});
    const L = 0.2126*srgb[0]+0.7152*srgb[1]+0.0722*srgb[2];
    // Contrast against white (L=1) and black (L=0)
    const contrastWhite = (1.05)/(L+0.05);
    const contrastBlack = (L+0.05)/(0.05);
    return contrastWhite < contrastBlack ? '0 0% 100%' : '0 0% 9%';
  };

  const primaryFg = pickForeground(settings.primaryColor);
  const secondaryFg = pickForeground(settings.secondaryColor);
  const accentFg = pickForeground(settings.accentColor);
  const lightTextFg = lightText ? lightText : undefined;
  const darkTextFg = darkText ? darkText : undefined;

  // Build CSS blocks
  // Derive muted color (slightly blended between background and secondary or primary)
  const deriveMuted = () => {
    const base = secondary || primary || lightBg;
    if (!base) return undefined;
    // base is "h s% l%" -> adjust lightness +4% and reduce saturation 25%
    const [h, sPart, lPart] = base.split(' ');
    const sVal = parseInt(sPart.replace('%',''), 10);
    const lVal = parseInt(lPart.replace('%',''), 10);
    const newS = Math.max(0, Math.round(sVal * 0.75));
    const newL = Math.min(100, lVal + 4);
    return `${h} ${newS}% ${newL}%`;
  };
  const muted = deriveMuted();
  const mutedFg = pickForeground(settings.secondaryColor || settings.primaryColor || settings.lightBgColor);

  // Utility to slightly adjust lightness and saturation
  const adjustHSL = (hsl: string, { dL = 0, sFactor = 1 }: { dL?: number; sFactor?: number }) => {
    const [h, sPart, lPart] = hsl.split(' ');
    const sVal = parseInt(sPart.replace('%',''), 10);
    const lVal = parseInt(lPart.replace('%',''), 10);
    const newS = Math.min(100, Math.max(0, Math.round(sVal * sFactor)));
    const newL = Math.min(100, Math.max(0, lVal + dL));
    return `${h} ${newS}% ${newL}%`;
  };

  // Derive border & input from background
  const lightBorder = lightBg ? adjustHSL(lightBg, { dL: -10, sFactor: 1 }) : undefined;
  const darkBorder = darkBg ? adjustHSL(darkBg, { dL: 11, sFactor: 1 }) : undefined;
  const lightInput = lightBorder;
  const darkInput = darkBorder;

  const rootBlock = [
    primary && `--primary:${primary}; --ring:${primary}; --sidebar-primary:${primary}; --sidebar-ring:${primary}; --chart-1:${primary}; --primary-border:hsl(var(--primary));`,
    primaryFg && `--primary-foreground:${primaryFg}; --sidebar-primary-foreground:${primaryFg};`,
    secondary && `--secondary:${secondary}; --sidebar-accent:${secondary}; --secondary-border:hsl(var(--secondary));`,
    secondaryFg && `--secondary-foreground:${secondaryFg}; --sidebar-accent-foreground:${secondaryFg};`,
    accent && `--accent:${accent}; --destructive:${accent}; --accent-border:hsl(var(--accent)); --destructive-border:hsl(var(--destructive));`,
    accentFg && `--accent-foreground:${accentFg}; --destructive-foreground:${accentFg};`,
    lightBg && `--background:${lightBg}; --sidebar:${lightBg};`,
    lightTextFg && `--foreground:${lightTextFg}; --sidebar-foreground:${lightTextFg};`,
    lightCard && `--card:${lightCard}; --popover:${lightCard};`,
    muted && `--muted:${muted}; --muted-border:hsl(var(--muted));`,
    mutedFg && `--muted-foreground:${mutedFg};`,
    lightBorder && `--border:${lightBorder}; --sidebar-border:${lightBorder};`,
    lightInput && `--input:${lightInput};`,
  ].filter(Boolean).join(' ');

  const darkMuted = muted; // reuse same derivation for dark; could adjust further if needed
  const darkBlock = [
    darkBg && `--background:${darkBg}; --sidebar:${darkBg};`,
    darkTextFg && `--foreground:${darkTextFg}; --sidebar-foreground:${darkTextFg};`,
    darkCard && `--card:${darkCard}; --popover:${darkCard};`,
    primary && `--primary:${primary}; --sidebar-primary:${primary}; --ring:${primary}; --primary-border:hsl(var(--primary));`,
    primaryFg && `--primary-foreground:${primaryFg}; --sidebar-primary-foreground:${primaryFg};`,
    secondary && `--secondary:${secondary}; --sidebar-accent:${secondary}; --secondary-border:hsl(var(--secondary));`,
    secondaryFg && `--secondary-foreground:${secondaryFg}; --sidebar-accent-foreground:${secondaryFg};`,
    accent && `--accent:${accent}; --destructive:${accent}; --accent-border:hsl(var(--accent)); --destructive-border:hsl(var(--destructive));`,
    accentFg && `--accent-foreground:${accentFg}; --destructive-foreground:${accentFg};`,
    darkMuted && `--muted:${darkMuted}; --muted-border:hsl(var(--muted));`,
    mutedFg && `--muted-foreground:${mutedFg};`,
    darkBorder && `--border:${darkBorder}; --sidebar-border:${darkBorder};`,
    darkInput && `--input:${darkInput};`,
  ].filter(Boolean).join(' ');

  // Support dark class applied to html or body
  return `:root { ${rootBlock} } html.dark, body.dark, .dark { ${darkBlock} }`;
}

export function applyBranding(settings: PlatformSettings) {
  const styleId = 'branding-dynamic-style';
  let el = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = styleId;
    document.head.appendChild(el);
  }
  else {
    // Re-append to end to maximize precedence over earlier styles
    el.remove();
    document.head.appendChild(el);
  }
  // Diagnostics: capture previous computed primary before applying
  const prevPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary');
  const css = buildDynamicBrandingCSS(settings);
  el.textContent = css;
  // Also apply directly on :root for immediate override precedence
  const root = document.documentElement;
  const parsed = settings as Record<string, any>;
  const directMap: Record<string, string | undefined> = {
    '--primary': settings.primaryColor ? hexToHSL(settings.primaryColor) : undefined,
    '--secondary': settings.secondaryColor ? hexToHSL(settings.secondaryColor) : undefined,
    '--accent': settings.accentColor ? hexToHSL(settings.accentColor) : undefined,
    '--background': settings.lightBgColor ? hexToHSL(settings.lightBgColor) : undefined,
    '--foreground': settings.lightTextColor ? hexToHSL(settings.lightTextColor) : undefined,
    '--card': settings.lightCardColor ? hexToHSL(settings.lightCardColor) : undefined,
  };
  Object.entries(directMap).forEach(([k,v])=>{ if(v) root.style.setProperty(k,v); });
  // Debug instrumentation: expose last applied settings & css for inspection
  (window as any).__brandingLastApplied = {
    timestamp: Date.now(),
    settingsSnapshot: { ...settings },
    css,
    prevPrimary,
    newPrimary: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
  };
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Branding] Applied dynamic branding variables', (window as any).__brandingLastApplied);
  }
}

export function useBranding() {
  const { data: settings } = useQuery<PlatformSettings>({
    queryKey: ["/api/platform-settings"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (settings) applyBranding(settings);
  }, [settings]);

  return settings;
}
