/**
 * BannerRotator Component - COMPLETAMENTE RISCRITTO DA ZERO
 * Banner rotanti ottimizzati per performance e user experience
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from 'lucide-react'
import { useBanner } from '../hooks/useBanner'
import { Banner } from '../lib/supabase'

interface BannerRotatorProps {
  position: string
  className?: string
  autoPlay?: boolean
  interval?: number
  showControls?: boolean
  showIndicators?: boolean
  showCounter?: boolean
  height?: string
}

export function BannerRotator({
  position,
  className = '',
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  showCounter = false,
  height = 'h-96'
}: BannerRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  
  const { banners, loading, error, trackClick } = useBanner({ 
    position,
    limit: 10,
    activeOnly: true 
  })

  // Handle banner click
  const handleBannerClick = useCallback(async (banner: Banner, event: React.MouseEvent) => {
    event.preventDefault()
    
    try {
      // Track the click
      await trackClick(banner.id)
      
      // Open link if present
      if (banner.link_url) {
        window.open(banner.link_url, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.warn('Failed to track banner click:', error)
      // Still open the link even if tracking fails
      if (banner.link_url) {
        window.open(banner.link_url, '_blank', 'noopener,noreferrer')
      }
    }
  }, [trackClick])

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && banners.length > 1 && !isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, banners.length, isPaused, interval, nextSlide])

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false)
  }, [])

  // Reset index when banners change
  useEffect(() => {
    setCurrentIndex(0)
  }, [banners])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!componentRef.current?.contains(document.activeElement)) return
      
      switch (event.key) {
        case 'ArrowLeft':
          prevSlide()
          break
        case 'ArrowRight':
          nextSlide()
          break
        case ' ':
          event.preventDefault()
          togglePlayPause()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, togglePlayPause])

  if (loading) {
    return (
      <div className={`${height} ${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Caricamento banner...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${height} ${className} flex items-center justify-center bg-red-50 border border-red-200 rounded-lg`}>
        <div className="text-center text-red-600">
          <p className="font-semibold">Errore nel caricamento dei banner</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  if (!banners.length) {
    return (
      <div className={`${height} ${className} flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg`}>
        <div className="text-center text-gray-500">
          <p className="font-medium">Nessun banner disponibile</p>
          <p className="text-sm mt-1">Posizione: {position}</p>
        </div>
      </div>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <div 
      ref={componentRef}
      className={`relative ${height} ${className} bg-gray-900 rounded-lg overflow-hidden group`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      {/* Banner Content */}
      <div className="relative w-full h-full">
        {/* Image Banner */}
        {currentBanner.image_url && (
          <div 
            className="absolute inset-0 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={(e) => handleBannerClick(currentBanner, e)}
          >
            <img
              src={currentBanner.image_url}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
        
        {/* HTML Content Banner */}
        {currentBanner.content_html && !currentBanner.image_url && (
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={(e) => handleBannerClick(currentBanner, e)}
            dangerouslySetInnerHTML={{ __html: currentBanner.content_html }}
          />
        )}
        
        {/* Overlay with Title */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6">
          <h3 className="text-white text-xl font-bold mb-2">{currentBanner.title}</h3>
          {currentBanner.link_url && (
            <div className="flex items-center text-white/80 text-sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Clicca per aprire
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Banner precedente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Banner successivo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Play/Pause Control */}
      {showControls && banners.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={isPlaying ? 'Pausa' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      )}

      {/* Counter */}
      {showCounter && banners.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {currentIndex + 1} / {banners.length}
        </div>
      )}

      {/* Indicators */}
      {showIndicators && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Vai al banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}