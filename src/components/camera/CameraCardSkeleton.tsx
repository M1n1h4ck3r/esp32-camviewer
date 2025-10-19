'use client';

// ESP32 CamViewer - Camera Card Skeleton Component
// Generated: 2025-10-19

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CameraCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-slate-800/50 border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-7 w-7 rounded" />
      </div>

      {/* Camera Feed Placeholder */}
      <div className="relative aspect-video bg-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-lg" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-slate-700 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  );
}
