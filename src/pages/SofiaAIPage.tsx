/**
 * SofiaAIPage - Pagina dedicata a Sofia AI Assistant
 * Landing page che spiega tutte le funzionalità di Sofia e il modello premium
 */

import React, { useState } from 'react'
import {
  Bot,
  Crown,
  Star,
  Zap,
  Target,
  TrendingUp,
  Calculator,
  Shield,
  Users,
  Home,
  BarChart3,
  Clock,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Award,
  MessageCircle,
  Search,
  DollarSign,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

interface Feature {
  icon: React.ComponentType<any>
  title: string
  description: string
  isPremium: boolean
  category: 'search' | 'analysis' | 'tools' | 'support'
}

const features: Feature[] = [
  {
    icon: MessageCircle,
    title: 'Chat AI Conversazionale',
    description: 'Interagisci con Sofia in linguaggio naturale per qualsiasi domanda immobiliare',
    isPremium: false,
    category: 'support'
  },
  {
    icon: Search,
    title: 'Ricerca Base Proprietà',
    description: 'Cerca proprietà nel nostro database con filtri di base',
    isPremium: false,
    category: 'search'
  },
  {
    icon: Target,
    title: 'Ricerca Multi-Portale',
    description: 'Accesso simultaneo a 15+ portali immobiliari (Immobiliare.it, Casa.it, Idealista, ecc.)',
    isPremium: true,
    category: 'search'
  },
  {
    icon: Calculator,
    title: 'Calcolatore Mutui Avanzato',
    description: 'Simulazioni mutui con 25+ banche italiane, tassi aggiornati in tempo reale',
    isPremium: true,
    category: 'tools'
  },
  {
    icon: BarChart3,
    title: 'Analisi di Mercato AI',
    description: 'Valutazioni immobiliari precise, trend di mercato e previsioni AI',
    isPremium: true,
    category: 'analysis'
  },
  {
    icon: TrendingUp,
    title: 'Consulente Investimenti',
    description: 'Consigli personalizzati su ROI, rendite e opportunità di investimento',
    isPremium: true,
    category: 'analysis'
  },
  {
    icon: Shield,
    title: 'Supporto Legale',
    description: 'Guida su contratti, tasse, agevolazioni fiscali e pratiche burocratiche',
    isPremium: true,
    category: 'support'
  },
  {
    icon: Zap,
    title: 'Alert Prioritari',
    description: 'Notifiche immediate per nuove proprietà che matchano i tuoi criteri',
    isPremium: true,
    category: 'search'
  },
  {
    icon: Home,
    title: 'Tour Virtuali Premium',
    description: 'Accesso esclusivo a tour 3D e video HD delle proprietà',
    isPremium: true,
    category: 'tools'
  },
  {
    icon: Users,
    title: 'Consulenza Esperta 1-on-1',
    description: 'Sessioni personalizzate con esperti immobiliari certificati',
    isPremium: true,
    category: 'support'
  }
]

const testimonials = [
  {
    name: "Marco Rossi",
    role: "Investitore Immobiliare",
    location: "Milano",
    text: "Sofia mi ha fatto risparmiare €50.000 su un investimento a Milano. L'analisi di mercato AI è incredibilmente precisa!",
    rating: 5,
    avatar: "M"
  },
  {
    name: "Giulia Bianchi",
    role: "Acquirente Prima Casa",
    location: "Roma",
    text: "Il calcolatore mutui premium mi ha aiutato a trovare il tasso migliore. Sto risparmiando €200 al mese!",
    rating: 5,
    avatar: "G"
  },
  {
    name: "Alessandro Verdi",
    role: "Agente Immobiliare",
    location: "Firenze",
    text: "I miei clienti sono impressionati dalle analisi di Sofia. Ho chiuso 3 vendite in più questo mese grazie a lei!",
    rating: 5,
    avatar: "A"
  },
  {
    name: "Francesca Neri",
    role: "Investitrice Luxury",
    location: "Costa Amalfitana",
    text: "Sofia Premium mi ha trovato una villa esclusiva prima che andasse sul mercato. ROI del 340% in 6 mesi!",
    rating: 5,
    avatar: "F"
  }
]

const competitorComparison = [
  {
    feature: 'AI Conversazionale Avanzata',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Ricerca Multi-Portale',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Calcolatore Mutui 25+ Banche',
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
    feature: 'Consulenza Personalizzata',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Supporto Legale/Fiscale',
    sofia: true,
    immobiliare: false,
    casa: false,
    idealista: false
  },
  {
    feature: 'Tour Virtuali Premium',
    sofia: true,
    immobiliare: true,
    casa: false,
    idealista: true
  },
  {
    feature: 'Alert Intelligenti',
    sofia: true,
    immobiliare: true,
    casa: true,
    idealista: true
  }
]

export function SofiaAIPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'search' | 'analysis' | 'tools' | 'support'>('all')
  const [showComparison, setShowComparison] = useState(false)

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(f => f.category === selectedCategory)

  const freeFeatures = features.filter(f => !f.isPremium)
  const premiumFeatures = features.filter(f => f.isPremium)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">ItalyRE Pro</h1>
              </a>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Proprietà</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Servizi</a>
              <a href="#" className="text-blue-600 font-medium">Sofia AI</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contatti</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white/20 p-3 rounded-full">
                  <Bot className="w-8 h-8" />
                </div>
                <h1 className="text-5xl font-bold">Sofia AI</h1>
                <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  RIVOLUZIONARIA
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">
                L'Assistente AI più Avanzata per l'Immobiliare Italiano
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Sofia è l'unica AI che combina ricerca multi-portale, analisi di mercato avanzata e consulenza personalizzata. 
                <strong className="text-white"> Nessun competitor offre quello che hai tu!</strong>
              </p>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-6 h-6" />
                  <span>Prova Sofia Gratis</span>
                </button>
                <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                  <Crown className="w-6 h-6" />
                  <span>Passa a Premium</span>
                </button>
              </div>

              <div className="mt-8 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>2 query gratuite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Nessuna carta richiesta</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Upgrade quando vuoi</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="/sofia-avatar.png"
                    alt="Sofia AI"
                    className="w-16 h-16 rounded-full border-2 border-white"
                  />
                  <div>
                    <h3 className="text-xl font-bold">Sofia AI Assistant</h3>
                    <p className="text-blue-100">Online • Pronta ad aiutarti</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-sm">
                      "Ciao! Sono Sofia. Posso aiutarti a trovare la casa perfetta, calcolare il mutuo migliore e analizzare il mercato immobiliare. Cosa ti serve oggi?"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 text-sm transition-colors">
                      🏠 Cerca Casa
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 text-sm transition-colors">
                      💰 Calcola Mutuo
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 text-sm transition-colors">
                      📊 Analisi Mercato
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 rounded-lg p-3 text-sm transition-colors">
                      🎯 Investimenti
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">2.847</div>
                <div className="text-sm">Utenti Attivi</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-gray-900 rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold">97%</div>
                <div className="text-sm">Soddisfazione</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Cosa Può Fare Sofia per Te
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sofia combina intelligenza artificiale avanzata con expertise immobiliare per offrirti un'esperienza unica
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
              {[
                { key: 'all', label: 'Tutte', icon: Sparkles },
                { key: 'search', label: 'Ricerca', icon: Search },
                { key: 'analysis', label: 'Analisi', icon: BarChart3 },
                { key: 'tools', label: 'Strumenti', icon: Calculator },
                { key: 'support', label: 'Supporto', icon: Users }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature, index) => (
              <div key={index} className={`rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                feature.isPremium 
                  ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    feature.isPremium ? 'bg-yellow-400 text-gray-900' : 'bg-blue-600 text-white'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      {feature.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    {feature.isPremium && (
                      <div className="mt-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Premium Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Gratuito vs Premium
            </h3>
            <p className="text-lg text-gray-600">
              Inizia gratis e scopri il potenziale di Sofia, poi sblocca tutto con Premium
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Sofia Gratuita</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">€0</div>
                <p className="text-gray-600">2 query gratuite per iniziare</p>
              </div>

              <div className="space-y-4 mb-8">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Inizia Gratis
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                  PIÙ POPOLARE
                </span>
              </div>

              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <span>Sofia Premium</span>
                </h4>
                <div className="text-3xl font-bold text-yellow-600 mb-2">€4.99</div>
                <p className="text-gray-600">al mese • Query illimitate</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="text-sm font-medium text-gray-900 mb-3">
                  Tutto del piano gratuito, più:
                </div>
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Crown className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
                Passa a Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Perché Sofia è Superiore alla Concorrenza
            </h3>
            <p className="text-lg text-gray-600">
              Confronta Sofia con i principali portali immobiliari italiani
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Funzionalità</th>
                  <th className="text-center py-4 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-blue-600">Sofia AI</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-gray-600">Immobiliare.it</th>
                  <th className="text-center py-4 px-4 text-gray-600">Casa.it</th>
                  <th className="text-center py-4 px-4 text-gray-600">Idealista</th>
                </tr>
              </thead>
              <tbody>
                {competitorComparison.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {row.sofia ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.immobiliare ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.casa ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.idealista ? (
                        <Check className="w-6 h-6 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-6 h-6 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              🏆 Sofia AI offre 6 funzionalità esclusive che nessun competitor ha!
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Scopri Tutte le Funzionalità
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Cosa Dicono i Nostri Utenti
            </h3>
            <p className="text-lg text-gray-600">
              Oltre 2.847 professionisti si fidano di Sofia AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Pronto a Rivoluzionare la Tua Esperienza Immobiliare?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Inizia gratis con 2 query e scopri perché Sofia AI è l'assistente immobiliare più avanzato d'Italia
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <MessageCircle className="w-6 h-6" />
              <span>Inizia Gratis Ora</span>
            </button>
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors flex items-center space-x-2">
              <Crown className="w-6 h-6" />
              <span>Vai Diretto a Premium</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Pagamento sicuro</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Cancella quando vuoi</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Garanzia 30 giorni</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">ItalyRE Pro</h5>
              <p className="text-sm text-gray-400">
                Il futuro dell'immobiliare italiano con Sofia AI.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Sofia AI</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Come Funziona</a></li>
                <li><a href="#" className="hover:text-white">Funzionalità</a></li>
                <li><a href="#" className="hover:text-white">Prezzi</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Supporto</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Centro Assistenza</a></li>
                <li><a href="#" className="hover:text-white">Contattaci</a></li>
                <li><a href="#" className="hover:text-white">Tutorial</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contatti</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+39 06 1234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>sofia@italyre.pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Via Roma 123, Roma</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2025 ItalyRE Pro. Tutti i diritti riservati. Sofia AI è un marchio registrato.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

