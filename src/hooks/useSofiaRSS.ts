import { useState, useEffect } from 'react'
import { callEdgeFunction } from '../lib/supabase'

interface SofiaItem {
  id: number
  title: string
  description: string
  url: string
  image_url: string | null
  price: number | null
  location: string | null
  property_type: string
  published_at: string
  quality_score: number
  feed_name: string
  feed_category: string
}

interface UseSofiaRSSReturn {
  items: SofiaItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useSofiaRSS(limit: number = 20, category: string = 'all'): UseSofiaRSSReturn {
  const [items, setItems] = useState<SofiaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSofiaData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔥 [SOFIA RSS] Fetching data...', { limit, category })
      
      // Usa callEdgeFunction per chiamata centralizzata
      const response = await callEdgeFunction(
        'sofiaRSS',
        { limit, category },
        'GET'
      )
      
      console.log('🔥 [SOFIA RSS] Response:', response)
      
      if (response?.data) {
        setItems(response.data)
      } else {
        throw new Error('Invalid response format')
      }
      
    } catch (err) {
      console.error('❌ [SOFIA RSS] Error:', err)
      setError(err instanceof Error ? err.message : 'Errore nel caricamento Sofia RSS')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSofiaData()
  }, [limit, category])

  const refetch = () => {
    fetchSofiaData()
  }

  return {
    items,
    loading,
    error,
    refetch
  }
}