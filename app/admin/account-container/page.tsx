'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  adminAccountContainerService
} from '@/lib/admin-database'
import { databaseUtils, AccountContainer } from '@/lib/database'
import {
  Plus,
  Server,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  RefreshCw
} from 'lucide-react'

interface AvailableCount {
  account_size: number
  platform_type: string
  available_count: number
}

export default function AccountContainerPage() {
  const [accounts, setAccounts] = useState<AccountContainer[]>([])
  const [availableCounts, setAvailableCounts] = useState<AvailableCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({})
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const [newAccount, setNewAccount] = useState({
    account_size: '',
    platform_type: '',
    server_name: '',
    login_id: '',
    password: '',
    investor_password: ''
  })

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const fetchAccounts = async () => {
    try {
      const { data, error } = await adminAccountContainerService.getAllAccounts()

      if (error) {
        showMessage(`Error fetching accounts: ${error.message}`, 'error')
        return
      }

      setAccounts(data || [])
    } catch (err: any) {
      showMessage(`Failed to fetch accounts: ${err.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableCounts = async () => {
    try {
      const { data, error } = await adminAccountContainerService.getAvailabilityCount()

      if (error) {
        showMessage(`Error fetching counts: ${error.message}`, 'error')
        return
      }

      setAvailableCounts(data || [])
    } catch (err: any) {
      showMessage(`Failed to fetch counts: ${err.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const addAccount = async () => {
    try {
      const accountData = {
        account_size: parseFloat(newAccount.account_size),
        platform_type: newAccount.platform_type as 'mt4' | 'mt5',
        server_name: newAccount.server_name,
        login_id: newAccount.login_id,
        password: newAccount.password,
        investor_password: newAccount.investor_password,
        status: 'available' as 'available'
      }

      const { error } = await adminAccountContainerService.addAccount(accountData)

      if (error) {
        showMessage(`Error adding account: ${error.message}`, 'error')
        return
      }

      showMessage('Account added successfully!', 'success')
      setShowAddForm(false)
      setNewAccount({
        account_size: '',
        platform_type: '',
        server_name: '',
        login_id: '',
        password: '',
        investor_password: ''
      })
      
      await fetchAccounts()
      await fetchAvailableCounts()
    } catch (err: any) {
      showMessage(`Failed to add account: ${err.message}`, 'error')
    }
  }

  const toggleAccountStatus = async (accountId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'disabled' : 'available'

    try {
      const { error } = await adminAccountContainerService.updateAccountStatus(accountId, newStatus)

      if (error) {
        showMessage(`Error updating status: ${error.message}`, 'error')
        return
      }

      showMessage(`Account ${newStatus === 'available' ? 'enabled' : 'disabled'} successfully!`, 'success')
      await fetchAccounts()
      await fetchAvailableCounts()
    } catch (err: any) {
      showMessage(`Failed to update status: ${err.message}`, 'error')
    }
  }

  const deleteAccount = async (accountId: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    try {
      // For now, we'll disable the account instead of deleting it
      const { error } = await adminAccountContainerService.updateAccountStatus(accountId, 'disabled')

      if (error) {
        showMessage(`Error disabling account: ${error.message}`, 'error')
        return
      }

      showMessage('Account disabled successfully!', 'success')
      await fetchAccounts()
      await fetchAvailableCounts()
    } catch (err: any) {
      showMessage(`Failed to disable account: ${err.message}`, 'error')
    }
  }

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>
      case 'reserved':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Reserved</Badge>
      case 'delivered':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Delivered</Badge>
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  useEffect(() => {
    fetchAccounts()
    fetchAvailableCounts()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white flex items-center">
                <Server className="w-6 h-6 mr-2 text-emerald-400" />
                Account Container
              </CardTitle>
              <p className="text-slate-400">
                Manage MT4/MT5 trading accounts for delivery
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg border mb-4 ${
              messageType === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
              messageType === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
              'bg-blue-900/20 border-blue-500/30 text-blue-400'
            }`}>
              {message}
            </div>
          )}

          {/* Available Counts Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {availableCounts.map((count, index) => (
              <div key={index} className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {formatCurrency(count.account_size)} {count.platform_type.toUpperCase()}
                    </p>
                    <p className="text-2xl font-bold text-emerald-400">{count.available_count}</p>
                  </div>
                  <Package className="w-8 h-8 text-slate-600" />
                </div>
              </div>
            ))}
          </div>

          {/* Add Account Form */}
          {showAddForm && (
            <Card className="glass-card border-slate-700/50 mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Add New Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Account Size</label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={newAccount.account_size}
                      onChange={(e) => setNewAccount({...newAccount, account_size: e.target.value})}
                      className="glass-card border-slate-700/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Platform</label>
                    <Select value={newAccount.platform_type} onValueChange={(value) => setNewAccount({...newAccount, platform_type: value})}>
                      <SelectTrigger className="glass-card border-slate-700/50 text-white">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mt4">MT4</SelectItem>
                        <SelectItem value="mt5">MT5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Server Name</label>
                    <Input
                      placeholder="FlashFundX-Live01"
                      value={newAccount.server_name}
                      onChange={(e) => setNewAccount({...newAccount, server_name: e.target.value})}
                      className="glass-card border-slate-700/50 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Login ID</label>
                    <Input
                      placeholder="1001001"
                      value={newAccount.login_id}
                      onChange={(e) => setNewAccount({...newAccount, login_id: e.target.value})}
                      className="glass-card border-slate-700/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Password</label>
                    <Input
                      type="password"
                      placeholder="Trading password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                      className="glass-card border-slate-700/50 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">Investor Password</label>
                    <Input
                      type="password"
                      placeholder="Investor password"
                      value={newAccount.investor_password}
                      onChange={(e) => setNewAccount({...newAccount, investor_password: e.target.value})}
                      className="glass-card border-slate-700/50 text-white"
                    />
                  </div>
                </div>



                <div className="flex gap-4">
                  <Button onClick={addAccount} className="bg-emerald-600 hover:bg-emerald-700">
                    Add Account
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <Card className="glass-card border-slate-800/50">
            <CardContent className="text-center py-12">
              <Server className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No accounts in container</p>
            </CardContent>
          </Card>
        ) : (
          accounts.map((account) => (
            <Card key={account.id} className="glass-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {formatCurrency(account.account_size)} {account.platform_type.toUpperCase()}
                      </h3>
                      <p className="text-sm text-slate-400">{account.server_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(account.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Login Details</p>
                    <p className="text-white font-medium">Login: {account.login_id}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-slate-400">
                        Password: {showPasswords[account.id] ? account.password : '••••••••'}
                      </p>
                      <button
                        onClick={() => togglePasswordVisibility(account.id)}
                        className="text-slate-400 hover:text-emerald-400"
                      >
                        {showPasswords[account.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Investor: {showPasswords[account.id] ? account.investor_password : '••••••••'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Account Info</p>
                    <p className="text-sm text-white">Server: {account.server_name}</p>
                    <p className="text-sm text-slate-400">Created: {new Date(account.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Actions</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAccountStatus(account.id, account.status)}
                        disabled={account.status === 'delivered'}
                      >
                        {account.status === 'available' ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteAccount(account.id)}
                        disabled={account.status === 'delivered'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {account.reserved_for_order_id && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-3">
                    <p className="text-yellow-400 text-sm">
                      Reserved for order: {account.reserved_for_order_id}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
