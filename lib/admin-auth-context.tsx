'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'

interface AdminAuthContextType {
  isAdminAuthenticated: boolean
  adminLogin: (username: string, password: string) => boolean
  adminLogout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const initializationRef = useRef(false)

  // Admin credentials
  const ADMIN_USERNAME = 'FlashFundX'
  const ADMIN_PASSWORD = '6969'

  useEffect(() => {
    // Prevent multiple initializations
    if (initializationRef.current) return
    initializationRef.current = true

    const initializeAuth = async () => {
      try {
        // Add small delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, 100))

        // Check if admin is already logged in
        const adminSession = localStorage.getItem('admin_session')
        if (adminSession === 'authenticated') {
          setIsAdminAuthenticated(true)
        }
      } catch (error) {
        console.error('Admin auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const adminLogin = useCallback((username: string, password: string): boolean => {
    try {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_session', 'authenticated')
        setIsAdminAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    }
  }, [ADMIN_USERNAME, ADMIN_PASSWORD])

  const adminLogout = useCallback(() => {
    try {
      setIsAdminAuthenticated(false)
      localStorage.removeItem('admin_session')
    } catch (error) {
      console.error('Admin logout error:', error)
    }
  }, [])

  const value = {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    isLoading
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
