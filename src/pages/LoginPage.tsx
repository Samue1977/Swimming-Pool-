/**
 * LoginPage Component - COMPLETAMENTE RISCRITTO DA ZERO
 * Pagina di login admin con design professionale e UX ottimizzata
 */

import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LoginForm {
  email: string
  password: string
}

export function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { user, loading, signIn, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/admin'

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      console.log('🔄 [LOGIN] User already logged in as admin, redirecting...')
      navigate(from, { replace: true })
    }
  }, [user, isAdmin, loading, navigate, from])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔑 [LOGIN] Form submission triggered for:', form.email)
    
    if (!form.email || !form.password) {
      setError('Inserisci email e password')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const { data, error: signInError } = await signIn(form.email, form.password)
      
      if (signInError) {
        console.error('❌ [LOGIN] Sign in error:', signInError.message)
        setError(getErrorMessage(signInError.message))
        return
      }
      
      if (data?.user) {
        console.log('✅ [LOGIN] Sign in successful, checking admin status...')
        setSuccess(true)
        
        // Small delay to show success message
        setTimeout(() => {
          console.log('🔄 [LOGIN] Redirecting to:', from)
          navigate(from, { replace: true })
        }, 1000)
      }
    } catch (error: any) {
      console.error('❌ [LOGIN] Unexpected error:', error)
      setError('Errore inaspettato durante il login')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Convert error messages to user-friendly Italian
  const getErrorMessage = (errorMessage: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email o password non validi',
      'Email not confirmed': 'Email non confermata',
      'Too many requests': 'Troppi tentativi, riprova più tardi',
      'User not found': 'Utente non trovato',
      'Invalid email': 'Formato email non valido',
      'Password should be at least 6 characters': 'La password deve contenere almeno 6 caratteri'
    }
    
    return errorMap[errorMessage] || 'Errore durante il login'
  }

  // Show loading state during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifica autenticazione...</p>
        </div>
      </div>
    )
  }

  // Redirect if already authenticated
  if (user && isAdmin) {
    return <Navigate to={from} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600 text-white mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Accesso Admin
          </h2>
          <p className="text-gray-600">
            Accedi al pannello di amministrazione ItalyRE Pro
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@italyre.pro"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Inserisci la password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-green-700 text-sm">Accesso effettuato! Reindirizzamento...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accesso in corso...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accesso effettuato
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Accedi
                </>
              )}
            </button>
          </form>

          {/* Test Credentials Info */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700 font-medium mb-1">Credenziali di test:</p>
            <p className="text-xs text-blue-600">Email: cwlxnbcy@minimax.com</p>
            <p className="text-xs text-blue-600">Password: Nltv0x75Rp</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Torna alla Homepage
          </button>
        </div>
      </div>
    </div>
  )
}