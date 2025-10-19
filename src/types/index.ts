// ESP32 CamViewer - TypeScript Types
// Generated: 2025-10-19

export interface Camera {
  id: string;
  name: string;
  streamUrl: string;
  location?: string;
  deviceType: 'ESP32-CAM' | 'AMEBA' | 'OTHER';
  isPrivate: boolean;
  isOnline?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
}

export interface Settings {
  gridLayout: '2x2' | '3x3' | '4x4' | 'auto';
  refreshInterval: number; // segundos
  theme: 'light' | 'dark' | 'system';
  privacyPasswordHash: string;
}

export interface SessionState {
  isAuthenticated: boolean;
  currentUser: User | null;
  unlockedCameras: Set<string>;
}
