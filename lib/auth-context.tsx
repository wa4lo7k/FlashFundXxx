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
      console.log('🔄 Loading user profile for:', userId)

      // Increased timeout to 15 seconds for better reliability
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile load timeout after 15 seconds')), 15000)
      )

      // Try to load profile with retry mechanism
      let result: any
      let retryCount = 0
      const maxRetries = 2

      while (retryCount <= maxRetries) {
        try {
          const profilePromise = userProfileService.getProfile(userId)
          result = await Promise.race([profilePromise, timeoutPromise]) as any
          break // Success, exit retry loop
        } catch (retryError) {
          retryCount++
          console.warn(`⚠️ Profile load attempt ${retryCount} failed:`, retryError)
          if (retryCount > maxRetries) {
            throw retryError // Re-throw if all retries exhausted
          }
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      try {
        const { data: profile, error } = result

        if (error) {
          console.error('❌ Error loading user profile:', error)
          // Try to continue with basic user info from auth
          setUserProfile({
            id: userId,
            email: user?.email || '',
            first_name: '',
            last_name: '',
            password: '',
            phone: '',
            country: '',
            marketing_consent: false,
            account_status: 'active',
            total_orders: 0,
            total_spent: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        } else {
          console.log('✅ User profile loaded successfully:', profile)
          setUserProfile(profile)
          // Update last login in background (don't wait)
          userProfileService.updateLastLogin(userId).catch(console.error)
        }
      } catch (timeoutError: any) {
        console.error('⏰ Profile loading failed after retries:', {
          error: timeoutError,
          message: timeoutError.message,
          userId,
          userEmail: user?.email
        })

        // Try one more time with admin client as fallback
        try {
          console.log('🔄 Attempting fallback profile load...')
          const fallbackResult = await userProfileService.getProfile(userId)
          if (fallbackResult.data && !fallbackResult.error) {
            console.log('✅ Fallback profile load successful')
            setUserProfile(fallbackResult.data)
            return
          }
        } catch (fallbackError) {
          console.error('❌ Fallback profile load also failed:', fallbackError)
        }

        // Final fallback to basic profile to prevent app crashes
        console.log('🆘 Using basic profile fallback')
        setUserProfile({
          id: userId,
          email: user?.email || '',
          first_name: '',
          last_name: '',
          password: '',
          phone: '',
          country: '',
          marketing_consent: false,
          account_status: 'active',
          total_orders: 0,
          total_spent: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      } finally {
        profileLoadingRef.current = false
      }
    } catch (error) {
      console.error('❌ Error in loadUserProfile:', error)
      // Always provide a fallback profile to prevent app crashes
      setUserProfile({
        id: userId,
        email: user?.email || '',
        first_name: '',
        last_name: '',
        password: '',
        phone: '',
        country: '',
        marketing_consent: false,
        account_status: 'active',
        total_orders: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
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

          // Load user profile if user exists (in background)
          if (session?.user) {
            loadUserProfile(session.user.id).catch(error => {
              console.error('❌ Initial profile loading failed:', error)
              // Set basic profile fallback
              setUserProfile({
                id: session.user.id,
                email: session.user.email || '',
                first_name: '',
                last_name: '',
                password: '',
                phone: '',
                country: '',
                marketing_consent: false,
                account_status: 'active',
                total_orders: 0,
                total_spent: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
            })
          }
        }
      } catch (error) {
        console.error('Critical auth initialization error:', error)
      } finally {
        // Always set loading to false to unblock the app
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

        // Always set loading to false first to unblock the app
        setLoading(false)

        // Load user profile if user exists, clear if not
        if (session?.user) {
          // Load profile in background without blocking the app
          loadUserProfile(session.user.id).catch(error => {
            console.error('❌ Background profile loading failed:', error)
            // Set a basic profile so the app can still function
            setUserProfile({
              id: session.user.id,
              email: session.user.email || '',
              first_name: '',
              last_name: '',
              password: '',
              phone: '',
              country: '',
              marketing_consent: false,
              account_status: 'active',
              total_orders: 0,
              total_spent: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          })
        } else {
          setUserProfile(null)
        }
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
