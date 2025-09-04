/**
 * SofiaPremiumSystem - Sistema di Monetizzazione Sofia AI
 * Gestisce il modello freemium con upgrade a €4.99/mese dopo 2 interrogazioni
 */

import React, { useState, useEffect } from 'react'
import {
  Crown,
  Star,
  Lock,
  CreditCard,
  Check,
  X,
  Zap,
  TrendingUp,
  Shield,
  Users,
  Calculator,
  Home,
  DollarSign,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
  BarChart3
} from 'lucide-react'

interface PremiumFeature {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  category: 'search' | 'analysis' | 'tools' | 'support'
}

interface UserUsage {
  freeQueriesUsed: number
  freeQueriesLimit: number
  isPremium: boolean
  subscriptionDate?: Date
  lastQueryDate?: Date
}

interface SofiaPremiumSystemProps {
  currentUsage: UserUsage
  onUpgrade: () => void
  onClose: () => void
  isVisible: boolean
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: 'multi_source_search',
    name: 'Ricerca Multi-Fonte',
    description: 'Accesso a 15+ portali immobiliari (Immobiliare.it, Casa.it, Idealista, ecc.)',
    icon: Target,
    category: 'search'
  },
  {
    id: 'mortgage_calculator',
    name: 'Calcolatore Mutui Avanzato',
    description: 'Simulazioni mutui con 25+ banche italiane e tassi aggiornati',
    icon: Calculator,
    category: 'tools'
  },
  {
    id: 'market_analysis',
    name: 'Analisi di Mercato AI',
    description: 'Valutazioni immobiliari precise e trend di mercato in tempo reale',
    icon: BarChart3,
    category: 'analysis'
  },
  {
    id: 'investment_advisor',
    name: 'Consulente Investimenti',
    description: 'Consigli personalizzati su ROI, rendite e opportunità di investimento',
    icon: TrendingUp,
    category: 'analysis'
  },
  {
    id: 'legal_support',
    name: 'Supporto Legale',
    description: 'Guida su contratti, tasse, agevolazioni fiscali e pratiche burocratiche',
    icon: Shield,
    category: 'support'
  },
  {
    id: 'priority_alerts',
    name: 'Alert Prioritari',
    description: 'Notifiche immediate per nuove proprietà che matchano i tuoi criteri',
    icon: Zap,
    category: 'search'
  },
  {
    id: 'virtual_tours',
    name: 'Tour Virtuali Premium',
    description: 'Accesso esclusivo a tour 3D e video HD delle proprietà',
    icon: Home,
    category: 'tools'
  },
  {
    id: 'expert_consultation',
    name: 'Consulenza Esperta',
    description: 'Sessioni 1-on-1 con esperti immobiliari certificati',
    icon: Users,
    category: 'support'
  }
]

const competitorComparison = [
  {
    feature: 'Ricerca Multi-Portale',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'AI Conversazionale',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Calcolatore Mutui Avanzato',
    sofia: true,
    immobiliare: true,
    casa: false,
    idealista: true
  },
  {
    feature: 'Analisi Mercato Real-Time',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Supporto 24/7',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Consulenza Personalizzata',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  }
]

export function SofiaPremiumSystem({ 
  currentUsage, 
  onUpgrade, 
  onClose, 
  isVisible 
}: SofiaPremiumSystemProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [showComparison, setShowComparison] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  // Animazione di entrata
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimationStep(1), 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const monthlyPrice = 4.99
  const yearlyPrice = 49.99 // 2 mesi gratis
  const yearlyDiscount = Math.round((1 - (yearlyPrice / (monthlyPrice * 12))) * 100)

  const remainingQueries = currentUsage.freeQueriesLimit - currentUsage.freeQueriesUsed

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ${
        animationStep === 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
          <div className="relative z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Sofia Premium</h2>
                <p className="text-blue-100">L'esperienza immobiliare completa</p>
              </div>
            </div>

            {/* Usage indicator */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Query gratuite utilizzate</span>
                <span className="text-sm font-bold">{currentUsage.freeQueriesUsed}/{currentUsage.freeQueriesLimit}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(currentUsage.freeQueriesUsed / currentUsage.freeQueriesLimit) * 100}%` }}
                ></div>
              </div>
              {remainingQueries > 0 ? (
                <p className="text-sm text-blue-100 mt-2">
                  Ti rimangono <strong>{remainingQueries}</strong> query gratuite
                </p>
              ) : (
                <p className="text-sm text-yellow-200 mt-2 flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  Hai esaurito le query gratuite. Passa a Premium per continuare!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Value Proposition */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              🚀 Sblocca il Potere Completo di Sofia AI
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Accedi a funzionalità esclusive che ti daranno un vantaggio decisivo nel mercato immobiliare italiano. 
              <strong className="text-purple-600"> Nessun competitor offre quello che hai tu!</strong>
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            
            {/* Monthly Plan */}
            <div className={`border-2 rounded-xl p-6 transition-all cursor-pointer ${
              selectedPlan === 'monthly' 
                ? 'border-purple-500 bg-purple-50 shadow-lg' 
                : 'border-gray-200 hover:border-purple-300'
            }`} onClick={() => setSelectedPlan('monthly')}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900">Piano Mensile</h4>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedPlan === 'monthly' 
                    ? 'border-purple-500 bg-purple-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'monthly' && (
                    <Check className="w-3 h-3 text-white m-0.5" />
                  )}
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                €{monthlyPrice}
                <span className="text-lg text-gray-500 font-normal">/mese</span>
              </div>
              <p className="text-gray-600 text-sm">Perfetto per iniziare</p>
            </div>

            {/* Yearly Plan */}
            <div className={`border-2 rounded-xl p-6 transition-all cursor-pointer relative ${
              selectedPlan === 'yearly' 
                ? 'border-green-500 bg-green-50 shadow-lg' 
                : 'border-gray-200 hover:border-green-300'
            }`} onClick={() => setSelectedPlan('yearly')}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  RISPARMIA {yearlyDiscount}%
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900">Piano Annuale</h4>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedPlan === 'yearly' 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === 'yearly' && (
                    <Check className="w-3 h-3 text-white m-0.5" />
                  )}
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                €{yearlyPrice}
                <span className="text-lg text-gray-500 font-normal">/anno</span>
              </div>
              <p className="text-gray-600 text-sm">2 mesi gratis inclusi!</p>
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              🎯 Funzionalità Premium Esclusive
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumFeatures.map((feature) => (
                <div key={feature.id} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <h5 className="font-semibold text-gray-900 text-sm">{feature.name}</h5>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Comparison */}
          <div className="mb-8">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="w-full bg-gray-100 hover:bg-gray-200 rounded-lg p-4 flex items-center justify-between transition-colors"
            >
              <span className="font-semibold text-gray-900">
                📊 Confronto con la Concorrenza
              </span>
              <ArrowRight className={`w-5 h-5 text-gray-600 transition-transform ${
                showComparison ? 'rotate-90' : ''
              }`} />
            </button>
            
            {showComparison && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Funzionalità</th>
                      <th className="text-center py-3 px-2">
                        <div className="flex items-center justify-center space-x-1">
                          <Crown className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-purple-600">Sofia AI</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-2 text-gray-600">Immobiliare.it</th>
                      <th className="text-center py-3 px-2 text-gray-600">Casa.it</th>
                      <th className="text-center py-3 px-2 text-gray-600">Idealista</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorComparison.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 font-medium">{row.feature}</td>
                        <td className="text-center py-3 px-2">
                          {row.sofia ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-3 px-2">
                          {row.immobiliare ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-3 px-2">
                          {row.casa ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                        <td className="text-center py-3 px-2">
                          {row.idealista ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
              🏆 Cosa Dicono i Nostri Utenti Premium
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  name: "Marco R.",
                  role: "Investitore Immobiliare",
                  text: "Sofia mi ha fatto risparmiare €50k su un investimento a Milano. Il ROI analysis è incredibile!",
                  rating: 5
                },
                {
                  name: "Giulia T.",
                  role: "Prima Casa",
                  text: "Il calcolatore mutui mi ha aiutato a trovare il tasso migliore. Risparmiato €200/mese!",
                  rating: 5
                },
                {
                  name: "Alessandro M.",
                  role: "Agente Immobiliare",
                  text: "I miei clienti sono impressionati dalle analisi di Sofia. Ho chiuso 3 vendite in più questo mese!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-3">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
            >
              <CreditCard className="w-6 h-6" />
              <span>
                Passa a Premium - €{selectedPlan === 'monthly' ? monthlyPrice : yearlyPrice}
                {selectedPlan === 'monthly' ? '/mese' : '/anno'}
              </span>
              <Sparkles className="w-6 h-6" />
            </button>
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Pagamento sicuro</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Cancella quando vuoi</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Garanzia 30 giorni</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Unisciti a oltre 2.847 professionisti che usano Sofia Premium per dominare il mercato immobiliare
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

