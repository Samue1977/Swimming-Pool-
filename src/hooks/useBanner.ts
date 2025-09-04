/**
 * useBanner Hook - COMPLETAMENTE RISCRITTO DA ZERO
 * Hook per gestire il recupero di banner per posizione specifica
 */

import { useState, useEffect, useCallback } from 'react'
import { callEdgeFunctionHTTP, Banner } from '../lib/supabase'

interface UseBannerOptions {
  position: string
  limit?: number
  activeOnly?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseBannerReturn {
  banners: Banner[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  trackView: (bannerId: string) => Promise<void>
  trackClick: (bannerId: string) => Promise<void>
}

export function useBanner({
  position,
  limit = 10,
  activeOnly = true,
  autoRefresh = false,
  refreshInterval = 30000
}: UseBannerOptions): UseBannerReturn {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBanners = useCallback(async () => {
    try {
      console.log(`🎨 [useBanner] Fetching banners for position: ${position}`)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerFetch', {
        position,
        limit: limit.toString(),
        active_only: activeOnly.toString()
      }, 'GET')
      
      if (response.success) {
        setBanners(response.data || [])
        console.log(`✅ [useBanner] Loaded ${response.data?.length || 0} banners for ${position}`)
        
        // Auto-track views for all loaded banners
        if (response.data && response.data.length > 0) {
          response.data.forEach((banner: Banner) => {
            trackView(banner.id).catch(err => 
              console.warn(`⚠️ [useBanner] View tracking failed for ${banner.id}:`, err)
            )
          })
        }
      } else {
        throw new Error(response.error || 'Failed to fetch banners')
      }
    } catch (err: any) {
      console.error(`❌ [useBanner] Fetch error:`, err)
      setError(err.message || 'Unknown error occurred')
      setBanners([])
    } finally {
      setLoading(false)
    }
  }, [position, limit, activeOnly])

  // Track view event
  const trackView = useCallback(async (bannerId: string) => {
    try {
      await callEdgeFunctionHTTP('bannerTrack', {
        banner_id: bannerId,
        event_type: 'view'
      }, 'POST')
      console.log(`👁️ [useBanner] View tracked for banner ${bannerId}`)
    } catch (err) {
      console.warn(`⚠️ [useBanner] View tracking failed:`, err)
    }
  }, [])

  // Track click event
  const trackClick = useCallback(async (bannerId: string) => {
    try {
      await callEdgeFunctionHTTP('bannerTrack', {
        banner_id: bannerId,
        event_type: 'click'
      }, 'POST')
      console.log(`💆 [useBanner] Click tracked for banner ${bannerId}`)
    } catch (err) {
      console.warn(`⚠️ [useBanner] Click tracking failed:`, err)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (position) {
      setLoading(true)
      fetchBanners()
    }
  }, [position, fetchBanners])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !position) return
    
    const interval = setInterval(fetchBanners, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchBanners, position])

  return {
    banners,
    loading,
    error,
    refetch: fetchBanners,
    trackView,
    trackClick
  }
}