'use client';

// ESP32 CamViewer - Edit Camera Dialog Component
// Generated: 2025-10-19

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { Edit, Save } from 'lucide-react';
import { validateCameraUrl } from '@/lib/cameraUtils';
import type { Camera } from '@/types';

const editCameraSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  streamUrl: z.string().refine(
    (url) => validateCameraUrl(url).isValid,
    {
      message: 'URL inválida. Use formato: http://192.168.1.100 ou http://camera.local',
    }
  ),
  deviceType: z.enum(['ESP32-CAM', 'AMEBA', 'OTHER']),
  isPrivate: z.boolean(),
});

type EditCameraFormData = z.infer<typeof editCameraSchema>;

interface EditCameraDialogProps {
  camera: Camera | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCameraDialog({ camera, open, onOpenChange }: EditCameraDialogProps) {
  const updateCamera = useStore((state) => state.updateCamera);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EditCameraFormData>({
    resolver: zodResolver(editCameraSchema),
    defaultValues: {
      name: '',
      streamUrl: '',
      deviceType: 'ESP32-CAM',
      isPrivate: false,
    },
  });

  const deviceType = watch('deviceType');
  const isPrivate = watch('isPrivate');

  // Update form when camera changes
  useEffect(() => {
    if (camera) {
      setValue('name', camera.name);
      setValue('streamUrl', camera.streamUrl);
      setValue('deviceType', camera.deviceType);
      setValue('isPrivate', camera.isPrivate);
    }
  }, [camera, setValue]);

  const onSubmit = async (data: EditCameraFormData) => {
    if (!camera) return;

    setIsLoading(true);

    try {
      updateCamera(camera.id, {
        name: data.name,
        streamUrl: data.streamUrl,
        deviceType: data.deviceType,
        isPrivate: data.isPrivate,
      });

      toast.success('Câmera atualizada!', {
        description: `${data.name} foi atualizada com sucesso.`,
      });

      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error updating camera:', error);
      toast.error('Erro ao atualizar câmera', {
        description: 'Ocorreu um erro. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 mb-2">
            <Edit className="h-6 w-6 text-blue-500" />
          </div>
          <DialogTitle className="text-center text-white">
            Editar Câmera
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-slate-200">
              Nome da Câmera *
            </Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="Ex: Câmera Garagem"
              {...register('name')}
              disabled={isLoading}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-streamUrl" className="text-slate-200">
              URL do Stream *
            </Label>
            <Input
              id="edit-streamUrl"
              type="text"
              placeholder="Ex: http://192.168.1.100/stream"
              {...register('streamUrl')}
              disabled={isLoading}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 font-mono text-sm"
            />
            {errors.streamUrl && (
              <p className="text-sm text-red-400">{errors.streamUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deviceType" className="text-slate-200">
              Tipo de Dispositivo
            </Label>
            <Select
              value={deviceType}
              onValueChange={(value) =>
                setValue('deviceType', value as 'ESP32-CAM' | 'AMEBA' | 'OTHER')
              }
              disabled={isLoading}
            >
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="ESP32-CAM">ESP32-CAM</SelectItem>
                <SelectItem value="AMEBA">AMEBA</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-700">
            <div className="space-y-0.5">
              <Label htmlFor="edit-isPrivate" className="text-slate-200 cursor-pointer">
                Câmera Privada
              </Label>
              <p className="text-xs text-slate-500">
                Requer senha adicional para visualizar
              </p>
            </div>
            <Switch
              id="edit-isPrivate"
              checked={isPrivate}
              onCheckedChange={(checked) => setValue('isPrivate', checked)}
              disabled={isLoading}
            />
          </div>

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
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
