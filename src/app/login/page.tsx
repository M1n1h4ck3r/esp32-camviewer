'use client';

// ESP32 CamViewer - Login Page
// Generated: 2025-10-19

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { LoginForm } from '@/components/LoginForm';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ESP32 CamViewer
          </h1>
          <p className="text-slate-400">
            Sistema de Visualização de Câmeras
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl p-8">
          <LoginForm />
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Credenciais padrão:</p>
          <p className="font-mono mt-1">
            Usuário: <span className="text-slate-400">admin</span> / Senha:{' '}
            <span className="text-slate-400">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
