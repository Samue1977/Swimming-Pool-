/**
 * Supabase Configuration - CREDENZIALI CORRETTE AGGIORNATE
 * Configurazione centralizzata con le credenziali fornite dall'utente
 */

import { createClient } from '@supabase/supabase-js'

// Credenziali Supabase corrette fornite dall'utente
const supabaseUrl = 'https://rgqpnnvtosylnxtqyloh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncXBubnZ0b3N5bG54dHF5bG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTU3NDMsImV4cCI6MjA3MDA3MTc0M30.-LNya9Jk6w-MtiWo2DvVOcZu1WtYValjhIYO8qDls9E'

console.log('🔧 [SUPABASE] Initializing with URL:', supabaseUrl)

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Centralized configuration for Edge Functions
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  edgeFunctions: {
    // Banner system functions (CORRETTI)
    bannerFetch: 'banner-fetch',
    bannerTrack: 'banner-track', 
    bannerAdmin: 'banner-admin',
    bannerAnalytics: 'banner-analytics',
    // Analytics system (AGGIUNTO)
    analytics: 'get-analytics',
    // Sofia RSS function (FONDAMENTALE)
    sofiaRSS: 'sofia-rss-aggregator'
  }
}

/**
 * Utility function for Edge Function calls with centralized configuration
 * @param functionName - Nome della Edge Function
 * @param params - Parametri da passare
 * @param method - Metodo HTTP
 * @returns Promise con il risultato
 */
export async function callEdgeFunction(
  functionName: keyof typeof supabaseConfig.edgeFunctions,
  params: Record<string, any> = {},
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  try {
    console.log(`🚀 [EDGE_FUNCTION] Calling ${functionName} with params:`, params)
    
    // Use Supabase client's functions.invoke for proper handling
    const { data, error } = await supabase.functions.invoke(
      supabaseConfig.edgeFunctions[functionName],
      {
        method,
        body: method !== 'GET' ? params : undefined
      }
    )
    
    if (error) {
      console.error(`❌ [EDGE_FUNCTION] ${functionName} error:`, error)
      throw error
    }
    
    console.log(`✅ [EDGE_FUNCTION] ${functionName} success:`, data)
    return data
  } catch (error: any) {
    console.error(`💥 [EDGE_FUNCTION] ${functionName} failed:`, error)
    throw error
  }
}

/**
 * Utility function for direct HTTP calls to Edge Functions with query parameters
 * Useful for GET requests with URL parameters and additional HTTP methods
 */
export async function callEdgeFunctionHTTP(
  functionName: keyof typeof supabaseConfig.edgeFunctions,
  params: Record<string, any> = {},
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
) {
  try {
    const functionSlug = supabaseConfig.edgeFunctions[functionName]
    let url = `${supabaseUrl}/functions/v1/${functionSlug}`
    
    // Add query parameters for GET requests
    if (method === 'GET' && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value))
      })
      url += `?${searchParams.toString()}`
    }
    
    console.log(`🌐 [HTTP] ${method} ${url}`)
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    }
    
    if (method !== 'GET') {
      options.body = JSON.stringify(params)
    }
    
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log(`✅ [HTTP] ${functionName} success`)
    return data
  } catch (error: any) {
    console.error(`💥 [HTTP] ${functionName} failed:`, error)
    throw error
  }
}

// Types for better development experience
export interface Banner {
  id: string
  title: string
  image_url?: string
  link_url?: string
  content_html?: string
  position: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  click_count: number
  view_count: number
}

export interface BannerAnalytics {
  id: string
  banner_id: string
  event_type: 'view' | 'click'
  ip_address?: string
  user_agent?: string
  country?: string
  timestamp: string
}

export interface AnalyticsOverview {
  summary: {
    total_banners: number
    active_banners: number
    total_views: number
    total_clicks: number
    click_through_rate: number
    recent_views: number
    recent_clicks: number
  }
  top_performers: Banner[]
  positions: {
    position: string
    banner_count: number
    total_views: number
    total_clicks: number
    avg_ctr: number
  }[]
}

// Export for external usage
export { supabaseUrl, supabaseAnonKey }