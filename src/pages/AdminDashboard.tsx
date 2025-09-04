/**
 * AdminDashboard - DASHBOARD COMPLETA CON TUTTI I COMPONENTI AVANZATI
 * Sistema professionale per gestione banner con editor integrato
 */

import React, { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { 
  BarChart3, 
  LogOut, 
  Image, 
  Eye, 
  Plus,
  Menu,
  X,
  User,
  Settings
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { BannerManagement } from '../components/admin/BannerManagement'
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard'
import { BannerEditor } from '../components/admin/BannerEditor'
import type { Banner } from '../lib/supabase'

// Dashboard Home Component
function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Benvenuto nel Pannello Admin</h1>
        <p className="text-gray-600">Gestisci il sistema pubblicitario ItalyRE Pro con strumenti professionali</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Monitora le performance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Image className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Banner</h3>
              <p className="text-sm text-gray-600">Gestisci i banner</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Sofia RSS</h3>
              <p className="text-sm text-gray-600">Feed immobiliari attivi</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Analytics Overview */}
      <AnalyticsDashboard className="" />
    </div>
  )
}

// Banner Management with Editor
function BannerManagementPage() {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setIsEditorOpen(true)
  }
  
  const handleCreateBanner = () => {
    setEditingBanner(null)
    setIsEditorOpen(true)
  }
  
  const handleSaveBanner = (banner: Banner) => {
    console.log('✅ [ADMIN] Banner saved:', banner.title)
    setIsEditorOpen(false)
    setEditingBanner(null)
    // Trigger refresh of banner list
    setRefreshTrigger(prev => prev + 1)
  }
  
  const handleCloseEditor = () => {
    setIsEditorOpen(false)
    setEditingBanner(null)
  }
  
  return (
    <div className="space-y-6">
      <BannerManagement 
        key={refreshTrigger} // Force re-render on save
        onEditBanner={handleEditBanner}
        onCreateBanner={handleCreateBanner}
      />
      
      <BannerEditor
        banner={editingBanner}
        isOpen={isEditorOpen}
        onSave={handleSaveBanner}
        onClose={handleCloseEditor}
      />
    </div>
  )
}

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('❌ [ADMIN] Sign out error:', error)
    }
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      description: 'Panoramica e analytics'
    },
    {
      name: 'Gestione Banner',
      href: '/admin/banners',
      icon: Image,
      description: 'Gestisci i banner pubblicitari'
    },
    {
      name: 'Analytics Avanzate',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'Statistiche dettagliate'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/admin'}
                  className={({ isActive }) => 
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="mr-3 w-5 h-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </NavLink>
              )
            })}
          </div>
        </nav>
        
        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-700">
                {user?.email}
              </div>
              <div className="text-xs text-green-600 font-medium">
                Administrator
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="mr-3 w-4 h-4" />
            Disconnetti
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">ItalyRE Pro</span> - Pannello Amministrazione
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                Visualizza Sito
              </a>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="banners" element={<BannerManagementPage />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}