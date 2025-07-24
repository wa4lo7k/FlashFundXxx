'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminTradingRulesService } from '@/lib/admin-database'
import {
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  DollarSign
} from 'lucide-react'

export default function Fix1KRulesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const add1KRules = async () => {
    setIsLoading(true)
    
    try {
      console.log('🔧 Adding missing 1K trading rules...')
      
      const { data, error } = await adminTradingRulesService.add1KTradingRules()

      if (error) {
        console.error('❌ Error adding 1K rules:', error)
        showMessage(`Error adding 1K rules: ${error.message}`, 'error')
        return
      }

      console.log('✅ 1K rules added successfully:', data)
      showMessage(`✅ Successfully added ${data?.length || 4} trading rules for 1K accounts!`, 'success')
      
    } catch (err: any) {
      console.error('❌ Critical error:', err)
      showMessage(`Failed to add 1K rules: ${err.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Fix 1K Trading Rules</h1>
          <p className="text-slate-400 mt-2">Add missing trading rules for $1K accounts</p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          messageType === 'success' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' :
          messageType === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
          'bg-blue-900/20 border-blue-500/30 text-blue-400'
        }`}>
          <div className="flex items-center">
            {messageType === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> :
             messageType === 'error' ? <AlertCircle className="w-5 h-5 mr-2" /> :
             <AlertCircle className="w-5 h-5 mr-2" />}
            {message}
          </div>
        </div>
      )}

      <Card className="glass-card border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-emerald-400" />
            Missing 1K Account Trading Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem Description */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="text-red-400 font-semibold mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Issue Detected
            </h3>
            <p className="text-red-300 text-sm">
              Account delivery is failing for 1K accounts because trading rules are missing. 
              The system requires trading rules for each account type and size combination.
            </p>
          </div>

          {/* What Will Be Added */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Trading Rules to be Added
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-green-400 border-green-500/30">
                  Instant $1K
                </Badge>
                <p className="text-xs text-slate-400">Direct live account - no challenge required</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-orange-400 border-orange-500/30">
                  HFT $1K
                </Badge>
                <p className="text-xs text-slate-400">Single HFT challenge phase</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                  One-Step $1K
                </Badge>
                <p className="text-xs text-slate-400">Single one-step challenge phase</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                  Two-Step $1K
                </Badge>
                <p className="text-xs text-slate-400">Two challenge phases (Phase 1 → Phase 2)</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={add1KRules}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding Rules...
                </div>
              ) : (
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Add Missing 1K Trading Rules
                </div>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
            <h3 className="text-slate-300 font-semibold mb-2">After Adding Rules:</h3>
            <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
              <li>Go to Order Management</li>
              <li>Try delivering a 1K account order</li>
              <li>The delivery should now work successfully</li>
              <li>Check Trading Rules page to verify the new rules</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
