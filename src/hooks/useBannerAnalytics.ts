/**
 * useBannerAnalytics Hook - COMPLETAMENTE RISCRITTO DA ZERO
 * Hook per recuperare dati analytics dei banner
 */

import { useState, useCallback, useEffect } from 'react'
import { callEdgeFunctionHTTP, AnalyticsOverview } from '../lib/supabase'

interface AnalyticsPerformance {
  banners: {
    id: string
    title: string
    position: string
    views: number
    clicks: number
    ctr: number
    is_active: boolean
    created_at: string
    performance_score: number
  }[]
  averages: {
    avg_views: number
    avg_clicks: number
    avg_ctr: number
  }
}

interface AnalyticsTimeline {
  daily_timeline: {
    date: string
    views: number
    clicks: number
    ctr: number
  }[]
  total_events: number
}

interface AnalyticsExport {
  events: {
    timestamp: string
    banner_id: string
    event_type: string
    ip_address?: string
    country?: string
  }[]
  total_count: number
  date_range: {
    from: string
    to: string
  }
}

interface UseBannerAnalyticsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  defaultDays?: number
}

interface UseBannerAnalyticsReturn {
  overview: AnalyticsOverview | null
  performance: AnalyticsPerformance | null
  timeline: AnalyticsTimeline | null
  exportData: AnalyticsExport | null
  loading: boolean
  error: string | null
  getOverview: (days?: number) => Promise<void>
  getPerformance: (days?: number) => Promise<void>
  getTimeline: (days?: number) => Promise<void>
  getExportData: (days?: number) => Promise<void>
  exportToCSV: (days?: number) => Promise<string | null>
}

export function useBannerAnalytics({
  autoRefresh = false,
  refreshInterval = 60000,
  defaultDays = 30
}: UseBannerAnalyticsOptions = {}): UseBannerAnalyticsReturn {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [performance, setPerformance] = useState<AnalyticsPerformance | null>(null)
  const [timeline, setTimeline] = useState<AnalyticsTimeline | null>(null)
  const [exportData, setExportData] = useState<AnalyticsExport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getOverview = useCallback(async (days = defaultDays) => {
    try {
      console.log(`📊 [useBannerAnalytics] Fetching overview for ${days} days`)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAnalytics', {
        type: 'overview',
        days: days.toString()
      }, 'GET')
      
      if (response.success) {
        setOverview(response.data)
        console.log('✅ [useBannerAnalytics] Overview fetched successfully')
      } else {
        throw new Error(response.error || 'Failed to fetch overview')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAnalytics] Overview error:', err)
      setError(err.message)
      setOverview(null)
    } finally {
      setLoading(false)
    }
  }, [defaultDays])

  const getPerformance = useCallback(async (days = defaultDays) => {
    try {
      console.log(`🏆 [useBannerAnalytics] Fetching performance for ${days} days`)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAnalytics', {
        type: 'performance',
        days: days.toString()
      }, 'GET')
      
      if (response.success) {
        setPerformance(response.data)
        console.log('✅ [useBannerAnalytics] Performance fetched successfully')
      } else {
        throw new Error(response.error || 'Failed to fetch performance')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAnalytics] Performance error:', err)
      setError(err.message)
      setPerformance(null)
    } finally {
      setLoading(false)
    }
  }, [defaultDays])

  const getTimeline = useCallback(async (days = defaultDays) => {
    try {
      console.log(`📈 [useBannerAnalytics] Fetching timeline for ${days} days`)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAnalytics', {
        type: 'timeline',
        days: days.toString()
      }, 'GET')
      
      if (response.success) {
        setTimeline(response.data)
        console.log('✅ [useBannerAnalytics] Timeline fetched successfully')
      } else {
        throw new Error(response.error || 'Failed to fetch timeline')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAnalytics] Timeline error:', err)
      setError(err.message)
      setTimeline(null)
    } finally {
      setLoading(false)
    }
  }, [defaultDays])

  const getExportData = useCallback(async (days = defaultDays) => {
    try {
      console.log(`📎 [useBannerAnalytics] Fetching export data for ${days} days`)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAnalytics', {
        type: 'export',
        days: days.toString()
      }, 'GET')
      
      if (response.success) {
        setExportData(response.data)
        console.log('✅ [useBannerAnalytics] Export data fetched successfully')
      } else {
        throw new Error(response.error || 'Failed to fetch export data')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAnalytics] Export data error:', err)
      setError(err.message)
      setExportData(null)
    } finally {
      setLoading(false)
    }
  }, [defaultDays])

  const exportToCSV = useCallback(async (days = defaultDays): Promise<string | null> => {
    try {
      console.log(`💾 [useBannerAnalytics] Exporting CSV for ${days} days`)
      
      // First get the export data
      await getExportData(days)
      
      if (!exportData?.events) {
        throw new Error('No export data available')
      }
      
      // Convert to CSV format
      const headers = ['Timestamp', 'Banner ID', 'Event Type', 'IP Address', 'Country']
      const csvRows = [headers.join(',')]
      
      exportData.events.forEach(event => {
        const row = [
          event.timestamp,
          event.banner_id,
          event.event_type,
          event.ip_address || 'N/A',
          event.country || 'Unknown'
        ]
        csvRows.push(row.map(field => `"${field}"`).join(','))
      })
      
      const csvContent = csvRows.join('\n')
      console.log('✅ [useBannerAnalytics] CSV export generated successfully')
      
      return csvContent
    } catch (err: any) {
      console.error('❌ [useBannerAnalytics] CSV export error:', err)
      setError(err.message)
      return null
    }
  }, [exportData, getExportData, defaultDays])

  // Auto refresh overview data
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      getOverview()
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, getOverview])

  return {
    overview,
    performance,
    timeline,
    exportData,
    loading,
    error,
    getOverview,
    getPerformance,
    getTimeline,
    getExportData,
    exportToCSV
  }
}