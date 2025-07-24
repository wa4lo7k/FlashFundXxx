"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  DollarSign,
  Mail,
  Bell,
  Database,
  Key,
  Globe,
  Users,
  Target,
  Zap,
  BarChart3,
} from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: "FlashFundX",
    platformUrl: "https://flashfundx.com",
    supportEmail: "support@flashfundx.com",
    maintenanceMode: false,
    
    // Challenge Settings
    instantProfitTarget: 10,
    instantMaxDrawdown: 5,
    oneStepProfitTarget: 8,
    oneStepMaxDrawdown: 5,
    twoStepPhase1Target: 8,
    twoStepPhase2Target: 5,
    twoStepMaxDrawdown: 5,
    hftProfitTarget: 6,
    hftMaxDrawdown: 3,
    
    // Payment Settings
    minimumDeposit: 100,
    maximumDeposit: 100000,
    paymentMethods: ["USDT", "BTC", "ETH"],
    autoApprovePayments: false,
    
    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    emailNotifications: true,
    
    // Security Settings
    twoFactorRequired: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Notification Settings
    orderNotifications: true,
    userRegistrationNotifications: true,
    paymentNotifications: true,
    systemAlerts: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Implement save logic here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Settings className="w-8 h-8 mr-3 text-purple-400" />
            Admin Settings
          </h1>
          <p className="text-slate-400 mt-2">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/50">
          <TabsTrigger value="platform" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Globe className="w-4 h-4 mr-2" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Target className="w-4 h-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <DollarSign className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-400" />
                Platform Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Platform Name</Label>
                  <Input
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange("platformName", e.target.value)}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Platform URL</Label>
                  <Input
                    value={settings.platformUrl}
                    onChange={(e) => handleSettingChange("platformUrl", e.target.value)}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Support Email</Label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange("supportEmail", e.target.value)}
                  className="glass-card border-slate-700/50 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                <div>
                  <Label className="text-slate-300 font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-slate-400 mt-1">Enable to temporarily disable user access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenge Settings */}
        <TabsContent value="challenges" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instant Challenge */}
            <Card className="glass-card border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-emerald-400" />
                  Instant Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Profit Target (%)</Label>
                  <Input
                    type="number"
                    value={settings.instantProfitTarget}
                    onChange={(e) => handleSettingChange("instantProfitTarget", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={settings.instantMaxDrawdown}
                    onChange={(e) => handleSettingChange("instantMaxDrawdown", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* OneStep Challenge */}
            <Card className="glass-card border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-400" />
                  OneStep Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Profit Target (%)</Label>
                  <Input
                    type="number"
                    value={settings.oneStepProfitTarget}
                    onChange={(e) => handleSettingChange("oneStepProfitTarget", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={settings.oneStepMaxDrawdown}
                    onChange={(e) => handleSettingChange("oneStepMaxDrawdown", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* TwoStep Challenge */}
            <Card className="glass-card border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-teal-400" />
                  TwoStep Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Phase 1 Target (%)</Label>
                  <Input
                    type="number"
                    value={settings.twoStepPhase1Target}
                    onChange={(e) => handleSettingChange("twoStepPhase1Target", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Phase 2 Target (%)</Label>
                  <Input
                    type="number"
                    value={settings.twoStepPhase2Target}
                    onChange={(e) => handleSettingChange("twoStepPhase2Target", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={settings.twoStepMaxDrawdown}
                    onChange={(e) => handleSettingChange("twoStepMaxDrawdown", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* HFT Challenge */}
            <Card className="glass-card border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                  HFT Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Profit Target (%)</Label>
                  <Input
                    type="number"
                    value={settings.hftProfitTarget}
                    onChange={(e) => handleSettingChange("hftProfitTarget", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Max Drawdown (%)</Label>
                  <Input
                    type="number"
                    value={settings.hftMaxDrawdown}
                    onChange={(e) => handleSettingChange("hftMaxDrawdown", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-400" />
                Payment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Minimum Deposit ($)</Label>
                  <Input
                    type="number"
                    value={settings.minimumDeposit}
                    onChange={(e) => handleSettingChange("minimumDeposit", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Maximum Deposit ($)</Label>
                  <Input
                    type="number"
                    value={settings.maximumDeposit}
                    onChange={(e) => handleSettingChange("maximumDeposit", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                <div>
                  <Label className="text-slate-300 font-medium">Auto-Approve Payments</Label>
                  <p className="text-sm text-slate-400 mt-1">Automatically approve verified payments</p>
                </div>
                <Switch
                  checked={settings.autoApprovePayments}
                  onCheckedChange={(checked) => handleSettingChange("autoApprovePayments", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-400" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">SMTP Host</Label>
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">SMTP Port</Label>
                  <Input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleSettingChange("smtpPort", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">SMTP Username</Label>
                  <Input
                    value={settings.smtpUser}
                    onChange={(e) => handleSettingChange("smtpUser", e.target.value)}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">SMTP Password</Label>
                  <Input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleSettingChange("smtpPassword", e.target.value)}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                <div>
                  <Label className="text-slate-300 font-medium">Email Notifications</Label>
                  <p className="text-sm text-slate-400 mt-1">Enable automated email notifications</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange("maxLoginAttempts", Number(e.target.value))}
                    className="glass-card border-slate-700/50 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                <div>
                  <Label className="text-slate-300 font-medium">Two-Factor Authentication Required</Label>
                  <p className="text-sm text-slate-400 mt-1">Require 2FA for all admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange("twoFactorRequired", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="glass-card border-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-purple-400" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "orderNotifications", label: "Order Notifications", description: "Get notified about new orders and status changes" },
                { key: "userRegistrationNotifications", label: "User Registration", description: "Get notified when new users register" },
                { key: "paymentNotifications", label: "Payment Notifications", description: "Get notified about payment confirmations" },
                { key: "systemAlerts", label: "System Alerts", description: "Get notified about system issues and maintenance" },
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                  <div>
                    <Label className="text-slate-300 font-medium">{notification.label}</Label>
                    <p className="text-sm text-slate-400 mt-1">{notification.description}</p>
                  </div>
                  <Switch
                    checked={settings[notification.key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => handleSettingChange(notification.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
