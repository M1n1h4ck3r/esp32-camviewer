'use client';

// ESP32 CamViewer - Cameras Management Page
// Dedicated page for managing all cameras

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Camera, Plus, Settings, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCameraDialog } from '@/components/camera/AddCameraDialog';
import { EditCameraDialog } from '@/components/camera/EditCameraDialog';
import { DeleteCameraDialog } from '@/components/camera/DeleteCameraDialog';
import { CameraControlDialog } from '@/components/camera/CameraControlDialog';
import type { Camera as CameraType } from '@/types';

export default function CamerasPage() {
  const cameras = useStore((state) => state.cameras);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [controlDialogOpen, setControlDialogOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);

  const handleControl = (camera: CameraType) => {
    setSelectedCamera(camera);
    setControlDialogOpen(true);
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
            <h2 className="text-3xl font-bold text-white">Gerenciar Câmeras</h2>
            <p className="text-slate-400 mt-1">
              Configure, edite e controle todas as suas câmeras ESP32
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

        {/* Camera List or Empty State */}
        {cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Camera className="h-10 w-10 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhuma câmera adicionada
            </h3>
            <p className="text-slate-400 mb-6 max-w-md">
              Comece adicionando sua primeira câmera ESP32 para gerenciar e
              visualizar.
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
              >
                {/* Camera Preview */}
                <div className="aspect-video bg-slate-900 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={camera.streamUrl}
                    alt={camera.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23334155" width="100" height="100"/%3E%3Ctext fill="%23475569" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EOffline%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Camera Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-white text-lg">
                    {camera.name}
                  </h3>
                  {camera.location && (
                    <p className="text-sm text-slate-400">{camera.location}</p>
                  )}
                  <p className="text-xs text-slate-500 font-mono break-all">
                    {camera.streamUrl}
                  </p>
                  {camera.isPrivate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      🔒 Privada
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleControl(camera)}
                    className="border-slate-600 text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(camera)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(camera)}
                    className="border-slate-600 text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {cameras.length > 0 && (
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{cameras.length}</p>
                <p className="text-sm text-slate-400">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {cameras.filter((c) => !c.isPrivate).length}
                </p>
                <p className="text-sm text-slate-400">Públicas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">
                  {cameras.filter((c) => c.isPrivate).length}
                </p>
                <p className="text-sm text-slate-400">Privadas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {20 - cameras.length}
                </p>
                <p className="text-sm text-slate-400">Disponíveis</p>
              </div>
            </div>
          </div>
        )}
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
      <CameraControlDialog
        camera={selectedCamera}
        open={controlDialogOpen}
        onOpenChange={setControlDialogOpen}
      />
    </>
  );
}
