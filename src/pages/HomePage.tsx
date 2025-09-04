/**
 * HomePage Component - COMPLETAMENTE RISCRITTO DA ZERO
 * Homepage ottimizzata con banner rotanti e design professionale
 */

import React, { useState } from 'react'
import { Search, MapPin, Star, TrendingUp, Phone, Mail } from 'lucide-react'
import { BannerRotator } from '../components/BannerRotator'
import { SofiaRSSSection } from '../components/SofiaRSSSection'
import { SofiaHomepageAvatar } from '../components/SofiaHomepageAvatar'
import { SofiaCommercialAI } from '../components/SofiaCommercialAI'

// Statistiche mock per la homepage
const stats = [
  { label: 'Proprietà Disponibili', value: '2000+', icon: MapPin },
  { label: 'Clienti Soddisfatti', value: '150+', icon: Star },
  { label: 'Anni di Esperienza', value: '15+', icon: TrendingUp },
]

// Proprietà in evidenza con immagini reali
const featuredProperties = [
  {
    id: 1,
    title: 'Villa Luxury Toscana',
    location: 'Chianti, Toscana',
    price: '€2.800.000',
    image: '/tuscan_mediterranean_luxury_villa_architecture_evening.jpg',
    description: 'Esclusiva villa del XVIII secolo con vista panoramica'
  },
  {
    id: 2,
    title: 'Penthouse Roma Centro',
    location: 'Roma, Centro Storico',
    price: '€1.950.000',
    image: '/rome_penthouse_terrace_city_view_st_peters_dome.jpg',
    description: 'Attico con terrazza panoramica vista Colosseo'
  },
  {
    id: 3,
    title: 'Villa Costa Amalfitana',
    location: 'Amalfi, Campania',
    price: '€4.200.000',
    image: '/amalfi-coast-luxury-villa-sea-view-italy-property.jpg',
    description: 'Villa fronte mare con accesso diretto alla spiaggia'
  },
  {
    id: 4,
    title: 'Appartamento Milano',
    location: 'Milano, Brera',
    price: '€850.000',
    image: '/Luxury-Modern-Mediterranean-Villa-Infinity-Pool-Carport.jpg',
    description: 'Moderno appartamento nel cuore di Brera'
  }
]

const features = [
  {
    title: 'Ricerca Avanzata',
    description: 'Trova la proprietà perfetta con i nostri filtri avanzati',
    icon: Search,
    color: 'bg-blue-500'
  },
  {
    title: 'Valutazioni Gratuite',
    description: 'Ottieni una valutazione professionale della tua proprietà',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    title: 'Assistenza 24/7',
    description: 'Il nostro team è sempre a tua disposizione',
    icon: Phone,
    color: 'bg-purple-500'
  },
]

export function HomePage() {
  const [isSofiaChatOpen, setIsSofiaChatOpen] = useState(false)

  const handleSofiaChatOpen = () => {
    setIsSofiaChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">ItalyRE Pro</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Proprietà</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Servizi</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Chi Siamo</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Contatti</a>
              <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Area Admin
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Banner Rotator */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trova la Casa dei Tuoi Sogni in Italia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scopri le migliori proprietà immobiliari in tutta Italia con il nostro servizio professionale
            </p>
          </div>
          
          {/* Banner Rotator - Posizione Hero */}
          <div className="mb-12">
            <BannerRotator
              position="homepage-hero"
              className="max-w-6xl mx-auto"
              height="h-80"
              autoPlay={true}
              interval={6000}
              showControls={true}
              showIndicators={true}
              showCounter={false}
            />
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo Proprietà
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Tutti i tipi</option>
                    <option>Appartamento</option>
                    <option>Villa</option>
                    <option>Casa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Località
                  </label>
                  <input
                    type="text"
                    placeholder="Roma, Milano..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo Max
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Qualsiasi prezzo</option>
                    <option>Fino a €200.000</option>
                    <option>Fino a €500.000</option>
                    <option>Fino a €1.000.000</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    <Search className="w-5 h-5 inline mr-2" />
                    Cerca
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-white">
                  <div className="flex justify-center mb-4">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xl opacity-90">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sofia AI Assistant Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Incontra Sofia, la Tua Assistente AI
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              L'intelligenza artificiale più avanzata per il settore immobiliare. Sofia ti aiuta 24/7 con vendite, marketing e gestione clienti.
            </p>
          </div>
          
          <SofiaHomepageAvatar 
            className="max-w-4xl mx-auto"
            onChatOpen={handleSofiaChatOpen}
          />
        </div>
      </section>

      {/* Italy-China Bridge (Sanya) Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Il Ponte Immobiliare Italia-Cina: Sanya
          </h3>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
            ItalyRE Pro è il tuo partner esclusivo per connettere il mercato immobiliare di lusso italiano con le opportunità emergenti di Sanya, la perla tropicale della Cina. Scopri investimenti unici e proprietà esclusive in un mercato in forte crescita.
          </p>
          <a href="/sanya-properties" className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Esplora le Proprietà a Sanya
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Perché Scegliere ItalyRE Pro
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Offriamo servizi professionali e personalizzati per ogni esigenza immobiliare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} text-white rounded-full mb-4`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Sofia RSS Section - COMPONENTE CRITICO FONDAMENTALE */}
      <SofiaRSSSection
        maxItems={6}
        autoRefresh={true}
        refreshInterval={300000}
        showHeader={true}
        compact={false}
        className=""
      />

      {/* Banner Sidebar */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Proprietà in Evidenza
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredProperties.map(property => (
                  <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{property.title}</h4>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">{property.description}</p>
                      <p className="text-lg font-bold text-blue-600">{property.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sidebar with Banner */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Offerte Speciali
              </h3>
              <BannerRotator
                position="homepage-sidebar"
                height="h-64"
                autoPlay={true}
                interval={8000}
                showControls={false}
                showIndicators={true}
              />
              
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contattaci</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3" />
                    +39 06 1234 5678
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    info@italyre.pro
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    Via Roma 123, Roma
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Banner */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <BannerRotator
              position="footer-banner"
              height="h-32"
              autoPlay={true}
              interval={10000}
              showControls={false}
              showIndicators={false}
            />
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">ItalyRE Pro</h5>
              <p className="text-sm text-gray-400">
                Il tuo partner di fiducia per l'immobiliare di lusso in Italia.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Servizi</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Vendita</a></li>
                <li><a href="#" className="hover:text-white">Affitto</a></li>
                <li><a href="#" className="hover:text-white">Valutazioni</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Zone</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Roma</a></li>
                <li><a href="#" className="hover:text-white">Milano</a></li>
                <li><a href="#" className="hover:text-white">Toscana</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legale</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Termini d'Uso</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2025 ItalyRE Pro. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>

      {/* Sofia Commercial AI - Always Available */}
      <SofiaCommercialAI />
    </div>
  )
}