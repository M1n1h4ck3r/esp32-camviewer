'use client';

// ESP32 CamViewer - Unlock Camera Dialog Component
// Generated: 2025-10-19

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import type { Camera } from '@/types';

// Validation schema
const unlockSchema = z.object({
  password: z.string().min(4, 'Senha muito curta'),
});

type UnlockFormData = z.infer<typeof unlockSchema>;

interface UnlockCameraDialogProps {
  camera: Camera;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnlockCameraDialog({
  camera,
  open,
  onOpenChange,
}: UnlockCameraDialogProps) {
  const unlockCamera = useStore((state) => state.unlockCamera);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnlockFormData>({
    resolver: zodResolver(unlockSchema),
  });

  const onSubmit = async (data: UnlockFormData) => {
    setIsLoading(true);

    try {
      const success = await unlockCamera(camera.id, data.password);

      if (success) {
        toast.success('Câmera desbloqueada!', {
          description: `${camera.name} agora está visível.`,
        });
        reset();
        onOpenChange(false);
      } else {
        toast.error('Senha incorreta', {
          description: 'A senha de privacidade está incorreta. Tente novamente.',
        });
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('Erro ao desbloquear', {
        description: 'Ocorreu um erro. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600/10 mb-2">
            <Lock className="h-6 w-6 text-yellow-500" />
          </div>
          <DialogTitle className="text-center text-white">
            Câmera Privada
          </DialogTitle>
          <p className="text-center text-sm text-slate-400 mt-2">
            {camera.name}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Senha de Privacidade
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite a senha"
                {...register('password')}
                disabled={isLoading}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 pr-10"
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
            <p className="text-xs text-slate-500">
              Senha padrão: <span className="font-mono">privacy123</span>
            </p>
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
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verificando...
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Desbloquear
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
