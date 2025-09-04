/**
 * useBannerAdmin Hook - COMPLETAMENTE RISCRITTO DA ZERO
 * Hook per operazioni admin sui banner (CRUD)
 */

import { useState, useCallback } from 'react'
import { callEdgeFunctionHTTP, Banner } from '../lib/supabase'

interface CreateBannerData {
  title: string
  image_url?: string
  link_url?: string
  content_html?: string
  position: string
  is_active?: boolean
  display_order?: number
}

interface UpdateBannerData extends Partial<CreateBannerData> {
  id: string
}

interface UseBannerAdminReturn {
  loading: boolean
  error: string | null
  createBanner: (data: CreateBannerData) => Promise<Banner | null>
  updateBanner: (data: UpdateBannerData) => Promise<Banner | null>
  deleteBanner: (id: string) => Promise<boolean>
  getAllBanners: (limit?: number) => Promise<Banner[]>
  getBannersByPosition: (position: string, limit?: number) => Promise<Banner[]>
  updateBannerOrder: (bannerId: string, newOrder: number) => Promise<Banner | null>
}

export function useBannerAdmin(): UseBannerAdminReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBanner = useCallback(async (data: CreateBannerData): Promise<Banner | null> => {
    try {
      console.log('🆕 [useBannerAdmin] Creating banner:', data.title)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAdmin', {
        ...data,
        is_active: data.is_active ?? true,
        display_order: data.display_order ?? 1
      }, 'POST')
      
      if (response.success) {
        console.log('✅ [useBannerAdmin] Banner created successfully:', response.data.id)
        return response.data
      } else {
        throw new Error(response.error || 'Failed to create banner')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAdmin] Create banner error:', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBanner = useCallback(async (data: UpdateBannerData): Promise<Banner | null> => {
    try {
      console.log('🔄 [useBannerAdmin] Updating banner:', data.id)
      setLoading(true)
      setError(null)
      
      const { id, ...updateData } = data
      
      const response = await callEdgeFunctionHTTP('bannerAdmin', updateData, 'PUT')
      
      if (response.success) {
        console.log('✅ [useBannerAdmin] Banner updated successfully')
        return response.data
      } else {
        throw new Error(response.error || 'Failed to update banner')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAdmin] Update banner error:', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteBanner = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('🗑️ [useBannerAdmin] Deleting banner:', id)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAdmin', { id }, 'DELETE')
      
      if (response.success) {
        console.log('✅ [useBannerAdmin] Banner deleted successfully')
        return true
      } else {
        throw new Error(response.error || 'Failed to delete banner')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAdmin] Delete banner error:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getAllBanners = useCallback(async (limit?: number): Promise<Banner[]> => {
    try {
      console.log('📊 [useBannerAdmin] Fetching all banners')
      setLoading(true)
      setError(null)
      
      const params: Record<string, string> = {}
      if (limit) params.limit = limit.toString()
      
      const response = await callEdgeFunctionHTTP('bannerAdmin', params, 'GET')
      
      if (response.success) {
        console.log(`✅ [useBannerAdmin] Fetched ${response.data?.length || 0} banners`)
        return response.data || []
      } else {
        throw new Error(response.error || 'Failed to fetch banners')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAdmin] Fetch all banners error:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getBannersByPosition = useCallback(async (position: string, limit?: number): Promise<Banner[]> => {
    try {
      console.log(`🎨 [useBannerAdmin] Fetching banners for position: ${position}`)
      setLoading(true)
      setError(null)
      
      const params: Record<string, string> = { position }
      if (limit) params.limit = limit.toString()
      
      const response = await callEdgeFunctionHTTP('bannerAdmin', params, 'GET')
      
      if (response.success) {
        console.log(`✅ [useBannerAdmin] Fetched ${response.data?.length || 0} banners for ${position}`)
        return response.data || []
      } else {
        throw new Error(response.error || 'Failed to fetch banners by position')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAdmin] Fetch banners by position error:', err)
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBannerOrder = useCallback(async (bannerId: string, newOrder: number): Promise<Banner | null> => {
    try {
      console.log(`🔄 [useBannerAdmin] Updating banner order: ${bannerId} -> ${newOrder}`)
      setLoading(true)
      setError(null)
      
      const response = await callEdgeFunctionHTTP('bannerAdmin', {
        id: bannerId,
        display_order: newOrder
      }, 'PUT')
      
      if (response.success) {
        console.log('✅ [useBannerAdmin] Banner order updated successfully')
        return response.data
      } else {
        throw new Error(response.error || 'Failed to update banner order')
      }
    } catch (err: any) {
      console.error('❌ [useBannerAdmin] Update banner order error:', err)
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    getAllBanners,
    getBannersByPosition,
    updateBannerOrder
  }
}