'use client';

// ESP32 CamViewer - Delete Camera Dialog Component
// Generated: 2025-10-19

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { Camera } from '@/types';

interface DeleteCameraDialogProps {
  camera: Camera | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCameraDialog({ camera, open, onOpenChange }: DeleteCameraDialogProps) {
  const removeCamera = useStore((state) => state.removeCamera);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!camera) return;

    setIsLoading(true);

    try {
      removeCamera(camera.id);

      toast.success('Câmera removida!', {
        description: `${camera.name} foi removida com sucesso.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting camera:', error);
      toast.error('Erro ao remover câmera', {
        description: 'Ocorreu um erro. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-600/10 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <DialogTitle className="text-center text-white">
            Remover Câmera
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 pt-2">
            Tem certeza que deseja remover esta câmera?
          </DialogDescription>
        </DialogHeader>

        {camera && (
          <div className="py-4">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{camera.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{camera.deviceType}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono break-all">
                    {camera.streamUrl}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-4 text-center">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Removendo...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Sim, Remover
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
