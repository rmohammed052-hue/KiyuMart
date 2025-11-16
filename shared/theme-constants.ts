// Original theme colors extracted from index.css
// These match the exact HSL values from the default CSS variables

export const ORIGINAL_THEME = {
  light: {
    // Primary color: 16 100% 61% (orange/coral)
    primary: '#ff8833',
    // Secondary: 0 0% 96% (light gray)
    secondary: '#f5f5f5',
    // Accent: 16 100% 61% (same as primary)
    accent: '#ff8833',
    // Backgrounds and text
    background: '#ffffff',
    foreground: '#171717',
    card: '#ffffff',
  },
  dark: {
    // Primary remains same in dark mode
    primary: '#ff8833',
    // Secondary: 0 0% 15%
    secondary: '#262626',
    // Accent remains same
    accent: '#ff8833',
    // Backgrounds and text
    background: '#121212',
    foreground: '#fafafa',
    card: '#1a1a1a',
  }
} as const;

// Helper to convert HSL to hex (for reference/validation)
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Database default values - these should match schema defaults
export const DB_DEFAULTS = {
  primaryColor: ORIGINAL_THEME.light.primary,
  secondaryColor: ORIGINAL_THEME.light.secondary,
  accentColor: ORIGINAL_THEME.light.accent,
  lightBgColor: ORIGINAL_THEME.light.background,
  lightTextColor: ORIGINAL_THEME.light.foreground,
  lightCardColor: ORIGINAL_THEME.light.card,
  darkBgColor: ORIGINAL_THEME.dark.background,
  darkTextColor: ORIGINAL_THEME.dark.foreground,
  darkCardColor: ORIGINAL_THEME.dark.card,
} as const;
