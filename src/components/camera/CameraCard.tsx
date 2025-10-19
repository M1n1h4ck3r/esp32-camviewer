'use client';

// ESP32 CamViewer - Camera Card Component
// Generated: 2025-10-19

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Maximize,
  Lock,
  WifiOff,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { getSnapshotUrl, getCameraStatusColor, getCameraStatusText } from '@/lib/cameraUtils';
import { useStore } from '@/store/useStore';
import { UnlockCameraDialog } from './UnlockCameraDialog';
import { cn } from '@/lib/utils';

interface CameraCardProps {
  camera: Camera;
  onExpand?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CameraCard({ camera, onExpand, onEdit, onDelete }: CameraCardProps) {
  const unlockedCameras = useStore((state) => state.unlockedCameras);
  const settings = useStore((state) => state.settings);

  const [imageKey, setImageKey] = useState(Date.now());
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [showActions, setShowActions] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  const isLocked = camera.isPrivate && !unlockedCameras.has(camera.id);
  const snapshotUrl = getSnapshotUrl(camera);

  // Refresh image at intervals
  useEffect(() => {
    if (isLocked || !isOnline) return;

    const interval = setInterval(() => {
      setImageKey(Date.now());
    }, settings.refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [settings.refreshInterval, isLocked, isOnline]);

  // Check if camera is online
  const checkOnline = useCallback(async () => {
    try {
      const img = new Image();
      img.src = `${snapshotUrl}?t=${Date.now()}`;

      img.onload = () => setIsOnline(true);
      img.onerror = () => setIsOnline(false);
    } catch (error) {
      setIsOnline(false);
    }
  }, [snapshotUrl]);

  useEffect(() => {
    checkOnline();
    const interval = setInterval(checkOnline, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkOnline]);

  const handleImageError = () => {
    setIsOnline(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group relative overflow-hidden bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-700">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={cn('h-2 w-2 rounded-full', getCameraStatusColor(isOnline))} />
            <h3 className="font-medium text-white truncate">{camera.name}</h3>
            {camera.isPrivate && (
              <Lock className="h-3 w-3 text-slate-400 flex-shrink-0" />
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-400 hover:text-white"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showActions && (
              <div className="absolute right-0 top-8 z-10 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 min-w-[120px]">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit();
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete();
                      setShowActions(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remover
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Camera Feed */}
        <div className="relative aspect-video bg-slate-900">
          {isOnline === false ? (
            // Offline State
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <WifiOff className="h-12 w-12 mb-2" />
              <p className="text-sm">Câmera offline</p>
              <p className="text-xs mt-1">{getCameraStatusText(isOnline)}</p>
            </div>
          ) : (
            <>
              {/* Image with Blur Animation */}
              <motion.img
                src={`${snapshotUrl}?t=${imageKey}`}
                alt={camera.name}
                className="h-full w-full object-cover"
                animate={{
                  filter: isLocked ? 'blur(20px)' : 'blur(0px)',
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                onError={handleImageError}
              />

              {/* Locked Overlay with Animation */}
              <AnimatePresence>
                {isLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="text-center"
                    >
                      <Lock className="mx-auto h-12 w-12 text-white mb-2" />
                      <p className="text-sm text-white">Câmera Privada</p>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-3"
                        onClick={() => setShowUnlockDialog(true)}
                      >
                        Desbloquear
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand Button (only if unlocked and online) */}
              {!isLocked && isOnline && onExpand && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 md:group-hover:opacity-100 active:opacity-100 transition-opacity duration-200">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={onExpand}
                      className="h-12 w-12 md:h-14 md:w-14 shadow-lg"
                      aria-label="Expandir câmera em tela cheia"
                    >
                      <Maximize className="h-6 w-6 md:h-7 md:w-7" />
                    </Button>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400">{camera.deviceType}</span>
          <span className="text-xs text-slate-500">
            Refresh: {settings.refreshInterval}s
          </span>
        </div>
      </Card>

      {/* Unlock Dialog */}
      <UnlockCameraDialog
        camera={camera}
        open={showUnlockDialog}
        onOpenChange={setShowUnlockDialog}
      />
    </motion.div>
  );
}
