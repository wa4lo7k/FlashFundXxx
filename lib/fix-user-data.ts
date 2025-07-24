import { supabase } from './supabaseClient'

// Function to check and fix user data mismatches
export const fixUserDataMismatches = async () => {
  try {
    console.log('🔧 Starting user data mismatch check...')
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('❌ No authenticated user found')
      return { success: false, error: 'No authenticated user' }
    }
    
    console.log('✅ Current user:', { id: user.id, email: user.email })
    
    // Check if user has a profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError || !userProfile) {
      console.error('❌ User profile not found:', profileError)
      return { success: false, error: 'User profile not found' }
    }
    
    console.log('✅ User profile found:', userProfile)
    
    // Check for orders with this user_id
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
    
    console.log('📊 Orders for current user:', { count: orders?.length || 0, ordersError })
    
    // Check for delivered accounts with this user_id
    const { data: deliveredAccounts, error: accountsError } = await supabase
      .from('delivered_accounts')
      .select('*')
      .eq('user_id', user.id)
    
    console.log('🏦 Delivered accounts for current user:', { count: deliveredAccounts?.length || 0, accountsError })
    
    // If no delivered accounts found, check if there are any with matching email
    if (!deliveredAccounts || deliveredAccounts.length === 0) {
      console.log('🔍 No delivered accounts found for user ID, checking by email...')
      
      // This query might fail due to RLS, but let's try
      const { data: accountsByEmail, error: emailError } = await supabase
        .from('delivered_accounts')
        .select(`
          *,
          user_profiles!inner(email)
        `)
        .eq('user_profiles.email', userProfile.email)
      
      console.log('🔍 Accounts found by email:', { count: accountsByEmail?.length || 0, emailError })
      
      if (accountsByEmail && accountsByEmail.length > 0) {
        console.log('⚠️ MISMATCH DETECTED: Found delivered accounts with same email but different user_id')
        console.log('⚠️ This requires admin intervention to fix user_ids')
        return { 
          success: false, 
          error: 'User ID mismatch detected',
          details: {
            currentUserId: user.id,
            currentEmail: user.email,
            accountsWithSameEmail: accountsByEmail.length
          }
        }
      }
    }
    
    return {
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        ordersCount: orders?.length || 0,
        deliveredAccountsCount: deliveredAccounts?.length || 0
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking user data:', error)
    return { success: false, error: error.message }
  }
}

// Function to get detailed user info for debugging
export const getUserDebugInfo = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const [ordersResult, accountsResult, profileResult] = await Promise.all([
      supabase.from('orders').select('*').eq('user_id', user.id),
      supabase.from('delivered_accounts').select('*').eq('user_id', user.id),
      supabase.from('user_profiles').select('*').eq('id', user.id).single()
    ])
    
    return {
      user: {
        id: user.id,
        email: user.email
      },
      profile: profileResult.data,
      orders: ordersResult.data || [],
      deliveredAccounts: accountsResult.data || [],
      errors: {
        orders: ordersResult.error,
        accounts: accountsResult.error,
        profile: profileResult.error
      }
    }
  } catch (error) {
    console.error('Error getting debug info:', error)
    return null
  }
}
