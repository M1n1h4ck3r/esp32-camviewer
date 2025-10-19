'use client';

// ESP32 CamViewer - Root Page (Redirect to Login)
// Generated: 2025-10-19

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function RootPage() {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Redirect to dashboard if already authenticated, otherwise to login
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Carregando...</p>
      </div>
    </div>
  );
}
