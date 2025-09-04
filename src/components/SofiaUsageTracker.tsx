/**
 * SofiaUsageTracker - Sistema di Tracking Query per Modello Freemium
 * Gestisce il conteggio delle query gratuite e il trigger per l'upgrade premium
 */

import React, { useState, useEffect, createContext, useContext } from 'react'

interface UserUsage {
  freeQueriesUsed: number
  freeQueriesLimit: number
  isPremium: boolean
  subscriptionDate?: Date
  lastQueryDate?: Date
  userId?: string
}

interface UsageContextType {
  usage: UserUsage
  incrementUsage: () => boolean // Returns true if query allowed, false if limit reached
  upgradeToPremium: () => void
  resetUsage: () => void
  canMakeQuery: () => boolean
}

const UsageContext = createContext<UsageContextType | null>(null)

const DEFAULT_USAGE: UserUsage = {
  freeQueriesUsed: 0,
  freeQueriesLimit: 2, // Solo 2 query gratuite
  isPremium: false
}

// Hook per utilizzare il context
export function useUsageTracker() {
  const context = useContext(UsageContext)
  if (!context) {
    throw new Error('useUsageTracker must be used within a UsageProvider')
  }
  return context
}

// Provider component
export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [usage, setUsage] = useState<UserUsage>(() => {
    // Carica dati dal localStorage se disponibili
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sofia_usage')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            ...DEFAULT_USAGE,
            ...parsed,
            subscriptionDate: parsed.subscriptionDate ? new Date(parsed.subscriptionDate) : undefined,
            lastQueryDate: parsed.lastQueryDate ? new Date(parsed.lastQueryDate) : undefined
          }
        } catch (e) {
          console.error('Error parsing saved usage data:', e)
        }
      }
    }
    return DEFAULT_USAGE
  })

  // Salva nel localStorage quando usage cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sofia_usage', JSON.stringify(usage))
    }
  }, [usage])

  // Genera un userId unico se non esiste
  useEffect(() => {
    if (!usage.userId) {
      const userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
      setUsage(prev => ({ ...prev, userId }))
    }
  }, [usage.userId])

  const incrementUsage = (): boolean => {
    if (usage.isPremium) {
      // Gli utenti premium hanno query illimitate
      setUsage(prev => ({
        ...prev,
        lastQueryDate: new Date()
      }))
      return true
    }

    if (usage.freeQueriesUsed >= usage.freeQueriesLimit) {
      // Limite raggiunto
      return false
    }

    setUsage(prev => ({
      ...prev,
      freeQueriesUsed: prev.freeQueriesUsed + 1,
      lastQueryDate: new Date()
    }))

    return true
  }

  const upgradeToPremium = () => {
    setUsage(prev => ({
      ...prev,
      isPremium: true,
      subscriptionDate: new Date()
    }))

    // Invia evento di conversione per analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: 'sofia_premium_' + Date.now(),
        value: 4.99,
        currency: 'EUR',
        items: [{
          item_id: 'sofia_premium_monthly',
          item_name: 'Sofia Premium Monthly',
          category: 'subscription',
          quantity: 1,
          price: 4.99
        }]
      })
    }
  }

  const resetUsage = () => {
    setUsage(DEFAULT_USAGE)
  }

  const canMakeQuery = (): boolean => {
    return usage.isPremium || usage.freeQueriesUsed < usage.freeQueriesLimit
  }

  const contextValue: UsageContextType = {
    usage,
    incrementUsage,
    upgradeToPremium,
    resetUsage,
    canMakeQuery
  }

  return (
    <UsageContext.Provider value={contextValue}>
      {children}
    </UsageContext.Provider>
  )
}

// Componente per mostrare lo stato delle query
export function UsageIndicator({ className = '' }: { className?: string }) {
  const { usage } = useUsageTracker()

  if (usage.isPremium) {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
        <span className="text-gold-600 font-medium">Premium Attivo</span>
      </div>
    )
  }

  const remaining = usage.freeQueriesLimit - usage.freeQueriesUsed
  const percentage = (usage.freeQueriesUsed / usage.freeQueriesLimit) * 100

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>Query gratuite</span>
        <span>{usage.freeQueriesUsed}/{usage.freeQueriesLimit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`h-1.5 rounded-full transition-all duration-300 ${
            percentage >= 100 ? 'bg-red-500' : 
            percentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      {remaining > 0 ? (
        <p className="text-xs text-gray-500 mt-1">
          {remaining} query rimanenti
        </p>
      ) : (
        <p className="text-xs text-red-600 mt-1 font-medium">
          Limite raggiunto - Passa a Premium!
        </p>
      )}
    </div>
  )
}

// Hook per analytics e tracking
export function useAnalytics() {
  const { usage } = useUsageTracker()

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        ...properties,
        user_id: usage.userId,
        is_premium: usage.isPremium,
        queries_used: usage.freeQueriesUsed
      })
    }

    // Console log per debug
    console.log('Analytics Event:', eventName, {
      ...properties,
      userId: usage.userId,
      isPremium: usage.isPremium,
      queriesUsed: usage.freeQueriesUsed
    })
  }

  const trackQueryAttempt = (allowed: boolean) => {
    trackEvent('sofia_query_attempt', {
      allowed,
      queries_remaining: usage.freeQueriesLimit - usage.freeQueriesUsed
    })
  }

  const trackUpgradeView = () => {
    trackEvent('sofia_upgrade_view', {
      trigger_point: usage.freeQueriesUsed >= usage.freeQueriesLimit ? 'limit_reached' : 'manual'
    })
  }

  const trackUpgradeStart = (plan: 'monthly' | 'yearly') => {
    trackEvent('sofia_upgrade_start', {
      plan,
      value: plan === 'monthly' ? 4.99 : 49.99
    })
  }

  return {
    trackEvent,
    trackQueryAttempt,
    trackUpgradeView,
    trackUpgradeStart
  }
}

