'use client';

// ESP32 CamViewer - Login Form Component
// Generated: 2025-10-19

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '@/constants';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(3, 'Usuário deve ter no mínimo 3 caracteres'),
  password: z.string().min(4, 'Senha deve ter no mínimo 4 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const login = useStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      console.log('[DEBUG] Login attempt:', { username: data.username });
      console.log('[DEBUG] Expected credentials from env:', {
        username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
      });

      const success = login(data.username, data.password);
      console.log('[DEBUG] Login result:', success);

      if (success) {
        toast.success('Login realizado com sucesso!', {
          description: `Bem-vindo, ${data.username}!`,
        });

        // Redirect to dashboard
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD);
        }, 500);
      } else {
        toast.error('Credenciais inválidas', {
          description: 'Usuário ou senha incorretos. Tente novamente.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login', {
        description: 'Ocorreu um erro. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-slate-200">
          Usuário
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Digite seu usuário"
          {...register('username')}
          disabled={isLoading}
          className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
          autoComplete="username"
        />
        {errors.username && (
          <p className="text-sm text-red-400">{errors.username.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-200">
          Senha
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            {...register('password')}
            disabled={isLoading}
            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 pr-10"
            autoComplete="current-password"
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
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Entrando...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </>
        )}
      </Button>
    </form>
  );
}
