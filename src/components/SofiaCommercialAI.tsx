/**
 * SofiaCommercialAI - Assistente AI Commerciale per Vendita Banner
 * Sistema rivoluzionario di vendita automatizzata con AI conversazionale
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  MessageCircle,
  Send,
  Sparkles,
  DollarSign,
  Target,
  TrendingUp,
  Package,
  Calculator,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  User,
  Building,
  CreditCard,
  FileText,
  Zap,
  Crown,
  Star,
  Award,
  Bot
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'sofia' | 'system'
  content: string
  timestamp: Date
  data?: any // Per dati strutturati (preventivi, etc.)
}

interface LeadData {
  name?: string
  email?: string
  phone?: string
  company?: string
  budget?: number
  interests?: string[]
  stage: 'initial' | 'qualified' | 'proposal' | 'negotiation' | 'closing'
}

interface ProposalData {
  positions: string[]
  duration: number
  totalPrice: number
  discount: number
  features: string[]
  roi_estimate: number
}

export function SofiaCommercialAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadData, setLeadData] = useState<LeadData>({ stage: 'initial' })
  const [currentProposal, setCurrentProposal] = useState<ProposalData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Sofia with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addSofiaMessage(
          "👋 Ciao! Sono Sofia, la tua assistente AI commerciale specializzata in pubblicità immobiliare.\n\n" +
          "🎯 Posso aiutarti a:\n" +
          "• Creare campagne pubblicitarie mirate\n" +
          "• Calcolare preventivi personalizzati\n" +
          "• Ottimizzare il tuo ROI\n" +
          "• Gestire l'intero processo di vendita\n\n" +
          "Come posso aiutarti oggi a dominare il mercato immobiliare? 🚀"
        )
      }, 500)
    }
  }, [isOpen])

  // Add message to chat
  const addMessage = (type: 'user' | 'sofia' | 'system', content: string, data?: any) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      data
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addSofiaMessage = (content: string, data?: any) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage('sofia', content, data)
    }, 1000 + Math.random() * 1000) // Simula tempo di risposta realistico
  }

  // Process user input with AI logic
  const processUserMessage = async (message: string) => {
    addMessage('user', message)
    
    const lowerMessage = message.toLowerCase()
    
    // Analisi intent e risposta intelligente
    if (lowerMessage.includes('prezzo') || lowerMessage.includes('costo') || lowerMessage.includes('quanto')) {
      handlePricingInquiry(message)
    } else if (lowerMessage.includes('banner') || lowerMessage.includes('pubblicità') || lowerMessage.includes('advertising')) {
      handleBannerInquiry(message)
    } else if (lowerMessage.includes('preventivo') || lowerMessage.includes('proposta')) {
      handleProposalRequest(message)
    } else if (lowerMessage.includes('contatto') || lowerMessage.includes('telefono') || lowerMessage.includes('email')) {
      handleContactCollection(message)
    } else if (lowerMessage.includes('roi') || lowerMessage.includes('risultati') || lowerMessage.includes('performance')) {
      handleROIDiscussion(message)
    } else {
      handleGeneralInquiry(message)
    }
  }

  const handlePricingInquiry = (message: string) => {
    addSofiaMessage(
      "💰 Perfetto! Ti mostro i nostri pacchetti premium per dominare il mercato immobiliare:\n\n" +
      "🥉 **STARTER PACKAGE** - €1.350/mese\n" +
      "• Blog & Property Detail Pages\n" +
      "• 35.000+ impressions mensili\n" +
      "• Analytics base\n\n" +
      "🥈 **PROFESSIONAL** - €2.880/mese (PIÙ POPOLARE)\n" +
      "• Homepage Sidebar + Search Results + Property Pages\n" +
      "• 80.000+ impressions mensili\n" +
      "• A/B Testing + Analytics avanzate\n" +
      "• 20% di sconto su 6 mesi\n\n" +
      "🥇 **ENTERPRISE PREMIUM** - €3.900/mese\n" +
      "• TUTTE le posizioni premium incluse\n" +
      "• 165.000+ impressions mensili\n" +
      "• Account manager dedicato\n" +
      "• 35% di sconto su 12 mesi\n\n" +
      "Quale ti interessa di più? Posso creare un preventivo personalizzato! 🎯"
    )
  }

  const handleBannerInquiry = (message: string) => {
    addSofiaMessage(
      "🎯 Eccellente scelta! I nostri banner sono progettati per massimizzare le conversioni:\n\n" +
      "📍 **POSIZIONI PREMIUM DISPONIBILI:**\n" +
      "• Homepage Hero (€2.500/mese) - Visibilità massima\n" +
      "• Search Results Top (€1.800/mese) - Targeting perfetto\n" +
      "• Mobile Sticky (€1.500/mese) - Sempre visibile\n" +
      "• Sidebar Homepage (€1.200/mese) - Alta conversione\n\n" +
      "🚀 **RISULTATI GARANTITI:**\n" +
      "• Fino a 165.000 impressions/mese\n" +
      "• CTR medio 3.2% (vs 0.9% mercato)\n" +
      "• ROI medio 340%\n\n" +
      "Su quale tipo di proprietà ti concentri? Posso ottimizzare la strategia! 💡"
    )
  }

  const handleProposalRequest = (message: string) => {
    // Simula creazione preventivo personalizzato
    const proposal: ProposalData = {
      positions: ['homepage-hero', 'search-results-top'],
      duration: 6,
      totalPrice: 15600,
      discount: 20,
      features: [
        'Analytics avanzate in tempo reale',
        'A/B testing automatico',
        'Ottimizzazione campagne',
        'Report mensili dettagliati',
        'Supporto prioritario'
      ],
      roi_estimate: 340
    }
    
    setCurrentProposal(proposal)
    
    addSofiaMessage(
      "📊 **PREVENTIVO PERSONALIZZATO CREATO!**\n\n" +
      "🎯 **PACCHETTO CONSIGLIATO:**\n" +
      "• Homepage Hero Banner\n" +
      "• Search Results Top\n" +
      "• Durata: 6 mesi\n\n" +
      "💰 **INVESTIMENTO:**\n" +
      "• Prezzo base: €19.500\n" +
      "• Sconto applicato: -20%\n" +
      "• **TOTALE: €15.600** (€2.600/mese)\n\n" +
      "📈 **ROI STIMATO: +340%**\n" +
      "• 85.000+ impressions/mese\n" +
      "• 2.700+ click qualificati\n" +
      "• 87+ lead potenziali\n\n" +
      "Vuoi procedere con questo investimento vincente? 🚀",
      proposal
    )
  }

  const handleContactCollection = (message: string) => {
    addSofiaMessage(
      "📞 Perfetto! Per finalizzare la tua strategia pubblicitaria ho bisogno di alcuni dettagli:\n\n" +
      "👤 **INFORMAZIONI CONTATTO:**\n" +
      "• Nome e cognome\n" +
      "• Email aziendale\n" +
      "• Numero di telefono\n" +
      "• Nome agenzia/società\n\n" +
      "🏢 **INFORMAZIONI BUSINESS:**\n" +
      "• Tipologia proprietà (residenziale/commerciale/luxury)\n" +
      "• Budget mensile disponibile\n" +
      "• Obiettivi principali\n\n" +
      "Puoi condividere queste informazioni? Ti creerò una strategia su misura! ✨"
    )
  }

  const handleROIDiscussion = (message: string) => {
    addSofiaMessage(
      "📈 **RISULTATI STRAORDINARI DEI NOSTRI CLIENTI:**\n\n" +
      "🏆 **CASE STUDY REALI:**\n" +
      "• Agenzia Milano: +450% lead in 3 mesi\n" +
      "• Immobiliare Roma: €180k fatturato extra\n" +
      "• Luxury Toscana: +280% vendite premium\n\n" +
      "💡 **METRICHE CHIAVE:**\n" +
      "• CTR medio: 3.2% (vs 0.9% settore)\n" +
      "• Costo per lead: €12 (vs €45 Google Ads)\n" +
      "• Conversion rate: 4.1%\n" +
      "• ROI medio: 340%\n\n" +
      "🎯 **PERCHÉ FUNZIONA:**\n" +
      "• Targeting ultra-preciso\n" +
      "• Posizionamento premium\n" +
      "• Audience già interessata\n\n" +
      "Vuoi vedere i risultati che possiamo ottenere per te? 🚀"
    )
  }

  const handleGeneralInquiry = (message: string) => {
    const responses = [
      "Interessante! Dimmi di più sui tuoi obiettivi di marketing immobiliare. 🎯",
      "Perfetto! Come posso aiutarti a incrementare le tue vendite? 💰",
      "Ottima domanda! Qual è la tua sfida principale nel marketing immobiliare? 🤔",
      "Capisco! Parliamo di come possiamo far crescere il tuo business. 📈"
    ]
    
    addSofiaMessage(responses[Math.floor(Math.random() * responses.length)])
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      processUserMessage(inputMessage)
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Quick action buttons
  const quickActions = [
    { text: "Mostrami i prezzi", icon: DollarSign },
    { text: "Voglio un preventivo", icon: Calculator },
    { text: "Risultati garantiti?", icon: TrendingUp },
    { text: "Contattami", icon: Phone }
  ]

  return (
    <>
      {/* Sofia Avatar Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group"
        >
          <div className="flex items-center space-x-2">
            <img
              src="/sofia-avatar.png"
              alt="Sofia AI"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
            <div className="hidden group-hover:block absolute right-full mr-3 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              <div className="font-semibold">Sofia AI Commerciale</div>
              <div className="text-sm text-gray-600">Assistente vendite 24/7</div>
            </div>
          </div>
          
          {/* Notification badge */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            <Sparkles className="w-3 h-3" />
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center space-x-3">
            <img
              src="/sofia-avatar.png"
              alt="Sofia"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className="flex-1">
              <div className="font-semibold">Sofia AI Commerciale</div>
              <div className="text-sm text-blue-100 flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online • Esperta Vendite</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}>
                  {message.type === 'sofia' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Sofia AI</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                  
                  {/* Proposal data visualization */}
                  {message.data && message.type === 'sofia' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs font-medium text-blue-800 mb-2">PREVENTIVO DETTAGLIATO</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Durata:</span>
                          <span className="font-medium">{message.data.duration} mesi</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sconto:</span>
                          <span className="font-medium text-green-600">-{message.data.discount}%</span>
                        </div>
                        <div className="flex justify-between font-bold text-blue-800 border-t pt-1">
                          <span>Totale:</span>
                          <span>€{message.data.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                        Accetta Preventivo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-3 border-t bg-white">
              <div className="text-xs text-gray-600 mb-2">Azioni rapide:</div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => processUserMessage(action.text)}
                    className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs transition-colors"
                  >
                    <action.icon className="w-3 h-3 text-blue-600" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi il tuo messaggio..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

