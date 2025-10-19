// ESP32 CamViewer - Zustand Store with Persistence
// Generated: 2025-10-19

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Camera, Settings, SessionState, User } from '@/types';
import { hashPassword, comparePassword } from '@/lib/auth';
import { DEFAULT_ADMIN, DEFAULT_PRIVACY_PASSWORD, STORAGE_KEYS } from '@/constants';

interface AppState extends SessionState {
  cameras: Camera[];
  settings: Settings;
  sessionCreatedAt: Date | null;
  _hasHydrated: boolean;

  // Actions
  login: (username: string, password: string) => boolean;
  logout: () => void;
  unlockCamera: (cameraId: string, password: string) => Promise<boolean>;
  lockAllCameras: () => void;
  addCamera: (camera: Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeCamera: (id: string) => void;
  updateCamera: (id: string, updates: Partial<Camera>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  updatePrivacyPassword: (newPassword: string) => void;
  initializeStore: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentUser: null,
      unlockedCameras: new Set<string>(),
      sessionCreatedAt: null,
      cameras: [],
      settings: {
        gridLayout: 'auto',
        refreshInterval: 5,
        theme: 'system',
        privacyPasswordHash: hashPassword(DEFAULT_PRIVACY_PASSWORD),
      },
      _hasHydrated: false,

      // Set hydration state
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // Initialize store (load from localStorage on mount)
      initializeStore: () => {
        // Check if session is expired
        const { sessionCreatedAt, isAuthenticated } = get();
        if (isAuthenticated && sessionCreatedAt) {
          const now = new Date();
          const sessionAge = now.getTime() - new Date(sessionCreatedAt).getTime();
          const thirtyMinutes = 30 * 60 * 1000;

          if (sessionAge > thirtyMinutes) {
            // Session expired, logout
            get().logout();
          }
        }
      },

      // Real authentication logic
      login: (username, password) => {
        // MVP: Check against hardcoded admin credentials
        if (username === DEFAULT_ADMIN.USERNAME && password === DEFAULT_ADMIN.PASSWORD) {
          set({
            isAuthenticated: true,
            currentUser: {
              id: crypto.randomUUID(),
              username,
              passwordHash: hashPassword(password),
            },
            sessionCreatedAt: new Date(),
          });
          return true;
        }
        return false;
      },

      // Logout and clear unlocked cameras
      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          unlockedCameras: new Set(),
          sessionCreatedAt: null,
        });
      },

      // Unlock camera with privacy password validation
      unlockCamera: async (cameraId, password) => {
        const { settings } = get();

        // Validate password against stored hash
        const isValid = comparePassword(password, settings.privacyPasswordHash);

        if (isValid) {
          set((state) => {
            const newSet = new Set(state.unlockedCameras);
            newSet.add(cameraId);
            return { unlockedCameras: newSet };
          });
          return true;
        }

        return false;
      },

      // Lock all cameras (called on logout or manually)
      lockAllCameras: () => {
        set({ unlockedCameras: new Set() });
      },

      // Add new camera
      addCamera: (camera) => {
        const newCamera: Camera = {
          ...camera,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ cameras: [...state.cameras, newCamera] }));
      },

      // Remove camera
      removeCamera: (id) => {
        set((state) => ({
          cameras: state.cameras.filter((cam) => cam.id !== id),
        }));
      },

      // Update camera
      updateCamera: (id, updates) => {
        set((state) => ({
          cameras: state.cameras.map((cam) =>
            cam.id === id ? { ...cam, ...updates, updatedAt: new Date() } : cam
          ),
        }));
      },

      // Update settings
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // Update privacy password
      updatePrivacyPassword: (newPassword) => {
        const hash = hashPassword(newPassword);
        set((state) => ({
          settings: { ...state.settings, privacyPasswordHash: hash },
          unlockedCameras: new Set(), // Lock all cameras when password changes
        }));
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STATE,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        cameras: state.cameras,
        settings: state.settings,
        sessionCreatedAt: state.sessionCreatedAt,
        // Don't persist unlockedCameras (reset on page reload for security)
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
