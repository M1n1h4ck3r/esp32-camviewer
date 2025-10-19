'use client';

// ESP32 CamViewer - Lazy Loaded Dialogs
// Generated: 2025-10-19

import { lazy, Suspense } from 'react';
import { Camera } from '@/types';

// Lazy load dialog components (code splitting)
const AddCameraDialog = lazy(() =>
  import('./AddCameraDialog').then((mod) => ({ default: mod.AddCameraDialog }))
);

const EditCameraDialog = lazy(() =>
  import('./EditCameraDialog').then((mod) => ({ default: mod.EditCameraDialog }))
);

const DeleteCameraDialog = lazy(() =>
  import('./DeleteCameraDialog').then((mod) => ({ default: mod.DeleteCameraDialog }))
);

const FullscreenCamera = lazy(() =>
  import('./FullscreenCamera').then((mod) => ({ default: mod.FullscreenCamera }))
);

// Loading fallback (invisible, since dialogs handle their own loading)
const DialogFallback = () => null;

// Wrapper components with Suspense
export function LazyAddCameraDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open) return null;

  return (
    <Suspense fallback={<DialogFallback />}>
      <AddCameraDialog open={open} onOpenChange={onOpenChange} />
    </Suspense>
  );
}

export function LazyEditCameraDialog({
  camera,
  open,
  onOpenChange,
}: {
  camera: Camera | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open) return null;

  return (
    <Suspense fallback={<DialogFallback />}>
      <EditCameraDialog camera={camera} open={open} onOpenChange={onOpenChange} />
    </Suspense>
  );
}

export function LazyDeleteCameraDialog({
  camera,
  open,
  onOpenChange,
}: {
  camera: Camera | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open) return null;

  return (
    <Suspense fallback={<DialogFallback />}>
      <DeleteCameraDialog camera={camera} open={open} onOpenChange={onOpenChange} />
    </Suspense>
  );
}

export function LazyFullscreenCamera({
  camera,
  open,
  onClose,
}: {
  camera: Camera | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <Suspense fallback={<DialogFallback />}>
      <FullscreenCamera camera={camera} open={open} onClose={onClose} />
    </Suspense>
  );
}
