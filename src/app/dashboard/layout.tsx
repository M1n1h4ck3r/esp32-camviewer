'use client';

// ESP32 CamViewer - Dashboard Layout
// Generated: 2025-10-19

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { KeyboardShortcuts } from '@/components/ui/KeyboardShortcuts';
import { LogOut, Settings, Camera, Home } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const initializeStore = useStore((state) => state.initializeStore);
  const cameras = useStore((state) => state.cameras);
  const hasHydrated = useStore((state) => state._hasHydrated);

  // Initialize store on mount (check session expiry)
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Redirect to login if not authenticated (only after hydration)
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [hasHydrated, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado', {
      description: 'Até logo!',
    });
    router.push(ROUTES.LOGIN);
  };

  // Show loading while hydrating or not authenticated
  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    ESP32 CamViewer
                  </h1>
                  <p className="text-xs text-slate-400">
                    {cameras.length} {cameras.length === 1 ? 'câmera' : 'câmeras'}
                  </p>
                </div>
              </div>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link href={ROUTES.DASHBOARD}>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href={ROUTES.CAMERAS}>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Gerenciar
                </Button>
              </Link>
              <Link href={ROUTES.SETTINGS}>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </Link>
            </nav>

            {/* Right: User and Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">
                  {currentUser?.username}
                </p>
                <p className="text-xs text-slate-400">Admin</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-600 text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-2 mt-4">
            <Link href={ROUTES.DASHBOARD} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white hover:bg-slate-700">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href={ROUTES.CAMERAS} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white hover:bg-slate-700">
                <Camera className="h-4 w-4 mr-2" />
                Câmeras
              </Button>
            </Link>
            <Link href={ROUTES.SETTINGS} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full text-slate-300 hover:text-white hover:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcuts />
    </div>
  );
}
