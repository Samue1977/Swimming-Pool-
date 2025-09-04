/**
 * ProtectedRoute Component - COMPLETAMENTE RISCRITTO DA ZERO
 * Route protetta per admin con redirect automatico
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  console.log(`🔐 [ProtectedRoute] Check - User: ${user?.email || 'None'}, Admin: ${isAdmin}, Loading: ${loading}`)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifica autorizzazioni...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    console.log(`🚫 [ProtectedRoute] Access denied, redirecting to login`)
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    )
  }

  console.log(`✅ [ProtectedRoute] Access granted for admin: ${user.email}`)
  return <>{children}</>
}