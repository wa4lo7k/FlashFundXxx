'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminTradingRulesService } from '@/lib/admin-database'
import {
  Settings,
  TrendingUp,
  Plus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function Fix5KRulesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const add5KRules = async () => {
    setIsLoading(true)
    
    try {
      console.log('🔧 Adding missing 5K trading rules...')
      
      const { data, error } = await adminTradingRulesService.add5KTradingRules()

      if (error) {
        console.error('❌ Error adding 5K rules:', error)
        showMessage(`Error adding 5K rules: ${error.message}`, 'error')
        return
      }

      console.log('✅ 5K rules added successfully:', data)
      showMessage(`✅ Successfully added ${data?.length || 4} trading rules for 5K accounts!`, 'success')
      
    } catch (err: any) {
      console.error('❌ Critical error:', err)
      showMessage(`Failed to add 5K rules: ${err.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-2 text-emerald-400" />
            Add Missing 5K Trading Rules
          </CardTitle>
          <p className="text-slate-400">
            Add trading rules for $5K accounts across all account types (Instant, HFT, One-Step, Two-Step)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg border ${
              messageType === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-400' :
              messageType === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
              'bg-blue-900/20 border-blue-500/30 text-blue-400'
            }`}>
              <div className="flex items-center">
                {messageType === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                {messageType === 'error' && <AlertTriangle className="w-5 h-5 mr-2" />}
                {message}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-400 font-semibold mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Important Notice
            </h3>
            <p className="text-yellow-300 text-sm">
              This will add trading rules for $5K accounts. If rules already exist, they will be updated with new values.
              Make sure you want to proceed before clicking the button below.
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
                  Instant $5K
                </Badge>
                <p className="text-xs text-slate-400">Direct live account - no challenge required</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-orange-400 border-orange-500/30">
                  HFT $5K
                </Badge>
                <p className="text-xs text-slate-400">Single HFT challenge phase</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-blue-400 border-blue-500/30">
                  One-Step $5K
                </Badge>
                <p className="text-xs text-slate-400">Single one-step challenge phase</p>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                  Two-Step $5K
                </Badge>
                <p className="text-xs text-slate-400">Two challenge phases (Phase 1 → Phase 2)</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={add5KRules}
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
                  Add Missing 5K Trading Rules
                </div>
              )}
            </Button>
          </div>

          {/* Rules Preview */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
            <h3 className="text-slate-300 font-semibold mb-3">Rules Preview:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Live Max Daily Loss: <span className="text-white">$250</span></p>
                <p className="text-slate-400">Live Max Total Loss: <span className="text-white">$500</span></p>
                <p className="text-slate-400">Profit Share: <span className="text-white">80%</span></p>
              </div>
              <div>
                <p className="text-slate-400">HFT Profit Target: <span className="text-white">$400</span></p>
                <p className="text-slate-400">One-Step Profit Target: <span className="text-white">$500</span></p>
                <p className="text-slate-400">Two-Step Phase 1: <span className="text-white">$400</span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
