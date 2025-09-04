/**
 * SofiaRSSSection Component - SISTEMA SOFIA RSS AVANZATO
 * Sezione Sofia RSS con aggregazione intelligente da feed reali + fallback premium
 */

import React, { useState, useEffect } from 'react'
import { RefreshCw, ExternalLink, Calendar, MapPin, TrendingUp, Newspaper, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { aggregateRSSFeeds, rssCache } from '../lib/rssProcessor'

interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  source: string
  location?: string
  price?: string
  category: string
  imageUrl?: string
}

interface SofiaRSSData {
  items: RSSItem[]
  lastUpdated: string
  sources: string[]
  totalItems: number
}

interface SofiaRSSProps {
  maxItems?: number
  autoRefresh?: boolean
  refreshInterval?: number
  showHeader?: boolean
  compact?: boolean
  className?: string
}

export function SofiaRSSSection({
  maxItems = 8,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minuti
  showHeader = true,
  compact = false,
  className = ''
}: SofiaRSSProps) {
  const [data, setData] = useState<SofiaRSSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  // Fetch dei dati RSS con sistema avanzato
  const fetchRSSData = async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🚀 [SOFIA_RSS] Starting advanced RSS aggregation...')
      
      // Controlla cache prima
      if (useCache) {
        const cachedData = rssCache.get('rss_data')
        if (cachedData) {
          console.log('📦 [SOFIA_RSS] Using cached data')
          setData(cachedData)
          setLastRefresh(new Date(cachedData.lastUpdated))
          setLoading(false)
          return
        }
      }
      
      // Aggrega feed RSS reali
      const rssData = await aggregateRSSFeeds()
      
      // Limita al numero richiesto
      const limitedData = {
        ...rssData,
        items: rssData.items.slice(0, maxItems)
      }
      
      // Salva in cache
      rssCache.set('rss_data', limitedData)
      
      setData(limitedData)
      setLastRefresh(new Date())
      setIsOnline(true)
      
      console.log(`✅ [SOFIA_RSS] Success: ${limitedData.totalItems} items from ${limitedData.sources.length} sources`)
      
    } catch (err: any) {
      console.error('❌ [SOFIA_RSS] Error:', err)
      setError('Errore nel caricamento feed RSS')
      setIsOnline(false)
      
      // Prova a usare dati in cache anche se scaduti
      const cachedData = rssCache.get('rss_data')
      if (cachedData) {
        setData(cachedData)
        setError('Modalità offline: mostrando contenuti in cache')
      }
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh setup
  useEffect(() => {
    fetchRSSData()
    
    if (autoRefresh) {
      const interval = setInterval(fetchRSSData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [maxItems, autoRefresh, refreshInterval])

  // Utility functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Appena pubblicato'
    if (diffHours < 24) return `${diffHours}h fa`
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'luxury': return '💎'
      case 'mercato': return '📈'
      case 'investimenti': return '💰'
      default: return '🏠'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'luxury': return 'bg-purple-100 text-purple-800'
      case 'mercato': return 'bg-blue-100 text-blue-800'
      case 'investimenti': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (compact) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Sofia RSS</h4>
          </div>
          <button
            onClick={() => fetchRSSData(false)}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        {data && (
          <div className="space-y-3">
            {data.items.slice(0, 3).map((item, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3">
                <h5 className="font-medium text-sm text-gray-900 line-clamp-2">
                  {item.title}
                </h5>
                <p className="text-xs text-gray-600 mt-1">
                  {item.source} • {formatDate(item.pubDate)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <section className={`py-12 bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-full">
                <Newspaper className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Sofia RSS Immobiliare
                </h2>
                <p className="text-blue-600 font-medium">Aggregatore Intelligente</p>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Le ultime notizie e opportunità dal mercato immobiliare italiano,
              selezionate e aggregate automaticamente da Sofia AI
            </p>
            
            {lastRefresh && (
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Ultimo aggiornamento: {lastRefresh.toLocaleTimeString('it-IT')}</span>
                </div>
                {data && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{data.totalItems} articoli da {data.sources.length} fonti</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600">Offline</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => fetchRSSData(false)}
                  disabled={loading}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Aggiorna</span>
                </button>
              </div>
            )}
          </div>
        )}

        {loading && !data && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Caricamento feed RSS...</span>
          </div>
        )}

        {error && !data && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Errore nel caricamento</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => fetchRSSData(false)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Riprova
            </button>
          </div>
        )}

        {data && (
          <div className="grid lg:grid-cols-2 gap-6">
            {data.items.map((item, index) => (
              <article key={index} className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Immagine se disponibile */}
                {item.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Nascondi immagine se fallisce il caricamento
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(item.category)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        {item.location && (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{item.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-medium">{item.source}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.pubDate)}</span>
                          </div>
                        </div>
                        
                        {item.price && (
                          <div className="text-lg font-bold text-green-600">
                            {item.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      <span>Leggi articolo</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    
                    <div className="text-xs text-gray-400">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {data && data.items.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nessun articolo disponibile</h3>
            <p className="text-gray-500">Sofia sta raccogliendo i nuovi contenuti. Riprova tra qualche minuto.</p>
          </div>
        )}
      </div>
    </section>
  )
}