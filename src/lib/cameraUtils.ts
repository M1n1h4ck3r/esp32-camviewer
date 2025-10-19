// ESP32 CamViewer - Camera Utilities
// Generated: 2025-10-19

import { Camera } from '@/types';
import { CAMERA_CONFIG } from '@/constants';

/**
 * Get the correct stream URL for a camera
 * Handles different ESP32 stream formats
 */
export function getStreamUrl(camera: Camera): string {
  const { streamUrl } = camera;

  // Ensure URL has protocol
  if (!streamUrl.startsWith('http://') && !streamUrl.startsWith('https://')) {
    return `http://${streamUrl}`;
  }

  return streamUrl;
}

/**
 * Get snapshot URL from stream URL
 * ESP32-CAM typically has /stream for MJPEG and /capture for snapshot
 */
export function getSnapshotUrl(camera: Camera): string {
  const streamUrl = getStreamUrl(camera);

  // If already has /capture, use it
  if (streamUrl.includes('/capture')) {
    return streamUrl;
  }

  // Convert /stream to /capture
  if (streamUrl.includes('/stream')) {
    return streamUrl.replace('/stream', '/capture');
  }

  // Default: append /capture
  return `${streamUrl}/capture`;
}

/**
 * Check if camera is online
 * Attempts to fetch from camera URL with timeout
 */
export async function checkCameraOnline(camera: Camera): Promise<boolean> {
  const snapshotUrl = getSnapshotUrl(camera);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CAMERA_CONFIG.OFFLINE_TIMEOUT);

    const response = await fetch(snapshotUrl, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error(`Camera ${camera.name} offline:`, error);
    return false;
  }
}

/**
 * Validate camera URL format
 */
export function validateCameraUrl(url: string): {
  isValid: boolean;
  message: string;
} {
  if (!url || url.trim().length === 0) {
    return {
      isValid: false,
      message: 'URL é obrigatória',
    };
  }

  // Check if it's a valid URL or IP
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  const ipPattern = /^(https?:\/\/)?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?(\/.*)?$/;

  if (!urlPattern.test(url) && !ipPattern.test(url)) {
    return {
      isValid: false,
      message: 'URL inválida. Use formato: http://192.168.1.100 ou http://camera.local',
    };
  }

  return {
    isValid: true,
    message: 'URL válida',
  };
}

/**
 * Format device type for display
 */
export function formatDeviceType(deviceType: Camera['deviceType']): string {
  const labels: Record<Camera['deviceType'], string> = {
    'ESP32-CAM': 'ESP32-CAM',
    AMEBA: 'AMEBA',
    OTHER: 'Outro',
  };

  return labels[deviceType] || deviceType;
}

/**
 * Generate unique camera ID
 */
export function generateCameraId(): string {
  return `cam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get camera status color
 */
export function getCameraStatusColor(isOnline?: boolean): string {
  if (isOnline === undefined) return 'bg-slate-500'; // unknown
  return isOnline ? 'bg-green-500' : 'bg-red-500';
}

/**
 * Get camera status text
 */
export function getCameraStatusText(isOnline?: boolean): string {
  if (isOnline === undefined) return 'Verificando...';
  return isOnline ? 'Online' : 'Offline';
}

/**
 * Parse camera URL to extract components
 */
export function parseCameraUrl(url: string): {
  protocol: string;
  host: string;
  port: string;
  path: string;
} {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
    return {
      protocol: urlObj.protocol.replace(':', ''),
      host: urlObj.hostname,
      port: urlObj.port || '80',
      path: urlObj.pathname,
    };
  } catch (error) {
    return {
      protocol: 'http',
      host: url,
      port: '80',
      path: '/',
    };
  }
}
