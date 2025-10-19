// ESP32 CamViewer - Application Constants
// Generated: 2025-10-19

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  SESSION_EXPIRY_MINUTES: 30,
  MIN_PASSWORD_LENGTH: 4,
  MAX_PASSWORD_LENGTH: 100,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
} as const;

/**
 * Camera configuration
 */
export const CAMERA_CONFIG = {
  DEFAULT_REFRESH_INTERVAL: 5, // seconds
  MIN_REFRESH_INTERVAL: 1,
  MAX_REFRESH_INTERVAL: 30,
  MAX_CAMERAS: 20,
  OFFLINE_TIMEOUT: 10000, // 10 seconds
} as const;

/**
 * Grid layout options
 */
export const GRID_LAYOUTS = {
  '2x2': 'grid-cols-1 md:grid-cols-2',
  '3x3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4x4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

/**
 * Device types for ESP32 cameras
 */
export const DEVICE_TYPES = {
  ESP32_CAM: 'ESP32-CAM',
  AMEBA: 'AMEBA',
  OTHER: 'OTHER',
} as const;

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  AUTH_STATE: 'esp32-camviewer-auth',
  CAMERAS: 'esp32-camviewer-cameras',
  SETTINGS: 'esp32-camviewer-settings',
  UNLOCKED_CAMERAS: 'esp32-camviewer-unlocked',
  SESSION_CREATED_AT: 'esp32-camviewer-session-created',
} as const;

/**
 * Default admin credentials (MVP only - from env)
 */
export const DEFAULT_ADMIN = {
  USERNAME: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
  PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',
} as const;

/**
 * Default privacy password (from env)
 */
export const DEFAULT_PRIVACY_PASSWORD =
  process.env.NEXT_PUBLIC_DEFAULT_PRIVACY_PASSWORD || 'privacy123';

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  TOAST_DURATION: 3000, // milliseconds
  ANIMATION_DURATION: 300, // milliseconds
  DEBOUNCE_DELAY: 500, // milliseconds
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CAMERAS: '/dashboard/cameras',
  SETTINGS: '/dashboard/settings',
} as const;
