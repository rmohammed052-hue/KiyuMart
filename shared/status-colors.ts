/**
 * Unified Status and Role Color System
 * Professional, minimal, easily differentiable colors for KiyuMart
 */

// Order Status Colors - Soft, Professional, Clearly Differentiated
export const ORDER_STATUS_COLORS = {
  pending: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    solid: "bg-amber-500 text-white",
  },
  processing: {
    light: "bg-sky-50 text-sky-700 border-sky-200",
    dark: "dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800",
    solid: "bg-sky-500 text-white",
  },
  delivering: {
    light: "bg-violet-50 text-violet-700 border-violet-200",
    dark: "dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800",
    solid: "bg-violet-500 text-white",
  },
  delivered: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    solid: "bg-emerald-500 text-white",
  },
  cancelled: {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
    solid: "bg-rose-500 text-white",
  },
  disputed: {
    light: "bg-orange-50 text-orange-700 border-orange-200",
    dark: "dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800",
    solid: "bg-orange-500 text-white",
  },
  shipped: {
    light: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dark: "dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800",
    solid: "bg-indigo-500 text-white",
  },
} as const;

// User Role Colors - Professional, Distinct, Role-Appropriate
export const USER_ROLE_COLORS = {
  super_admin: {
    light: "bg-slate-50 text-slate-700 border-slate-300",
    dark: "dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700",
    solid: "bg-slate-700 text-white",
  },
  admin: {
    light: "bg-purple-50 text-purple-700 border-purple-200",
    dark: "dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
    solid: "bg-purple-600 text-white",
  },
  seller: {
    light: "bg-blue-50 text-blue-700 border-blue-200",
    dark: "dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    solid: "bg-blue-600 text-white",
  },
  buyer: {
    light: "bg-teal-50 text-teal-700 border-teal-200",
    dark: "dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800",
    solid: "bg-teal-600 text-white",
  },
  rider: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    solid: "bg-amber-600 text-white",
  },
  agent: {
    light: "bg-pink-50 text-pink-700 border-pink-200",
    dark: "dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800",
    solid: "bg-pink-600 text-white",
  },
} as const;

// Payment Status Colors
export const PAYMENT_STATUS_COLORS = {
  pending: {
    light: "bg-gray-50 text-gray-700 border-gray-200",
    dark: "dark:bg-gray-900/50 dark:text-gray-400 dark:border-gray-700",
    solid: "bg-gray-500 text-white",
  },
  processing: {
    light: "bg-blue-50 text-blue-700 border-blue-200",
    dark: "dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    solid: "bg-blue-500 text-white",
  },
  completed: {
    light: "bg-green-50 text-green-700 border-green-200",
    dark: "dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
    solid: "bg-green-600 text-white",
  },
  failed: {
    light: "bg-red-50 text-red-700 border-red-200",
    dark: "dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
    solid: "bg-red-500 text-white",
  },
  refunded: {
    light: "bg-purple-50 text-purple-700 border-purple-200",
    dark: "dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
    solid: "bg-purple-500 text-white",
  },
} as const;

// Approval Status Colors
export const APPROVAL_STATUS_COLORS = {
  approved: {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    solid: "bg-emerald-600 text-white",
  },
  pending: {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    solid: "bg-amber-500 text-white",
  },
  rejected: {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
    solid: "bg-rose-500 text-white",
  },
} as const;

// Active/Inactive Status
export const ACTIVITY_STATUS_COLORS = {
  active: {
    light: "bg-green-50 text-green-700 border-green-200",
    dark: "dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
    solid: "bg-green-600 text-white",
  },
  inactive: {
    light: "bg-gray-50 text-gray-700 border-gray-200",
    dark: "dark:bg-gray-900/50 dark:text-gray-400 dark:border-gray-700",
    solid: "bg-gray-500 text-white",
  },
} as const;

// Helper function to get combined class string
export function getStatusClasses(status: string, type: 'order' | 'role' | 'payment' | 'approval' | 'activity' = 'order', variant: 'light' | 'solid' = 'light'): string {
  const colorMaps = {
    order: ORDER_STATUS_COLORS,
    role: USER_ROLE_COLORS,
    payment: PAYMENT_STATUS_COLORS,
    approval: APPROVAL_STATUS_COLORS,
    activity: ACTIVITY_STATUS_COLORS,
  };

  const colorMap = colorMaps[type];
  const statusKey = status.toLowerCase().replace(/_/g, '_');
  
  // Type-safe access with fallback
  const colorEntry = (colorMap as any)[statusKey] || (colorMap as any)[Object.keys(colorMap)[0]];

  if (variant === 'solid') {
    return colorEntry.solid;
  }

  return `${colorEntry.light} ${colorEntry.dark}`;
}

// Helper to get role color (backward compatible)
export function getRoleColor(role: string, variant: 'light' | 'solid' = 'solid'): string {
  return getStatusClasses(role, 'role', variant);
}

// Helper to get order status color (backward compatible)
export function getOrderStatusColor(status: string, variant: 'light' | 'solid' = 'light'): string {
  return getStatusClasses(status, 'order', variant);
}
