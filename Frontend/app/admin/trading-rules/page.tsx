'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  adminTradingRulesService
} from '@/lib/admin-database'
import { databaseUtils, TradingRules } from '@/lib/database'
import {
  Settings,
  Edit,
  Save,
  X,
  Target,
  TrendingDown,
  TrendingUp,
  Calendar,
  RefreshCw
} from 'lucide-react'

export default function TradingRulesPage() {
  const [rules, setRules] = useState<TradingRules[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const fetchRules = async () => {
    try {
      const { data, error } = await adminTradingRulesService.getAllRules()

      if (error) {
        showMessage(`Error fetching rules: ${error.message}`, 'error')
        return
      }

      setRules(data || [])
    } catch (err: any) {
      showMessage(`Failed to fetch rules: ${err.message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateRule = async (ruleId: string, updatedData: Partial<TradingRules>) => {
    try {
      const { error } = await adminTradingRulesService.updateRules(ruleId, updatedData)

      if (error) {
        showMessage(`Error updating rule: ${error.message}`, 'error')
        return
      }

      showMessage('Trading rule updated successfully!', 'success')
      setEditingRule(null)
      await fetchRules()
    } catch (err: any) {
      showMessage(`Failed to update rule: ${err.message}`, 'error')
    }
  }

  const handleRuleChange = (ruleId: string, field: string, value: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, [field]: value === '' ? null : parseFloat(value) }
        : rule
    ))
  }

  const saveRule = (rule: TradingRules) => {
    const updatedData = {
      challenge_profit_target: rule.challenge_profit_target,
      challenge_max_daily_loss: rule.challenge_max_daily_loss,
      challenge_max_total_loss: rule.challenge_max_total_loss,
      challenge_min_trading_days: rule.challenge_min_trading_days,
      phase_1_profit_target: rule.phase_1_profit_target,
      phase_1_max_daily_loss: rule.phase_1_max_daily_loss,
      phase_1_max_total_loss: rule.phase_1_max_total_loss,
      phase_1_min_trading_days: rule.phase_1_min_trading_days,
      phase_2_profit_target: rule.phase_2_profit_target,
      phase_2_max_daily_loss: rule.phase_2_max_daily_loss,
      phase_2_max_total_loss: rule.phase_2_max_total_loss,
      phase_2_min_trading_days: rule.phase_2_min_trading_days,
      live_max_daily_loss: rule.live_max_daily_loss,
      live_max_total_loss: rule.live_max_total_loss,
      profit_share_percentage: rule.profit_share_percentage
    }
    updateRule(rule.id, updatedData)
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'instant': return 'Instant Funding'
      case 'hft': return 'HFT Account'
      case 'one_step': return 'One Step Challenge'
      case 'two_step': return 'Two Step Challenge'
      default: return type
    }
  }

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case 'instant': return <Badge className="bg-green-500/20 text-green-400">Instant</Badge>
      case 'hft': return <Badge className="bg-purple-500/20 text-purple-400">HFT</Badge>
      case 'one_step': return <Badge className="bg-blue-500/20 text-blue-400">One Step</Badge>
      case 'two_step': return <Badge className="bg-orange-500/20 text-orange-400">Two Step</Badge>
      default: return <Badge variant="secondary">{type}</Badge>
    }
  }

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return 'N/A'
    return databaseUtils.formatCurrency(amount)
  }

  useEffect(() => {
    fetchRules()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading trading rules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="glass-card border-slate-800/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <Settings className="w-6 h-6 mr-2 text-emerald-400" />
            Trading Rules Management
          </CardTitle>
          <p className="text-slate-400">
            Configure profit targets, drawdowns, and trading rules for all account types
          </p>
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

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-blue-400 font-semibold mb-2">Trading Rules Guide:</h3>
            <ul className="text-blue-300 text-sm space-y-1">
              <li>• <strong>Instant:</strong> Direct live accounts - only live rules apply</li>
              <li>• <strong>HFT:</strong> Single HFT challenge phase before live funding</li>
              <li>• <strong>One Step:</strong> Single one-step challenge phase before live funding</li>
              <li>• <strong>Two Step:</strong> Two challenges (Phase 1 → Phase 2) before live funding</li>
              <li>• Each account type has its own distinct challenge rules and requirements</li>
            </ul>
          </div>


        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card className="glass-card border-slate-800/50">
            <CardContent className="text-center py-12">
              <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No trading rules found</p>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card key={rule.id} className="glass-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {formatCurrency(rule.account_size)} Account
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getAccountTypeBadge(rule.account_type)}
                        <span className="text-sm text-slate-400">
                          {getAccountTypeLabel(rule.account_type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {editingRule === rule.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveRule(rule)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingRule(null)
                            fetchRules() // Reset changes
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRule(rule.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Challenge Rules (HFT and One Step only) */}
                  {(rule.account_type === 'hft' || rule.account_type === 'one_step') && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center">
                        <Target className="w-4 h-4 mr-1 text-purple-400" />
                        {rule.account_type === 'hft' ? 'HFT Challenge' : 'One-Step Challenge'}
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-slate-400">Profit Target</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.challenge_profit_target || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'challenge_profit_target', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.challenge_profit_target)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Max Daily Loss</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.challenge_max_daily_loss || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'challenge_max_daily_loss', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.challenge_max_daily_loss)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Max Total Loss</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.challenge_max_total_loss || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'challenge_max_total_loss', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.challenge_max_total_loss)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Min Trading Days</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.challenge_min_trading_days || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'challenge_min_trading_days', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{rule.challenge_min_trading_days || 'N/A'} days</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 1 Rules (Two Step only) */}
                  {rule.account_type === 'two_step' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-orange-400" />
                        Phase 1 (Challenge 1)
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-slate-400">Profit Target</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_1_profit_target || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_1_profit_target', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.phase_1_profit_target)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Max Daily Loss</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_1_max_daily_loss || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_1_max_daily_loss', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.phase_1_max_daily_loss)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Max Total Loss</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_1_max_total_loss || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_1_max_total_loss', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.phase_1_max_total_loss)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Min Trading Days</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_1_min_trading_days || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_1_min_trading_days', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{rule.phase_1_min_trading_days || 'N/A'} days</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Phase 2 Rules (Two Step only) */}
                  {rule.account_type === 'two_step' && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-blue-400" />
                        Phase 2 (Challenge 2)
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-slate-400">Profit Target</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_2_profit_target || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_2_profit_target', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.phase_2_profit_target)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Max Daily Loss</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_2_max_daily_loss || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_2_max_daily_loss', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.phase_2_max_daily_loss)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Max Total Loss</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_2_max_total_loss || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_2_max_total_loss', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{formatCurrency(rule.phase_2_max_total_loss)}</p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs text-slate-400">Min Trading Days</label>
                          {editingRule === rule.id ? (
                            <Input
                              type="number"
                              value={rule.phase_2_min_trading_days || ''}
                              onChange={(e) => handleRuleChange(rule.id, 'phase_2_min_trading_days', e.target.value)}
                              className="glass-card border-slate-700/50 text-white h-8 text-sm"
                            />
                          ) : (
                            <p className="text-sm text-white">{rule.phase_2_min_trading_days || 'N/A'} days</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Account Rules (All types) */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-300 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-1 text-green-400" />
                      Live Account Rules
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-slate-400">Max Daily Loss</label>
                        {editingRule === rule.id ? (
                          <Input
                            type="number"
                            value={rule.live_max_daily_loss}
                            onChange={(e) => handleRuleChange(rule.id, 'live_max_daily_loss', e.target.value)}
                            className="glass-card border-slate-700/50 text-white h-8 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-white">{formatCurrency(rule.live_max_daily_loss)}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Max Total Loss</label>
                        {editingRule === rule.id ? (
                          <Input
                            type="number"
                            value={rule.live_max_total_loss}
                            onChange={(e) => handleRuleChange(rule.id, 'live_max_total_loss', e.target.value)}
                            className="glass-card border-slate-700/50 text-white h-8 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-white">{formatCurrency(rule.live_max_total_loss)}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Profit Share</label>
                        {editingRule === rule.id ? (
                          <Input
                            type="number"
                            value={rule.profit_share_percentage}
                            onChange={(e) => handleRuleChange(rule.id, 'profit_share_percentage', e.target.value)}
                            className="glass-card border-slate-700/50 text-white h-8 text-sm"
                          />
                        ) : (
                          <p className="text-sm text-white">{rule.profit_share_percentage}%</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
