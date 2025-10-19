'use client';

// ESP32 CamViewer - Fullscreen Camera Component
// Generated: 2025-10-19

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { getSnapshotUrl, getCameraStatusColor } from '@/lib/cameraUtils';
import type { Camera } from '@/types';

interface FullscreenCameraProps {
  camera: Camera | null;
  open: boolean;
  onClose: () => void;
}

export function FullscreenCamera({ camera, open, onClose }: FullscreenCameraProps) {
  const settings = useStore((state) => state.settings);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isOnline, setIsOnline] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!camera || !open) return;

    const interval = setInterval(() => {
      setImageKey(Date.now());
    }, settings.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [camera, open, settings.refreshInterval]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  const handleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleRefresh = () => {
    setImageKey(Date.now());
  };

  if (!camera) return null;

  const snapshotUrl = getSnapshotUrl(camera);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${getCameraStatusColor(isOnline)}`} />
                <div>
                  <h2 className="text-xl font-semibold text-white">{camera.name}</h2>
                  <p className="text-sm text-slate-400">{camera.deviceType}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleRefresh}
                  className="text-white hover:bg-white/20"
                  title="Atualizar"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleFullscreen}
                  className="text-white hover:bg-white/20"
                  title={isFullscreen ? 'Sair do Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                  title="Fechar (ESC)"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Camera Feed */}
          <div className="flex items-center justify-center h-full p-4 pt-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-full"
            >
              <img
                src={`${snapshotUrl}?t=${imageKey}`}
                alt={camera.name}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onError={() => setIsOnline(false)}
                onLoad={() => setIsOnline(true)}
              />
            </motion.div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-slate-400">
              <span>Refresh: {settings.refreshInterval}s</span>
              <span className="font-mono">{camera.streamUrl}</span>
              <span>Pressione ESC para fechar</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
