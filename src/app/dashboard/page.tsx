'use client';

// ESP32 CamViewer - Dashboard Page
// Generated: 2025-10-19

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Camera, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraGrid } from '@/components/camera/CameraGrid';
import { AddCameraDialog } from '@/components/camera/AddCameraDialog';
import { EditCameraDialog } from '@/components/camera/EditCameraDialog';
import { DeleteCameraDialog } from '@/components/camera/DeleteCameraDialog';
import { FullscreenCamera } from '@/components/camera/FullscreenCamera';
import { NetworkSetupHelp } from '@/components/NetworkSetupHelp';
import type { Camera as CameraType } from '@/types';

export default function DashboardPage() {
  const cameras = useStore((state) => state.cameras);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);

  // Check if we're in production (Vercel)
  const isProduction = useMemo(() => {
    return typeof window !== 'undefined' &&
           (window.location.hostname.includes('vercel.app') ||
            window.location.hostname.includes('.app'));
  }, []);

  const handleExpand = (camera: CameraType) => {
    setSelectedCamera(camera);
    setFullscreenOpen(true);
  };

  const handleEdit = (camera: CameraType) => {
    setSelectedCamera(camera);
    setEditDialogOpen(true);
  };

  const handleDelete = (camera: CameraType) => {
    setSelectedCamera(camera);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard</h2>
            <p className="text-slate-400 mt-1">
              Visualize todas as suas câmeras em tempo real
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Câmera
          </Button>
        </div>

        {/* Network Setup Help (Production) */}
        {isProduction && cameras.length > 0 && (
          <NetworkSetupHelp isProduction={isProduction} hasOfflineCameras={true} />
        )}

        {/* Camera Grid or Empty State */}
        {cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Camera className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhuma câmera adicionada
            </h3>
            <p className="text-slate-400 mb-6 max-w-md">
              Comece adicionando sua primeira câmera ESP32 para visualizar o feed
              em tempo real.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Câmera
            </Button>
          </div>
        ) : (
          <CameraGrid
            cameras={cameras}
            onExpand={handleExpand}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Floating Action Button (Mobile) */}
        <button
          onClick={() => setAddDialogOpen(true)}
          className="fixed bottom-6 right-6 md:hidden h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50"
          aria-label="Adicionar câmera"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Dialogs */}
      <AddCameraDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditCameraDialog
        camera={selectedCamera}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteCameraDialog
        camera={selectedCamera}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      {/* Fullscreen Viewer */}
      <FullscreenCamera
        camera={selectedCamera}
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
      />
    </>
  );
}
