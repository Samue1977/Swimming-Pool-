/**
 * BannerPricingSystem - Sistema Enterprise di Listino Prezzi Banner
 * Sistema avanzato per gestione prezzi, pacchetti e vendita automatizzata
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
  Target,
  Zap,
  Crown,
  Star,
  Calculator,
  Settings,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  BarChart3,
  Users,
  Award,
  Sparkles
} from 'lucide-react'

// Types per il sistema di pricing
export interface BannerPosition {
  id: string
  name: string
  description: string
  base_price_monthly: number
  premium_multiplier: number
  max_banners: number
  estimated_impressions: number
  estimated_clicks: number
  conversion_rate: number
  priority_level: number
}

export interface PricingPackage {
  id: string
  name: string
  description: string
  positions: string[]
  duration_months: number
  discount_percentage: number
  bonus_features: string[]
  is_premium: boolean
  is_popular: boolean
  total_price: number
  monthly_equivalent: number
}

export interface BannerOrder {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  package_id?: string
  custom_positions: string[]
  duration_months: number
  total_amount: number
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled'
  created_at: string
  start_date?: string
  end_date?: string
  notes?: string
}

// Posizioni banner predefinite con prezzi enterprise
const DEFAULT_POSITIONS: BannerPosition[] = [
  {
    id: 'homepage-hero',
    name: 'Homepage Hero Banner',
    description: 'Posizione premium sopra la fold, massima visibilità',
    base_price_monthly: 2500,
    premium_multiplier: 2.0,
    max_banners: 1,
    estimated_impressions: 50000,
    estimated_clicks: 1500,
    conversion_rate: 3.2,
    priority_level: 10
  },
  {
    id: 'homepage-sidebar',
    name: 'Homepage Sidebar',
    description: 'Sidebar principale homepage, alta visibilità',
    base_price_monthly: 1200,
    premium_multiplier: 1.5,
    max_banners: 3,
    estimated_impressions: 25000,
    estimated_clicks: 750,
    conversion_rate: 2.8,
    priority_level: 8
  },
  {
    id: 'search-results-top',
    name: 'Search Results Top',
    description: 'Banner sopra i risultati di ricerca, targeting perfetto',
    base_price_monthly: 1800,
    premium_multiplier: 1.8,
    max_banners: 2,
    estimated_impressions: 35000,
    estimated_clicks: 1200,
    conversion_rate: 4.1,
    priority_level: 9
  },
  {
    id: 'property-detail',
    name: 'Property Detail Pages',
    description: 'Banner nelle pagine dettaglio proprietà, alta conversione',
    base_price_monthly: 900,
    premium_multiplier: 1.3,
    max_banners: 5,
    estimated_impressions: 20000,
    estimated_clicks: 600,
    conversion_rate: 3.8,
    priority_level: 7
  },
  {
    id: 'blog-articles',
    name: 'Blog & Articles',
    description: 'Banner negli articoli del blog, engagement lungo',
    base_price_monthly: 600,
    premium_multiplier: 1.2,
    max_banners: 8,
    estimated_impressions: 15000,
    estimated_clicks: 400,
    conversion_rate: 2.1,
    priority_level: 5
  },
  {
    id: 'mobile-sticky',
    name: 'Mobile Sticky Banner',
    description: 'Banner fisso su mobile, sempre visibile',
    base_price_monthly: 1500,
    premium_multiplier: 1.6,
    max_banners: 1,
    estimated_impressions: 40000,
    estimated_clicks: 1000,
    conversion_rate: 2.9,
    priority_level: 8
  }
]

// Pacchetti predefiniti enterprise
const DEFAULT_PACKAGES: PricingPackage[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    description: 'Perfetto per iniziare con visibilità mirata',
    positions: ['blog-articles', 'property-detail'],
    duration_months: 3,
    discount_percentage: 10,
    bonus_features: ['Analytics base', 'Supporto email'],
    is_premium: false,
    is_popular: false,
    total_price: 4050, // (600+900) * 3 * 0.9
    monthly_equivalent: 1350
  },
  {
    id: 'professional',
    name: 'Professional Package',
    description: 'Soluzione completa per massima visibilità',
    positions: ['homepage-sidebar', 'search-results-top', 'property-detail'],
    duration_months: 6,
    discount_percentage: 20,
    bonus_features: ['Analytics avanzate', 'A/B Testing', 'Supporto prioritario', 'Report mensili'],
    is_premium: false,
    is_popular: true,
    total_price: 17280, // (1200+1800+900) * 6 * 0.8
    monthly_equivalent: 2880
  },
  {
    id: 'enterprise',
    name: 'Enterprise Premium',
    description: 'Dominio totale del mercato immobiliare',
    positions: ['homepage-hero', 'homepage-sidebar', 'search-results-top', 'mobile-sticky'],
    duration_months: 12,
    discount_percentage: 35,
    bonus_features: [
      'Analytics enterprise',
      'Account manager dedicato',
      'Supporto 24/7',
      'Report settimanali',
      'Ottimizzazione campagne',
      'Targeting avanzato',
      'Creativi personalizzati'
    ],
    is_premium: true,
    is_popular: false,
    total_price: 46800, // (2500+1200+1800+1500) * 12 * 0.65
    monthly_equivalent: 3900
  }
]

interface BannerPricingSystemProps {
  className?: string
}

export function BannerPricingSystem({ className = '' }: BannerPricingSystemProps) {
  const [positions, setPositions] = useState<BannerPosition[]>(DEFAULT_POSITIONS)
  const [packages, setPackages] = useState<PricingPackage[]>(DEFAULT_PACKAGES)
  const [orders, setOrders] = useState<BannerOrder[]>([])
  const [activeTab, setActiveTab] = useState<'positions' | 'packages' | 'orders' | 'analytics'>('positions')
  const [loading, setLoading] = useState(false)

  // Calcola statistiche revenue
  const calculateRevenue = useCallback(() => {
    const totalRevenue = orders
      .filter(order => order.status === 'active' || order.status === 'completed')
      .reduce((sum, order) => sum + order.total_amount, 0)

    const monthlyRevenue = orders
      .filter(order => order.status === 'active')
      .reduce((sum, order) => sum + (order.total_amount / order.duration_months), 0)

    const pendingRevenue = orders
      .filter(order => order.status === 'pending')
      .reduce((sum, order) => sum + order.total_amount, 0)

    return { totalRevenue, monthlyRevenue, pendingRevenue }
  }, [orders])

  const { totalRevenue, monthlyRevenue, pendingRevenue } = calculateRevenue()

  // Componente per visualizzare posizione
  const PositionCard = ({ position }: { position: BannerPosition }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${
            position.priority_level >= 9 ? 'bg-red-100 text-red-600' :
            position.priority_level >= 7 ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600'
          }`}>
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{position.name}</h3>
            <p className="text-sm text-gray-600">{position.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {position.priority_level >= 9 && <Crown className="w-5 h-5 text-yellow-500" />}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            position.priority_level >= 9 ? 'bg-red-100 text-red-800' :
            position.priority_level >= 7 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            Priority {position.priority_level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-600">
            €{position.base_price_monthly.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">al mese</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-600">
            €{Math.round(position.base_price_monthly * position.premium_multiplier).toLocaleString()}
          </div>
          <div className="text-sm text-green-700">premium</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{position.estimated_impressions.toLocaleString()}</div>
          <div className="text-gray-600">Impressions/mese</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900">{position.estimated_clicks.toLocaleString()}</div>
          <div className="text-gray-600">Click/mese</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900">{position.conversion_rate}%</div>
          <div className="text-gray-600">Conversione</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-600">Max {position.max_banners} banner</span>
        <div className="flex space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  // Componente per visualizzare pacchetto
  const PackageCard = ({ pkg }: { pkg: PricingPackage }) => (
    <div className={`relative bg-white border-2 rounded-xl p-6 hover:shadow-xl transition-all duration-300 ${
      pkg.is_popular ? 'border-blue-500 shadow-lg' : 
      pkg.is_premium ? 'border-yellow-400 shadow-lg' : 'border-gray-200'
    }`}>
      {pkg.is_popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            🔥 PIÙ POPOLARE
          </span>
        </div>
      )}
      {pkg.is_premium && (
        <div className="absolute -top-3 right-4">
          <Crown className="w-8 h-8 text-yellow-500" />
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        
        <div className="mb-4">
          <div className="text-4xl font-bold text-blue-600 mb-1">
            €{pkg.total_price.toLocaleString()}
          </div>
          <div className="text-lg text-gray-600">
            €{pkg.monthly_equivalent.toLocaleString()}/mese
          </div>
          <div className="text-sm text-green-600 font-medium">
            Risparmi {pkg.discount_percentage}% • {pkg.duration_months} mesi
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="text-sm font-medium text-gray-900 mb-2">Posizioni incluse:</div>
        {pkg.positions.map(positionId => {
          const position = positions.find(p => p.id === positionId)
          return position ? (
            <div key={positionId} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
              <span className="text-sm font-medium">{position.name}</span>
              <span className="text-sm text-blue-600">€{position.base_price_monthly}</span>
            </div>
          ) : null
        })}
      </div>

      <div className="space-y-2 mb-6">
        <div className="text-sm font-medium text-gray-900 mb-2">Bonus inclusi:</div>
        {pkg.bonus_features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
        pkg.is_premium ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700' :
        pkg.is_popular ? 'bg-blue-600 text-white hover:bg-blue-700' :
        'bg-gray-600 text-white hover:bg-gray-700'
      }`}>
        Seleziona Pacchetto
      </button>
    </div>
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con statistiche */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sistema Prezzi Banner Enterprise</h1>
            <p className="text-blue-100">Gestione avanzata listino prezzi e vendita automatizzata</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">€{monthlyRevenue.toLocaleString()}</div>
            <div className="text-blue-100">Revenue mensile</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-green-300" />
              <div>
                <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Revenue Totale</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-yellow-300" />
              <div>
                <div className="text-2xl font-bold">€{pendingRevenue.toLocaleString()}</div>
                <div className="text-sm text-blue-100">In Attesa</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-300" />
              <div>
                <div className="text-2xl font-bold">{orders.filter(o => o.status === 'active').length}</div>
                <div className="text-sm text-blue-100">Clienti Attivi</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-orange-300" />
              <div>
                <div className="text-2xl font-bold">{positions.length}</div>
                <div className="text-sm text-blue-100">Posizioni Premium</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {[
            { key: 'positions', label: 'Posizioni & Prezzi', icon: Target },
            { key: 'packages', label: 'Pacchetti', icon: Package },
            { key: 'orders', label: 'Ordini', icon: Calendar },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Posizioni Banner Premium</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Nuova Posizione</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {positions.map(position => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Pacchetti Enterprise</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Nuovo Pacchetto</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestione Ordini</h2>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sistema Ordini in Sviluppo</h3>
            <p className="text-gray-500">Funzionalità avanzata per gestione ordini e fatturazione</p>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Revenue</h2>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Dashboard Analytics</h3>
            <p className="text-gray-500">Statistiche dettagliate performance e revenue</p>
          </div>
        </div>
      )}
    </div>
  )
}

