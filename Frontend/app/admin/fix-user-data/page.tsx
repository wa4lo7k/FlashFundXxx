"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, RefreshCw, Search, User, Mail } from "lucide-react"
import { supabaseAdmin } from '@/lib/admin-database'

export default function FixUserDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [fixResults, setFixResults] = useState<any>(null)

  const searchUserData = async () => {
    if (!searchEmail) return
    
    setIsLoading(true)
    try {
      console.log('🔍 Searching for user data with email:', searchEmail)
      
      // Find user profile by email
      const { data: userProfile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('email', searchEmail)
        .single()
      
      if (profileError || !userProfile) {
        setSearchResults({ error: 'User profile not found' })
        setIsLoading(false)
        return
      }
      
      // Find orders for this user
      const { data: orders, error: ordersError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('user_id', userProfile.id)
      
      // Find delivered accounts for this user
      const { data: deliveredAccounts, error: accountsError } = await supabaseAdmin
        .from('delivered_accounts')
        .select('*')
        .eq('user_id', userProfile.id)
      
      // Find delivered accounts with different user_id but same email
      const { data: mismatchedAccounts, error: mismatchError } = await supabaseAdmin
        .from('delivered_accounts')
        .select(`
          *,
          user_profiles!inner(email)
        `)
        .eq('user_profiles.email', searchEmail)
        .neq('user_id', userProfile.id)
      
      setSearchResults({
        userProfile,
        orders: orders || [],
        deliveredAccounts: deliveredAccounts || [],
        mismatchedAccounts: mismatchedAccounts || [],
        errors: { profileError, ordersError, accountsError, mismatchError }
      })
      
    } catch (error: any) {
      console.error('Error searching user data:', error)
      setSearchResults({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }
  
  const fixUserIdMismatch = async () => {
    if (!searchResults?.userProfile || !searchResults?.mismatchedAccounts?.length) return
    
    setIsLoading(true)
    try {
      console.log('🔧 Fixing user_id mismatch...')
      
      const correctUserId = searchResults.userProfile.id
      const accountsToFix = searchResults.mismatchedAccounts
      
      console.log('Fixing accounts:', accountsToFix.map((a: any) => a.id))
      console.log('Correct user_id:', correctUserId)

      // Update delivered_accounts to use correct user_id
      const { data: updateResult, error: updateError } = await supabaseAdmin
        .from('delivered_accounts')
        .update({ user_id: correctUserId })
        .in('id', accountsToFix.map((a: any) => a.id))
        .select()
      
      if (updateError) {
        setFixResults({ error: updateError.message })
      } else {
        setFixResults({ 
          success: true, 
          updatedAccounts: updateResult?.length || 0,
          message: `Successfully updated ${updateResult?.length || 0} delivered accounts`
        })
        
        // Refresh search results
        await searchUserData()
      }
      
    } catch (error: any) {
      console.error('Error fixing user data:', error)
      setFixResults({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Fix User Data Mismatches</h1>
        <p className="text-slate-400">Search for and fix user_id mismatches in delivered accounts</p>
      </div>

      {/* Search Section */}
      <Card className="glass-card border-slate-800/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search User Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Enter user email address"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 bg-slate-900/50 border-slate-700 text-white"
            />
            <Button 
              onClick={searchUserData}
              disabled={isLoading || !searchEmail}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="glass-card border-slate-800/30">
          <CardHeader>
            <CardTitle className="text-white">Search Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {searchResults.error ? (
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Error: {searchResults.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User Profile */}
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>User Profile</span>
                  </h3>
                  <p className="text-slate-300 text-sm">ID: {searchResults.userProfile.id}</p>
                  <p className="text-slate-300 text-sm">Email: {searchResults.userProfile.email}</p>
                  <p className="text-slate-300 text-sm">Name: {searchResults.userProfile.first_name} {searchResults.userProfile.last_name}</p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{searchResults.orders.length}</p>
                    <p className="text-slate-400 text-sm">Orders</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-white">{searchResults.deliveredAccounts.length}</p>
                    <p className="text-slate-400 text-sm">Correct Accounts</p>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-400">{searchResults.mismatchedAccounts.length}</p>
                    <p className="text-slate-400 text-sm">Mismatched Accounts</p>
                  </div>
                </div>

                {/* Mismatched Accounts */}
                {searchResults.mismatchedAccounts.length > 0 && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <h3 className="text-red-400 font-semibold mb-2 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>User ID Mismatch Detected</span>
                    </h3>
                    <p className="text-red-300 text-sm mb-3">
                      Found {searchResults.mismatchedAccounts.length} delivered accounts with wrong user_id
                    </p>
                    <Button 
                      onClick={fixUserIdMismatch}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                      Fix User ID Mismatch
                    </Button>
                  </div>
                )}

                {/* Success Message */}
                {searchResults.mismatchedAccounts.length === 0 && searchResults.deliveredAccounts.length > 0 && (
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>All delivered accounts have correct user_id</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fix Results */}
      {fixResults && (
        <Card className="glass-card border-slate-800/30">
          <CardHeader>
            <CardTitle className="text-white">Fix Results</CardTitle>
          </CardHeader>
          <CardContent>
            {fixResults.error ? (
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Error: {fixResults.error}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>{fixResults.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
