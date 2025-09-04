/**
 * AuthContext - COMPLETAMENTE RISCRITTO DA ZERO
 * Context per gestione autenticazione seguendo best practices Supabase
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Load user on mount (one-time check)
  useEffect(() => {
    async function loadUser() {
      try {
        console.log('🔐 [AUTH] Loading initial user session...')
        setLoading(true)
        
        const { data: { user }, error } = await supabase.auth.getUser()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('⚠️ [AUTH] Error getting user:', error.message)
        }
        
        setUser(user)
        setSession(session)
        
        // Check admin status
        if (user?.email) {
          const adminStatus = checkAdminStatus(user.email)
          setIsAdmin(adminStatus)
          console.log(`👤 [AUTH] User loaded: ${user.email} (Admin: ${adminStatus})`)
        } else {
          setIsAdmin(false)
          console.log('👤 [AUTH] No user logged in')
        }
      } catch (error: any) {
        console.error('❌ [AUTH] Fatal error loading user:', error)
        setUser(null)
        setSession(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()

    // Set up auth listener - KEEP SIMPLE, avoid any async operations in callback
    console.log('🔊 [AUTH] Setting up auth state listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`🔄 [AUTH] Auth state changed: ${event}`, session?.user?.email || 'No user')
        
        // NEVER use any async operations in callback - CRITICAL RULE
        setUser(session?.user || null)
        setSession(session)
        
        // Check admin status synchronously
        if (session?.user?.email) {
          const adminStatus = checkAdminStatus(session.user.email)
          setIsAdmin(adminStatus)
        } else {
          setIsAdmin(false)
        }
      }
    )

    return () => {
      console.log('🧹 [AUTH] Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [])

  // Check if user is admin (synchronous function)
  const checkAdminStatus = (email: string): boolean => {
    // Lista di email admin autorizzate
    const adminEmails = [
      'cwlxnbcy@minimax.com',
      'admin@italyre.pro',
      'administrator@italyre.pro'
    ]
    
    return adminEmails.includes(email.toLowerCase())
  }

  // Sign in method
  async function signIn(email: string, password: string) {
    try {
      console.log('🔑 [AUTH] Attempting sign in for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
      })
      
      if (error) {
        console.error('❌ [AUTH] Sign in error:', error.message)
        throw error
      }
      
      console.log('✅ [AUTH] Sign in successful:', data.user?.email)
      return { data, error: null }
    } catch (error: any) {
      console.error('❌ [AUTH] Sign in failed:', error.message)
      return { data: null, error }
    }
  }

  // Sign out method
  async function signOut() {
    try {
      console.log('🚪 [AUTH] Attempting sign out...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ [AUTH] Sign out error:', error.message)
        return { error }
      }
      
      console.log('✅ [AUTH] Sign out successful')
      return { error: null }
    } catch (error: any) {
      console.error('❌ [AUTH] Sign out failed:', error.message)
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}