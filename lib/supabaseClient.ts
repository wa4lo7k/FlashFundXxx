import { createClient } from '@supabase/supabase-js'

// Supabase configuration with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://evogjimjdofyrpqaukdq.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2b2dqaW1qZG9meXJwcWF1a2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDI0MjksImV4cCI6MjA2NzgxODQyOX0.Cr93KY8WJGXO2zKaglnZoW-4pJ8H6yw_eJ5jjOeaT3c'

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase configuration missing. Some features may not work.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Type definitions for better TypeScript support
export type { User } from '@supabase/supabase-js'

// Helper functions for common operations
export const supabaseAuth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Reset password
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email)
  },

  // Update password
  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password })
  },
}

// Database helper functions
export const supabaseDB = {
  // Generic select function
  select: (table: string) => supabase.from(table).select(),
  
  // Generic insert function
  insert: (table: string, data: any) => supabase.from(table).insert(data),
  
  // Generic update function
  update: (table: string, data: any) => supabase.from(table).update(data),
  
  // Generic delete function
  delete: (table: string) => supabase.from(table).delete(),
}

export default supabase
