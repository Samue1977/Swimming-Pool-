/**
 * SofiaHomepageAvatar - Avatar Sofia AI per Homepage
 * Componente per mostrare Sofia come assistente AI pronta a servire gli utenti
 */

import React, { useState, useEffect } from 'react'
import {
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Star,
  Zap,
  Bot,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react'

interface SofiaHomepageAvatarProps {
  className?: string
  onChatOpen?: () => void
}

export function SofiaHomepageAvatar({ className = '', onChatOpen }: SofiaHomepageAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)

  // Status messages che cambiano dinamicamente
  const statusMessages = [
    "Analizzando il mercato immobiliare...",
    "Ottimizzando le tue campagne...",
    "Generando lead qualificati...",
    "Monitorando le performance...",
    "Pronta ad aiutarti! 🚀"
  ]

  // Cambia status message ogni 3 secondi
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(prev => (prev + 1) % statusMessages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Statistiche in tempo reale (simulate)
  const [stats, setStats] = useState({
    activeClients: 47,
    leadsToday: 23,
    revenue: 15420
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeClients: prev.activeClients + Math.floor(Math.random() * 3),
        leadsToday: prev.leadsToday + Math.floor(Math.random() * 2),
        revenue: prev.revenue + Math.floor(Math.random() * 500)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Sofia Avatar Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-6">
          {/* Avatar con animazioni */}
          <div className="relative">
            <div className={`relative transition-transform duration-300 ${isAnimating ? 'animate-pulse' : ''}`}>
              <img
                src="/sofia-avatar.png"
                alt="Sofia AI Assistant"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              
              {/* Status indicator */}
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              
              {/* Sparkle effects */}
              <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -top-4 -left-8 bg-white rounded-lg px-3 py-1 shadow-md border animate-float">
              <div className="text-xs font-semibold text-green-600">+{stats.leadsToday} lead oggi</div>
            </div>
          </div>

          {/* Sofia Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">Sofia AI</h3>
              <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                PRO
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                PREMIUM
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">
              Assistente AI Commerciale • Esperta in Marketing Immobiliare
            </p>

            {/* Status dinamico */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700 font-medium">
                {statusMessages[currentStatus]}
              </span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{stats.activeClients}</div>
                <div className="text-xs text-gray-600">Clienti Attivi</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">€{stats.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Revenue Oggi</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">97%</div>
                <div className="text-xs text-gray-600">Soddisfazione</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onChatOpen}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Parla con Sofia</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl relative"
              >
                <Zap className="w-5 h-5" />
                <span>Demo Live</span>
                
                {showTooltip && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                    Vedi Sofia in azione!
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Capabilities showcase */}
        <div className="mt-6 pt-6 border-t border-blue-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">🚀 Cosa posso fare per te:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, text: "Analisi Mercato", color: "text-green-600" },
              { icon: Users, text: "Lead Generation", color: "text-blue-600" },
              { icon: Star, text: "Preventivi AI", color: "text-yellow-600" },
              { icon: Bot, text: "Vendita 24/7", color: "text-purple-600" }
            ].map((capability, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white rounded-lg p-2 shadow-sm">
                <capability.icon className={`w-4 h-4 ${capability.color}`} />
                <span className="text-xs font-medium text-gray-700">{capability.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live activity feed */}
        <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">🔴 Attività Live</span>
            <span className="text-xs text-gray-500">Aggiornato ora</span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-600 flex items-center space-x-2">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span>Nuovo lead qualificato da Milano</span>
              <span className="text-gray-400">• 2 min fa</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <span>Preventivo €15.600 inviato</span>
              <span className="text-gray-400">• 5 min fa</span>
            </div>
            <div className="text-xs text-gray-600 flex items-center space-x-2">
              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
              <span>Campagna ottimizzata (+23% CTR)</span>
              <span className="text-gray-400">• 8 min fa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating testimonial */}
      <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl border max-w-xs animate-float-delayed">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Marco R.</div>
            <div className="text-xs text-gray-600 mb-1">Agenzia Milano</div>
            <div className="flex items-center space-x-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-700">
              "Sofia ha triplicato i nostri lead in 2 mesi!"
            </p>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

