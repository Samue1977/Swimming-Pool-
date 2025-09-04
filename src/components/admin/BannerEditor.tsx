/**
 * BannerEditor Component - Editor HTML avanzato per banner pubblicitari
 * Sistema completo per creazione e modifica banner con template professionali
 */

import React, { useState, useEffect, useRef } from 'react'
import {
  Save,
  X,
  Eye,
  Code,
  Image,
  Link,
  Palette,
  Layout,
  Type,
  Smartphone,
  Monitor,
  Tablet,
  Upload,
  AlertCircle,
  CheckCircle,
  Copy,
  Trash2
} from 'lucide-react'
import { callEdgeFunction } from '../../lib/supabase'
import type { Banner } from '../../lib/supabase'

interface BannerEditorProps {
  banner?: Banner | null
  isOpen: boolean
  onSave: (banner: Banner) => void
  onClose: () => void
  className?: string
}

interface BannerFormData {
  title: string
  position: string
  image_url: string
  link_url: string
  content_html: string
  is_active: boolean
  display_order: number
}

// Template predefiniti per banner
const BANNER_TEMPLATES = {
  'luxury-hero': {
    name: 'Luxury Hero',
    description: 'Banner hero per proprietà di lusso',
    html: `<div class="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-lg overflow-hidden" style="min-height: 300px;">
  <div class="absolute inset-0 bg-black bg-opacity-30"></div>
  <div class="relative z-10 p-8 flex flex-col justify-center h-full">
    <h2 class="text-4xl font-bold mb-4">Proprietà Esclusive in Italia</h2>
    <p class="text-xl mb-6">Scopri ville di lusso, appartamenti esclusivi e investimenti premium</p>
    <div class="flex space-x-4">
      <button class="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Esplora Collezione
      </button>
      <button class="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors">
        Contattaci
      </button>
    </div>
  </div>
</div>`,
    positions: ['homepage-hero']
  },
  'property-card': {
    name: 'Property Card',
    description: 'Card per proprietà in sidebar',
    html: `<div class="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
  <div class="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
  <div class="p-6">
    <div class="flex items-center justify-between mb-3">
      <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">PREMIUM</span>
      <span class="text-2xl font-bold text-blue-600">€850.000</span>
    </div>
    <h3 class="font-bold text-gray-900 mb-2">Villa Esclusiva Roma</h3>
    <p class="text-gray-600 text-sm mb-4">Elegante propriet&agrave; di 350mq con giardino privato nel quartiere Parioli</p>
    <button class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
      Maggiori Dettagli
    </button>
  </div>
</div>`,
    positions: ['homepage-sidebar', 'search-results']
  },
  'investment-banner': {
    name: 'Investment Banner',
    description: 'Banner per investimenti immobiliari',
    html: `<div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
  <div class="flex items-center justify-between">
    <div class="flex-1">
      <h3 class="text-2xl font-bold mb-2">Investi nel Futuro</h3>
      <p class="text-green-100 mb-4">Opportunit&agrave; esclusive di investimento immobiliare in Italia</p>
      <div class="flex items-center space-x-4 text-sm">
        <div class="flex items-center">
          <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          <span>Rendimento fino al 8%</span>
        </div>
        <div class="flex items-center">
          <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
          <span>Consulenza gratuita</span>
        </div>
      </div>
    </div>
    <div class="ml-6">
      <button class="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
        Scopri di Pi&ugrave;
      </button>
    </div>
  </div>
</div>`,
    positions: ['search-results', 'property-detail']
  },
  'minimal-text': {
    name: 'Minimal Text',
    description: 'Banner minimalista solo testo',
    html: `<div class="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
  <div class="flex items-center justify-between">
    <div>
      <h4 class="text-lg font-semibold text-gray-900 mb-1">ItalyRE Professional</h4>
      <p class="text-gray-600 text-sm">Il tuo partner di fiducia per investimenti immobiliari</p>
    </div>
    <div class="text-right">
      <div class="text-2xl font-bold text-blue-600">+39 06 123456</div>
      <div class="text-sm text-gray-500">Consulenza gratuita</div>
    </div>
  </div>
</div>`,
    positions: ['homepage-sidebar', 'footer']
  }
}

const POSITION_OPTIONS = [
  { value: 'homepage-hero', label: 'Homepage Hero' },
  { value: 'homepage-sidebar', label: 'Homepage Sidebar' },
  { value: 'search-results', label: 'Search Results' },
  { value: 'property-detail', label: 'Property Detail' },
  { value: 'footer', label: 'Footer' }
]

const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 200, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, height: 250, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1200, height: 300, icon: Monitor, label: 'Desktop' }
}

export function BannerEditor({
  banner,
  isOpen,
  onSave,
  onClose,
  className = ''
}: BannerEditorProps) {
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    position: 'homepage-hero',
    image_url: '',
    link_url: '',
    content_html: '',
    is_active: true,
    display_order: 1
  })
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [viewportSize, setViewportSize] = useState<keyof typeof VIEWPORT_SIZES>('desktop')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize form data
  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        position: banner.position,
        image_url: banner.image_url || '',
        link_url: banner.link_url || '',
        content_html: banner.content_html || '',
        is_active: banner.is_active,
        display_order: banner.display_order
      })
    } else {
      // Reset form for new banner
      setFormData({
        title: '',
        position: 'homepage-hero',
        image_url: '',
        link_url: '',
        content_html: '',
        is_active: true,
        display_order: 1
      })
    }
    setErrors({})
    setSelectedTemplate(null)
  }, [banner, isOpen])

  // Apply template
  const applyTemplate = (templateKey: string) => {
    const template = BANNER_TEMPLATES[templateKey as keyof typeof BANNER_TEMPLATES]
    if (template) {
      setFormData(prev => ({
        ...prev,
        content_html: template.html
      }))
      setSelectedTemplate(templateKey)
    }
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio'
    }
    
    if (!formData.position) {
      newErrors.position = 'La posizione è obbligatoria'
    }
    
    if (!formData.content_html.trim()) {
      newErrors.content_html = 'Il contenuto HTML è obbligatorio'
    }
    
    if (formData.link_url && !formData.link_url.match(/^https?:\/\/.+/)) {
      newErrors.link_url = 'URL non valido (deve iniziare con http:// o https://)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return
    
    try {
      setSaving(true)
      
      const action = banner ? 'update' : 'create'
      const payload = banner 
        ? { action, id: banner.id, updates: formData }
        : { action, banner: formData }
      
      console.log(`💾 [BANNER_EDITOR] ${action} banner...`)
      
      const response = await callEdgeFunction('bannerAdmin', payload)
      
      if (response?.error) {
        throw new Error(response.error.message || 'Errore nel salvataggio')
      }
      
      const savedBanner = response?.data || response
      console.log('✅ [BANNER_EDITOR] Banner saved successfully')
      
      // Create banner object for callback
      const bannerResult: Banner = banner 
        ? { ...banner, ...formData }
        : {
            id: savedBanner?.id || 'new-' + Date.now(),
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            click_count: 0,
            view_count: 0
          }
      
      onSave(bannerResult)
      onClose()
    } catch (err: any) {
      console.error('❌ [BANNER_EDITOR] Save failed:', err)
      setErrors({ general: err.message || 'Errore nel salvataggio del banner' })
    } finally {
      setSaving(false)
    }
  }

  // Insert HTML helper
  const insertHTML = (htmlSnippet: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = formData.content_html.substring(0, start) + htmlSnippet + formData.content_html.substring(end)
      setFormData(prev => ({ ...prev, content_html: newValue }))
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + htmlSnippet.length
        textarea.focus()
      }, 0)
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {banner ? 'Modifica Banner' : 'Nuovo Banner'}
            </h2>
            <p className="text-gray-600 mt-1">
              {banner ? `Modifica "${banner.title}"` : 'Crea un nuovo banner pubblicitario'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 mr-2 inline" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                Anteprima
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Form */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* General Errors */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Base</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Titolo *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Nome del banner"
                    />
                    {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posizione *</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.position ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    >
                      {POSITION_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.position && <p className="text-red-600 text-xs mt-1">{errors.position}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Immagine</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                      placeholder="https://esempio.com/immagine.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Destinazione</label>
                    <input
                      type="url"
                      value={formData.link_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 text-sm ${
                        errors.link_url ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="https://esempio.com/destinazione"
                    />
                    {errors.link_url && <p className="text-red-600 text-xs mt-1">{errors.link_url}</p>}
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Banner attivo
                    </label>
                  </div>
                </div>
              </div>

              {/* Templates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Predefiniti</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(BANNER_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => applyTemplate(key)}
                      className={`text-left p-3 border rounded-lg hover:border-blue-300 transition-colors ${
                        selectedTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* HTML Tools */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Strumenti HTML</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => insertHTML('<div class="text-center p-4"></div>')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center justify-center space-x-1"
                  >
                    <Layout className="w-4 h-4" />
                    <span>Div</span>
                  </button>
                  <button
                    onClick={() => insertHTML('<img src="" alt="" class="w-full h-auto rounded" />')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center justify-center space-x-1"
                  >
                    <Image className="w-4 h-4" />
                    <span>Img</span>
                  </button>
                  <button
                    onClick={() => insertHTML('<a href="#" class="text-blue-600 hover:text-blue-700"></a>')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center justify-center space-x-1"
                  >
                    <Link className="w-4 h-4" />
                    <span>Link</span>
                  </button>
                  <button
                    onClick={() => insertHTML('<button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"></button>')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center justify-center space-x-1"
                  >
                    <Type className="w-4 h-4" />
                    <span>Button</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Editor/Preview */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'editor' ? (
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contenuto HTML *</h3>
                  <div className="text-xs text-gray-500">
                    Usa Tailwind CSS per lo styling
                  </div>
                </div>
                
                <textarea
                  ref={textareaRef}
                  value={formData.content_html}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_html: e.target.value }))}
                  className={`w-full h-full border rounded-lg p-4 text-sm font-mono resize-none ${
                    errors.content_html ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Inserisci il codice HTML del banner..."
                  spellCheck={false}
                />
                {errors.content_html && <p className="text-red-600 text-xs mt-2">{errors.content_html}</p>}
              </div>
            ) : (
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Anteprima Banner</h3>
                  <div className="flex items-center space-x-2">
                    {Object.entries(VIEWPORT_SIZES).map(([key, size]) => {
                      const IconComponent = size.icon
                      return (
                        <button
                          key={key}
                          onClick={() => setViewportSize(key as keyof typeof VIEWPORT_SIZES)}
                          className={`p-2 rounded-lg transition-colors ${
                            viewportSize === key
                              ? 'bg-blue-100 text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={size.label}
                        >
                          <IconComponent className="w-5 h-5" />
                        </button>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div 
                    className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
                    style={{
                      width: VIEWPORT_SIZES[viewportSize].width,
                      minHeight: VIEWPORT_SIZES[viewportSize].height,
                      maxWidth: '100%'
                    }}
                  >
                    {formData.content_html ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: formData.content_html }}
                        className="p-4"
                      />
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Inserisci del codice HTML per vedere l'anteprima</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {banner ? 'Salva le modifiche per aggiornare il banner' : 'Crea un nuovo banner pubblicitario'}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Salvataggio...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{banner ? 'Aggiorna Banner' : 'Crea Banner'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}