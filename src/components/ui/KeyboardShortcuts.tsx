'use client';

// ESP32 CamViewer - Keyboard Shortcuts Component
// Generated: 2025-10-19

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['?'], description: 'Mostrar atalhos de teclado', category: 'Geral' },
  { keys: ['Esc'], description: 'Fechar modal/fullscreen', category: 'Geral' },
  { keys: ['Ctrl', 'K'], description: 'Buscar câmeras', category: 'Navegação' },
  { keys: ['G', 'D'], description: 'Ir para Dashboard', category: 'Navegação' },
  { keys: ['G', 'C'], description: 'Ir para Câmeras', category: 'Navegação' },
  { keys: ['G', 'S'], description: 'Ir para Configurações', category: 'Navegação' },
  { keys: ['N'], description: 'Nova câmera', category: 'Ações' },
  { keys: ['F'], description: 'Tela cheia (quando expandido)', category: 'Visualização' },
  { keys: ['R'], description: 'Atualizar câmera (quando expandido)', category: 'Visualização' },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show shortcuts with "?"
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 h-12 w-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white shadow-lg flex items-center justify-center transition-colors z-40"
        aria-label="Atalhos de teclado"
        title="Atalhos de teclado (?)"
      >
        <Keyboard className="h-5 w-5" />
      </motion.button>

      {/* Shortcuts Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 mb-2">
              <Keyboard className="h-6 w-6 text-blue-500" />
            </div>
            <DialogTitle className="text-center text-white">
              Atalhos de Teclado
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              Use esses atalhos para navegar mais rápido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors"
                      >
                        <span className="text-sm text-slate-300">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <kbd
                              key={i}
                              className={cn(
                                'px-2 py-1 text-xs font-semibold text-white bg-slate-700 border border-slate-600 rounded shadow-sm',
                                i > 0 && 'ml-1'
                              )}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700">
            Pressione <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-white">?</kbd> a qualquer momento para ver os atalhos
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
