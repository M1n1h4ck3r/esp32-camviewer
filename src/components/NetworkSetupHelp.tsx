'use client';

// ESP32 CamViewer - Network Setup Help Component
// Guides users to configure network access for production deployment

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Wifi,
  Globe,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface NetworkSetupHelpProps {
  isProduction?: boolean;
  hasOfflineCameras?: boolean;
}

export function NetworkSetupHelp({ isProduction = false, hasOfflineCameras = false }: NetworkSetupHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show on production or when cameras are offline
  if (!isProduction && !hasOfflineCameras) {
    return null;
  }

  const solutions = [
    {
      title: 'Port Forwarding (Recomendado)',
      icon: Wifi,
      difficulty: 'Intermediário',
      time: '15-30 min',
      pros: ['Gratuito', 'Controle total', 'Baixa latência'],
      cons: ['Requer acesso ao roteador', 'Expõe porta pública'],
    },
    {
      title: 'Cloudflare Tunnel',
      icon: Globe,
      difficulty: 'Intermediário',
      time: '20-40 min',
      pros: ['HTTPS automático', 'Sem port forwarding', 'Proteção DDoS'],
      cons: ['Requer PC/Raspberry Pi ligado 24/7'],
    },
    {
      title: 'DynDNS / No-IP',
      icon: Shield,
      difficulty: 'Fácil',
      time: '10-20 min',
      pros: ['IP dinâmico suportado', 'Fácil de configurar', 'Domínio customizado'],
      cons: ['Requer port forwarding também'],
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex-shrink-0 mt-1">
          <AlertCircle className="h-6 w-6 text-blue-400" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-white mb-1">
            {hasOfflineCameras
              ? '⚠️ Câmeras Offline na Produção'
              : '📡 Configure Acesso Remoto às Câmeras'}
          </h3>
          <p className="text-sm text-slate-300">
            {isProduction
              ? 'Suas câmeras ESP32-CAM estão em uma rede local (192.168.x.x) e não são acessíveis pela internet. Configure port forwarding ou use Cloudflare Tunnel.'
              : 'Para que suas câmeras funcionem quando acessar este app pela internet (Vercel), você precisa torná-las acessíveis publicamente.'}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-blue-700/30 pt-4">
              {/* Quick Diagnosis */}
              <div className="bg-slate-900/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Por que isso acontece?
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">
                      <strong className="text-white">Localhost:</strong> Seu navegador acessa
                      câmeras locais (192.168.x.x) diretamente
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">
                      <strong className="text-white">Vercel (Produção):</strong> Servidor na
                      nuvem não consegue acessar sua rede privada
                    </span>
                  </div>
                </div>
              </div>

              {/* Solutions Grid */}
              <div>
                <h4 className="font-medium text-white mb-3">Soluções Disponíveis:</h4>
                <div className="grid gap-3 md:grid-cols-3">
                  {solutions.map((solution, index) => (
                    <motion.div
                      key={solution.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800/50 rounded-lg p-3 border border-slate-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <solution.icon className="h-4 w-4 text-blue-400" />
                        <h5 className="font-medium text-white text-sm">{solution.title}</h5>
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-xs">
                        <span className="text-slate-400">Dificuldade:</span>
                        <span className="text-slate-300">{solution.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-xs">
                        <span className="text-slate-400">Tempo:</span>
                        <span className="text-slate-300">{solution.time}</span>
                      </div>
                      <div className="space-y-1">
                        {solution.pros.slice(0, 2).map((pro) => (
                          <div key={pro} className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{pro}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Start */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
                <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Começar Agora - Port Forwarding
                </h4>
                <ol className="space-y-2 text-sm text-slate-300 mb-3 list-decimal list-inside">
                  <li>Acesse seu roteador (geralmente 192.168.1.1)</li>
                  <li>Configure Port Forwarding: Porta 8081 → IP do ESP32-CAM</li>
                  <li>
                    Descubra seu IP público:{' '}
                    <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400">
                      curl api.ipify.org
                    </code>
                  </li>
                  <li>
                    Use no app:{' '}
                    <code className="bg-slate-900 px-1.5 py-0.5 rounded text-blue-400">
                      http://SEU_IP:8081
                    </code>
                  </li>
                </ol>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    window.open(
                      'https://github.com/M1n1h4ck3r/esp32-camviewer/blob/main/NETWORK_ACCESS.md',
                      '_blank'
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Guia Completo (GitHub)
                </Button>
              </div>

              {/* Security Warning */}
              <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-700/30">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-200">
                    <strong className="block mb-1">⚠️ Checklist de Segurança:</strong>
                    <ul className="space-y-0.5 list-disc list-inside">
                      <li>Use porta não-padrão (evite 80, 8080)</li>
                      <li>Configure senha forte no ESP32-CAM</li>
                      <li>Use HTTPS quando possível (Cloudflare Tunnel)</li>
                      <li>Monitore logs de acesso regularmente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
