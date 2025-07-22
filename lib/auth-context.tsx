'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { userProfileService, UserProfile } from './database'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any>
  updatePassword: (password: string) => Promise<any>
  verifyOtp: (email: string, token: string, type: 'signup' | 'recovery') => Promise<any>
  resendOtp: (email: string, type: 'signup' | 'recovery') => Promise<any>
  refreshUserProfile: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const initializingRef = useRef(false)
  const profileLoadingRef = useRef(false)

  // Function to load user profile with debouncing
  const loadUserProfile = async (userId: string) => {
    if (profileLoadingRef.current) return
    profileLoadingRef.current = true

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile load timeout')), 15000)
      )

      const profilePromise = userProfileService.getProfile(userId)

      try {
        const result = await Promise.race([profilePromise, timeoutPromise]) as any
        const { data: profile, error } = result

        if (error) {
          console.error('Error loading user profile:', error)
          setUserProfile(null)
        } else {
          setUserProfile(profile)
          // Update last login in background (don't wait)
          userProfileService.updateLastLogin(userId).catch(console.error)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
        setUserProfile(null)
      } finally {
        profileLoadingRef.current = false
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUserProfile(null)
      profileLoadingRef.current = false
    }
  }

  useEffect(() => {
    // Prevent multiple initializations
    if (initializingRef.current) return
    initializingRef.current = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)

          // Load user profile if user exists
          if (session?.user) {
            await loadUserProfile(session.user.id)
          }
        }
      } catch (error) {
        console.error('Critical auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)

        // Load user profile if user exists, clear if not
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Include password in metadata for the trigger function
      const metaData = {
        ...userData,
        password: password // Include password in metadata for trigger
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
          emailRedirectTo: undefined // Disable email links, use OTP instead
        }
      })

      if (error) {
        // Check for rate limiting errors
        if (error.message.includes('rate') || error.message.includes('limit') || error.message.includes('too many')) {
          return {
            data: null,
            error: {
              ...error,
              message: 'Email sending is temporarily rate limited. Please try again in a few minutes, or contact support for manual verification.',
              isRateLimit: true
            }
          }
        }
        throw error
      }

      console.log('Signup response:', data)

      // The trigger function will automatically create the user profile
      // No need to manually insert into user_profiles table

      return { data, error: null }
    } catch (error: any) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { data: null, error }
    }
  }

  const verifyOtp = async (email: string, token: string, type: 'signup' | 'recovery') => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return { data: null, error }
    }
  }

  const resendOtp = async (email: string, type: 'signup' | 'recovery') => {
    try {
      if (type === 'recovery') {
        // For password recovery, use resetPasswordForEmail
        const { data, error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        return { data, error: null }
      } else {
        // For signup, resend confirmation
        const { data, error } = await supabase.auth.resend({
          type: 'signup',
          email
        })
        if (error) throw error
        return { data, error: null }
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      return { data: null, error }
    }
  }

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { data: null, error: { message: 'No user logged in' } }
    }

    try {
      const { data, error } = await userProfileService.updateProfile(user.id, updates)
      if (error) {
        return { data: null, error }
      }

      // Refresh the profile data
      await refreshUserProfile()
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    verifyOtp,
    resendOtp,
    refreshUserProfile,
    updateUserProfile
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

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [user, loading])

  return { user, loading }
}
