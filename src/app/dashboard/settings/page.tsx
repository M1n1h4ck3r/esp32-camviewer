'use client';

// ESP32 CamViewer - Settings Page
// Generated: 2025-10-19

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Lock,
  Grid3x3,
  Clock,
  Palette,
  Eye,
  EyeOff,
  Save,
  Check
} from 'lucide-react';
import { hashPassword, comparePassword } from '@/lib/auth';

export default function SettingsPage() {
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);

  // Privacy Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Grid Layout State
  const [gridLayout, setGridLayout] = useState(settings.gridLayout);

  // Refresh Interval State
  const [refreshInterval, setRefreshInterval] = useState(settings.refreshInterval);

  // Theme State (placeholder for future implementation)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Campos vazios', {
        description: 'Por favor, preencha todos os campos.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Senhas não coincidem', {
        description: 'A nova senha e a confirmação devem ser iguais.',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Senha muito curta', {
        description: 'A senha deve ter no mínimo 6 caracteres.',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      // Verify current password
      const isValid = comparePassword(currentPassword, settings.privacyPasswordHash);

      if (!isValid) {
        toast.error('Senha incorreta', {
          description: 'A senha atual está incorreta.',
        });
        setIsChangingPassword(false);
        return;
      }

      // Hash and update new password
      const newHash = hashPassword(newPassword);
      updateSettings({ privacyPasswordHash: newHash });

      toast.success('Senha alterada!', {
        description: 'A senha de privacidade foi atualizada com sucesso.',
      });

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Erro ao alterar senha', {
        description: 'Ocorreu um erro. Por favor, tente novamente.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveGridLayout = () => {
    updateSettings({ gridLayout });
    toast.success('Layout salvo!', {
      description: `Layout alterado para ${gridLayout}.`,
    });
  };

  const handleSaveRefreshInterval = () => {
    if (refreshInterval < 1 || refreshInterval > 60) {
      toast.error('Intervalo inválido', {
        description: 'O intervalo deve estar entre 1 e 60 segundos.',
      });
      return;
    }

    updateSettings({ refreshInterval });
    toast.success('Intervalo salvo!', {
      description: `Atualização a cada ${refreshInterval} segundos.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Configurações
        </h2>
        <p className="text-slate-400 mt-1">
          Personalize sua experiência no ESP32 CamViewer
        </p>
      </div>

      {/* Privacy Password Section */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-red-600/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Senha de Privacidade</h3>
            <p className="text-sm text-slate-400">
              Altere a senha para desbloquear câmeras privadas
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-slate-700" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-slate-200">
              Senha Atual *
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
                className="bg-slate-900/50 border-slate-600 text-white pr-10"
                placeholder="Digite a senha atual"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-slate-200">
              Nova Senha *
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
                className="bg-slate-900/50 border-slate-600 text-white pr-10"
                placeholder="Digite a nova senha (mín. 6 caracteres)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-slate-200">
              Confirmar Nova Senha *
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
                className="bg-slate-900/50 border-slate-600 text-white pr-10"
                placeholder="Confirme a nova senha"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
          >
            {isChangingPassword ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Alterando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Alterar Senha
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Grid Layout Section */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center">
            <Grid3x3 className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Layout de Grade</h3>
            <p className="text-sm text-slate-400">
              Escolha quantas câmeras exibir por linha
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-slate-700" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grid-layout" className="text-slate-200">
              Layout
            </Label>
            <Select value={gridLayout} onValueChange={(value: '2x2' | '3x3' | '4x4' | 'auto') => setGridLayout(value)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white w-full sm:w-64">
                <SelectValue placeholder="Selecione o layout" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="auto">Automático (Responsivo)</SelectItem>
                <SelectItem value="2x2">2x2 (4 câmeras por tela)</SelectItem>
                <SelectItem value="3x3">3x3 (9 câmeras por tela)</SelectItem>
                <SelectItem value="4x4">4x4 (16 câmeras por tela)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSaveGridLayout}
            disabled={gridLayout === settings.gridLayout}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Salvar Layout
          </Button>
        </div>
      </Card>

      {/* Refresh Interval Section */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-green-600/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Intervalo de Atualização</h3>
            <p className="text-sm text-slate-400">
              Tempo entre atualizações automáticas das câmeras
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-slate-700" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="refresh-interval" className="text-slate-200">
              Intervalo (segundos)
            </Label>
            <Input
              id="refresh-interval"
              type="number"
              min={1}
              max={60}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-slate-900/50 border-slate-600 text-white w-full sm:w-64"
            />
            <p className="text-xs text-slate-500">
              Valores recomendados: 3-10 segundos
            </p>
          </div>

          <Button
            onClick={handleSaveRefreshInterval}
            disabled={refreshInterval === settings.refreshInterval}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Salvar Intervalo
          </Button>
        </div>
      </Card>

      {/* Theme Section (Placeholder) */}
      <Card className="bg-slate-800/50 border-slate-700 p-6 opacity-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-purple-600/10 flex items-center justify-center">
            <Palette className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Tema</h3>
            <p className="text-sm text-slate-400">
              Em breve: Modo claro, escuro e automático
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-slate-700" />

        <div className="space-y-4">
          <p className="text-sm text-slate-500 italic">
            Funcionalidade em desenvolvimento...
          </p>
        </div>
      </Card>
    </div>
  );
}
