'use client';

// ESP32 CamViewer - Camera Grid Component
// Generated: 2025-10-19

import { Camera } from '@/types';
import { CameraCard } from './CameraCard';
import { CameraCardSkeleton } from './CameraCardSkeleton';
import { useStore } from '@/store/useStore';
import { GRID_LAYOUTS } from '@/constants';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CameraGridProps {
  cameras: Camera[];
  onExpand?: (camera: Camera) => void;
  onEdit?: (camera: Camera) => void;
  onDelete?: (camera: Camera) => void;
  isLoading?: boolean;
}

export function CameraGrid({ cameras, onExpand, onEdit, onDelete, isLoading = false }: CameraGridProps) {
  const settings = useStore((state) => state.settings);

  // Get grid layout class from settings
  const gridClass = GRID_LAYOUTS[settings.gridLayout];

  // Show loading skeletons
  if (isLoading) {
    return (
      <div className={cn('grid gap-4', gridClass)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <CameraCardSkeleton />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn('grid gap-4', gridClass)}
    >
      {cameras.map((camera, index) => (
        <motion.div
          key={camera.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <CameraCard
            camera={camera}
            onExpand={() => onExpand?.(camera)}
            onEdit={() => onEdit?.(camera)}
            onDelete={() => onDelete?.(camera)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
