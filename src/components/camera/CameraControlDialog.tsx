'use client';

// ESP32 CamViewer - Camera Control Dialog
// Controls for ESP32-CAM resolution, quality, and other settings

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Settings, Loader2 } from 'lucide-react';
import type { Camera } from '@/types';

interface CameraControlDialogProps {
  camera: Camera | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ESP32-CAM resolution options
const RESOLUTIONS = [
  { value: '0', label: 'QQVGA (160x120)' },
  { value: '1', label: 'QCIF (176x144)' },
  { value: '2', label: 'HQVGA (240x176)' },
  { value: '3', label: 'QVGA (320x240)' },
  { value: '4', label: 'CIF (400x296)' },
  { value: '5', label: 'VGA (640x480)' },
  { value: '6', label: 'SVGA (800x600)' },
  { value: '7', label: 'XGA (1024x768)' },
  { value: '8', label: 'SXGA (1280x1024)' },
  { value: '9', label: 'UXGA (1600x1200)' },
];

// Quality options (0-63, lower is better quality)
const QUALITY_OPTIONS = [
  { value: '10', label: 'Máxima (10)' },
  { value: '20', label: 'Alta (20)' },
  { value: '30', label: 'Média (30)' },
  { value: '40', label: 'Baixa (40)' },
];

export function CameraControlDialog({
  camera,
  open,
  onOpenChange,
}: CameraControlDialogProps) {
  const [resolution, setResolution] = useState('7'); // XGA default
  const [quality, setQuality] = useState('20');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setResolution('7');
      setQuality('20');
    }
  }, [open]);

  const handleApply = async () => {
    if (!camera) return;

    setIsLoading(true);

    try {
      // Extract base URL (remove /stream or any path)
      const baseUrl = camera.streamUrl.replace(/\/(stream|capture|status).*$/, '');

      // ESP32-CAM control endpoints
      const controlUrl = `${baseUrl}/control?var=framesize&val=${resolution}`;
      const qualityUrl = `${baseUrl}/control?var=quality&val=${quality}`;

      // Apply resolution
      const resResponse = await fetch(controlUrl, {
        method: 'GET',
        mode: 'no-cors' // ESP32-CAM may not have CORS enabled
      });

      // Apply quality
      const qualResponse = await fetch(qualityUrl, {
        method: 'GET',
        mode: 'no-cors'
      });

      toast.success('Configurações aplicadas!', {
        description: `Resolução: ${RESOLUTIONS.find(r => r.value === resolution)?.label}\nQualidade: ${QUALITY_OPTIONS.find(q => q.value === quality)?.label}`,
      });

      // Wait a bit for camera to apply settings
      setTimeout(() => {
        onOpenChange(false);
      }, 500);

    } catch (error) {
      console.error('Error applying camera settings:', error);
      toast.error('Erro ao aplicar configurações', {
        description: 'Verifique se a câmera está online e suporta controles HTTP.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!camera) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            Controlar Câmera
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {camera.name} - Ajuste resolução e qualidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resolution Selection */}
          <div className="space-y-2">
            <Label htmlFor="resolution" className="text-slate-200">
              Resolução
            </Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger
                id="resolution"
                className="bg-slate-900/50 border-slate-600 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {RESOLUTIONS.map((res) => (
                  <SelectItem
                    key={res.value}
                    value={res.value}
                    className="text-white hover:bg-slate-700"
                  >
                    {res.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              Resoluções maiores podem causar lag dependendo da rede
            </p>
          </div>

          {/* Quality Selection */}
          <div className="space-y-2">
            <Label htmlFor="quality" className="text-slate-200">
              Qualidade JPEG
            </Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger
                id="quality"
                className="bg-slate-900/50 border-slate-600 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {QUALITY_OPTIONS.map((qual) => (
                  <SelectItem
                    key={qual.value}
                    value={qual.value}
                    className="text-white hover:bg-slate-700"
                  >
                    {qual.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-400">
              Qualidade maior = mais dados pela rede
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              💡 <strong>Dica:</strong> Essas configurações são aplicadas via endpoint <code>/control</code> do ESP32-CAM.
              Certifique-se que seu firmware suporta esses comandos.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aplicando...
              </>
            ) : (
              'Aplicar'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
