/**
 * App.tsx - COMPLETAMENTE RISCRITTO DA ZERO
 * Applicazione principale con routing completo
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { UsageProvider } from './components/SofiaUsageTracker'
import { HomePage } from './pages/HomePage'
import { SofiaAIPage } from './pages/SofiaAIPage'
import { SanyaPropertiesPage } from './pages/SanyaPropertiesPage'
import { LoginPage } from './pages/LoginPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UsageProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/sofia-ai" element={<SofiaAIPage />} />
                <Route path="/sanya-properties" element={<SanyaPropertiesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </UsageProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App