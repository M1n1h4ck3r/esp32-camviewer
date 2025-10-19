'use client';

// ESP32 CamViewer - Error State Component
// Generated: 2025-10-19

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  onRetry,
  retryLabel = 'Tentar Novamente',
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="h-16 w-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4"
      >
        <AlertCircle className="h-8 w-8 text-red-500" />
      </motion.div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6 max-w-md">{description}</p>

      {onRetry && (
        <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}
