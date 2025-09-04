/**
 * BannerManagement Component - Gestione completa banner con drag-and-drop
 * Sistema professionale per amministrazione banner pubblicitari
 */

import React, { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Copy,
  Settings
} from 'lucide-react'
import { callEdgeFunction } from '../../lib/supabase'
import type { Banner } from '../../lib/supabase'

interface BannerManagementProps {
  onEditBanner?: (banner: Banner) => void
  onCreateBanner?: () => void
  className?: string
}

interface SortableBannerItemProps {
  banner: Banner
  onEdit: (banner: Banner) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
  onDuplicate: (banner: Banner) => void
}

// Sortable Banner Item Component
function SortableBannerItem({
  banner,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: banner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getPositionBadgeColor = (position: string) => {
    switch (position) {
      case 'homepage-hero': return 'bg-blue-100 text-blue-800'
      case 'homepage-sidebar': return 'bg-green-100 text-green-800'
      case 'search-results': return 'bg-yellow-100 text-yellow-800'
      case 'property-detail': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
        isDragging ? 'shadow-xl border-blue-300' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Banner Preview */}
        <div className="flex-shrink-0">
          {banner.image_url ? (
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-16 h-16 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Banner Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {banner.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionBadgeColor(banner.position)}`}>
                {banner.position}
              </span>
              <span className={`inline-flex items-center space-x-1 text-xs ${
                banner.is_active ? 'text-green-600' : 'text-gray-500'
              }`}>
                {banner.is_active ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                <span>{banner.is_active ? 'Attivo' : 'Disattivo'}</span>
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Ordine: {banner.display_order}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Visualizzazioni:</span>
              <span className="ml-2 font-medium text-blue-600">{banner.view_count.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Click:</span>
              <span className="ml-2 font-medium text-green-600">{banner.click_count.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500">CTR:</span>
              <span className="ml-2 font-medium text-purple-600">
                {banner.view_count > 0 ? ((banner.click_count / banner.view_count) * 100).toFixed(2) : '0.00'}%
              </span>
            </div>
            <div>
              <span className="text-gray-500">Creato:</span>
              <span className="ml-2 font-medium text-gray-700">{formatDate(banner.created_at)}</span>
            </div>
          </div>

          {banner.link_url && (
            <div className="mt-2 flex items-center text-sm text-blue-600">
              <ExternalLink className="w-4 h-4 mr-1" />
              <a 
                href={banner.link_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                {banner.link_url}
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleActive(banner.id, !banner.is_active)}
            className={`p-2 rounded-lg transition-colors ${
              banner.is_active 
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={banner.is_active ? 'Disattiva banner' : 'Attiva banner'}
          >
            {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => onDuplicate(banner)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            title="Duplica banner"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onEdit(banner)}
            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
            title="Modifica banner"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(banner.id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            title="Elimina banner"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function BannerManagement({
  onEditBanner,
  onCreateBanner,
  className = ''
}: BannerManagementProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [positionFilter, setPositionFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Fetch banners
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 [BANNER_MGMT] Fetching banners...')
      
      const response = await callEdgeFunction('bannerAdmin', {
        action: 'list',
        includeStats: true
      })

      if (response?.error) {
        throw new Error(response.error.message || 'Errore nel recupero banner')
      }

      const bannersData = response?.data || response || []
      console.log('✅ [BANNER_MGMT] Banners loaded:', bannersData.length)

      setBanners(bannersData)
    } catch (err: any) {
      console.error('❌ [BANNER_MGMT] Error:', err)
      setError(err.message || 'Errore nel caricamento banner')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle drag end
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) return

    const oldIndex = banners.findIndex(banner => banner.id === active.id)
    const newIndex = banners.findIndex(banner => banner.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newBanners = arrayMove(banners, oldIndex, newIndex)
    
    // Update display order
    const updatedBanners = newBanners.map((banner, index) => ({
      ...banner,
      display_order: index + 1
    }))

    setBanners(updatedBanners)

    try {
      await callEdgeFunction('bannerAdmin', {
        action: 'reorder',
        banners: updatedBanners.map(b => ({ id: b.id, display_order: b.display_order }))
      })
      console.log('✅ [BANNER_MGMT] Order updated successfully')
    } catch (err) {
      console.error('❌ [BANNER_MGMT] Reorder failed:', err)
      // Revert on error
      fetchBanners()
    }
  }, [banners, fetchBanners])

  // Delete banner
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo banner?')) return

    try {
      await callEdgeFunction('bannerAdmin', {
        action: 'delete',
        id
      })
      
      setBanners(prev => prev.filter(banner => banner.id !== id))
      console.log('✅ [BANNER_MGMT] Banner deleted')
    } catch (err: any) {
      console.error('❌ [BANNER_MGMT] Delete failed:', err)
      alert('Errore nell\'eliminazione del banner: ' + err.message)
    }
  }, [])

  // Toggle active status
  const handleToggleActive = useCallback(async (id: string, isActive: boolean) => {
    try {
      await callEdgeFunction('bannerAdmin', {
        action: 'update',
        id,
        updates: { is_active: isActive }
      })
      
      setBanners(prev => prev.map(banner => 
        banner.id === id ? { ...banner, is_active: isActive } : banner
      ))
      console.log(`✅ [BANNER_MGMT] Banner ${isActive ? 'activated' : 'deactivated'}`)
    } catch (err: any) {
      console.error('❌ [BANNER_MGMT] Toggle failed:', err)
      alert('Errore nell\'aggiornamento del banner: ' + err.message)
    }
  }, [])

  // Duplicate banner
  const handleDuplicate = useCallback(async (banner: Banner) => {
    try {
      const newBanner = {
        ...banner,
        id: undefined, // Will be generated
        title: `${banner.title} (Copia)`,
        is_active: false,
        display_order: banners.length + 1,
        click_count: 0,
        view_count: 0
      }

      await callEdgeFunction('bannerAdmin', {
        action: 'create',
        banner: newBanner
      })
      
      await fetchBanners() // Refresh list
      console.log('✅ [BANNER_MGMT] Banner duplicated')
    } catch (err: any) {
      console.error('❌ [BANNER_MGMT] Duplicate failed:', err)
      alert('Errore nella duplicazione del banner: ' + err.message)
    }
  }, [banners, fetchBanners])

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    if (filter === 'active' && !banner.is_active) return false
    if (filter === 'inactive' && banner.is_active) return false
    if (positionFilter !== 'all' && banner.position !== positionFilter) return false
    if (searchTerm && !banner.title.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // Get unique positions for filter
  const positions = Array.from(new Set(banners.map(b => b.position)))

  useEffect(() => {
    fetchBanners()
  }, [])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestione Banner</h2>
            <p className="text-gray-600">Amministra i banner pubblicitari con drag-and-drop</p>
          </div>
          <button
            onClick={onCreateBanner}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuovo Banner</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tutti</option>
              <option value="active">Solo attivi</option>
              <option value="inactive">Solo disattivi</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Posizione</label>
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tutte le posizioni</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cerca</label>
            <input
              type="text"
              placeholder="Cerca per titolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchBanners}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Aggiorna</span>
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Visualizzando {filteredBanners.length} di {banners.length} banner
          </span>
          <span>
            {banners.filter(b => b.is_active).length} attivi • {banners.filter(b => !b.is_active).length} disattivi
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Errore nel caricamento</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={fetchBanners}
            className="mt-2 text-sm text-red-800 hover:text-red-900 underline"
          >
            Riprova
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Caricamento banner...</span>
          </div>
        </div>
      )}

      {/* Banner List with Drag & Drop */}
      {!loading && filteredBanners.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredBanners.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredBanners.map(banner => (
                <SortableBannerItem
                  key={banner.id}
                  banner={banner}
                  onEdit={onEditBanner || (() => {})}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty State */}
      {!loading && filteredBanners.length === 0 && banners.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nessun banner trovato</h3>
          <p className="text-gray-500 mb-4">Prova a modificare i filtri di ricerca</p>
          <button
            onClick={() => {
              setFilter('all')
              setPositionFilter('all')
              setSearchTerm('')
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Azzera filtri
          </button>
        </div>
      )}

      {!loading && banners.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nessun banner creato</h3>
          <p className="text-gray-500 mb-6">Inizia creando il tuo primo banner pubblicitario</p>
          <button
            onClick={onCreateBanner}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Crea il primo banner
          </button>
        </div>
      )}
    </div>
  )
}