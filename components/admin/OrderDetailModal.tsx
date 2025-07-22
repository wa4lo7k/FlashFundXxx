"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FileText,
  User,
  CreditCard,
  Settings,
  Save,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Copy,
  Download,
  Upload,
} from "lucide-react"

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
  mode: "view" | "edit"
}

export default function OrderDetailModal({ isOpen, onClose, order, mode }: OrderDetailModalProps) {
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const [formData, setFormData] = useState({
    status: order?.status || "pending",
    platformLogin: order?.platformLogin || "",
    platformPassword: order?.platformPassword || "",
    server: order?.server || "",
    profitTarget: order?.profitTarget || "",
    sessionId: order?.sessionId || "",
    terminalId: order?.terminalId || "",
    drawdown: order?.drawdown || "",
    notes: order?.notes || "",
    containerAccount: order?.containerAccount || "",
  })

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving order:", formData)
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: string) => {
    setFormData(prev => ({ ...prev, status: newStatus }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Pending" },
      completed: { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", label: "Completed" },
      failed: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Failed" },
      processing: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Processing" },
      stage2: { color: "bg-teal-500/20 text-teal-400 border-teal-500/30", label: "Stage 2" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <Badge className={`${config.color} text-sm px-3 py-1`}>
        {config.label}
      </Badge>
    )
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800 text-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-white flex items-center">
            <FileText className="w-6 h-6 mr-3 text-emerald-400" />
            Order Details - {order.id}
          </DialogTitle>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="information" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="information" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <FileText className="w-4 h-4 mr-2" />
              Order Information
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Proof
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              <User className="w-4 h-4 mr-2" />
              Account Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="information" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Information */}
              <Card className="glass-card border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Order ID:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono text-emerald-400">{order.id}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-400">Status:</Label>
                      <div className="mt-1">
                        {isEditing ? (
                          <Select value={formData.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="glass-card border-slate-700/50 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="stage2">Stage 2</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          getStatusBadge(order.status)
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Username:</Label>
                      <p className="text-white font-medium mt-1">{order.user.name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Email:</Label>
                      <p className="text-slate-300 mt-1">{order.user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Challenge Type:</Label>
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 mt-1">
                        {order.challengeType}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-slate-400">Account Size:</Label>
                      <p className="text-white font-semibold mt-1">${order.accountSize.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Platform:</Label>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                        {order.platform.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-slate-400">Payment Method:</Label>
                      <p className="text-slate-300 mt-1">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Transaction ID:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono text-slate-300">{order.transactionId}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-400">Created At:</Label>
                      <p className="text-slate-300 mt-1">{order.createdAt}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-400">Updated At:</Label>
                    <p className="text-slate-300 mt-1">{order.updatedAt || "N/A"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card border-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-emerald-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button className="w-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark as Failed
                  </Button>
                  <Button className="w-full bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30">
                    <Clock className="w-4 h-4 mr-2" />
                    Move to Stage 2
                  </Button>
                  <Button className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 mt-6">
            <Card className="glass-card border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-emerald-400" />
                  Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400">Payment Method:</Label>
                      <p className="text-white font-medium mt-1">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Transaction ID:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-mono text-emerald-400">{order.transactionId}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-white">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-400">Amount:</Label>
                      <p className="text-white font-semibold mt-1">${order.accountSize.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Uploaded on:</Label>
                      <p className="text-slate-300 mt-1">{order.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-lg">
                    <div className="w-full h-48 bg-slate-800/50 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400">Payment proof image</p>
                        <p className="text-xs text-slate-500 mt-1">Click to view full size</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6 mt-6">
            <Card className="glass-card border-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-emerald-400" />
                  Trading Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400">Select Container Account</Label>
                      {isEditing ? (
                        <Select value={formData.containerAccount} onValueChange={(value) => setFormData(prev => ({ ...prev, containerAccount: value }))}>
                          <SelectTrigger className="glass-card border-slate-700/50 text-white mt-1">
                            <SelectValue placeholder="Select a container" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700">
                            <SelectItem value="container1">Container Account 1</SelectItem>
                            <SelectItem value="container2">Container Account 2</SelectItem>
                            <SelectItem value="container3">Container Account 3</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-white mt-1">{formData.containerAccount || "Not provided"}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400">Platform Login</Label>
                        {isEditing ? (
                          <Input
                            value={formData.platformLogin}
                            onChange={(e) => setFormData(prev => ({ ...prev, platformLogin: e.target.value }))}
                            className="glass-card border-slate-700/50 text-white mt-1"
                            placeholder="Enter platform login"
                          />
                        ) : (
                          <p className="text-white mt-1">{formData.platformLogin || "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-400">Platform Password</Label>
                        {isEditing ? (
                          <Input
                            type="password"
                            value={formData.platformPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, platformPassword: e.target.value }))}
                            className="glass-card border-slate-700/50 text-white mt-1"
                            placeholder="Enter platform password"
                          />
                        ) : (
                          <p className="text-white mt-1">{formData.platformPassword ? "••••••••" : "Not provided"}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400">Server</Label>
                        {isEditing ? (
                          <Input
                            value={formData.server}
                            onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
                            className="glass-card border-slate-700/50 text-white mt-1"
                            placeholder="Enter server name"
                          />
                        ) : (
                          <p className="text-white mt-1">{formData.server || "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-400">Profit Target</Label>
                        {isEditing ? (
                          <Input
                            value={formData.profitTarget}
                            onChange={(e) => setFormData(prev => ({ ...prev, profitTarget: e.target.value }))}
                            className="glass-card border-slate-700/50 text-white mt-1"
                            placeholder="Enter profit target"
                          />
                        ) : (
                          <p className="text-white mt-1">{formData.profitTarget || "Not provided"}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400">Session ID</Label>
                        {isEditing ? (
                          <Input
                            value={formData.sessionId}
                            onChange={(e) => setFormData(prev => ({ ...prev, sessionId: e.target.value }))}
                            className="glass-card border-slate-700/50 text-white mt-1"
                            placeholder="Enter session ID"
                          />
                        ) : (
                          <p className="text-white mt-1">{formData.sessionId || "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-slate-400">Terminal ID</Label>
                        {isEditing ? (
                          <Input
                            value={formData.terminalId}
                            onChange={(e) => setFormData(prev => ({ ...prev, terminalId: e.target.value }))}
                            className="glass-card border-slate-700/50 text-white mt-1"
                            placeholder="Enter terminal ID"
                          />
                        ) : (
                          <p className="text-white mt-1">{formData.terminalId || "Not provided"}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-400">Drawdown</Label>
                      {isEditing ? (
                        <Input
                          value={formData.drawdown}
                          onChange={(e) => setFormData(prev => ({ ...prev, drawdown: e.target.value }))}
                          className="glass-card border-slate-700/50 text-white mt-1"
                          placeholder="Enter drawdown limit"
                        />
                      ) : (
                        <p className="text-white mt-1">{formData.drawdown || "Not provided"}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-slate-400">Notes</Label>
                      {isEditing ? (
                        <Textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="glass-card border-slate-700/50 text-white mt-1"
                          placeholder="Add any notes or comments..."
                          rows={3}
                        />
                      ) : (
                        <p className="text-white mt-1">{formData.notes || "No notes"}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Account Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Status:</span>
                          {getStatusBadge(formData.status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Account Type:</span>
                          <span className="text-white">{order.challengeType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Platform:</span>
                          <span className="text-white">{order.platform.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <h4 className="text-emerald-400 font-medium mb-2">Account Delivery</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Fill in the trading account details above and click "Deliver Account" to send credentials to the user.
                      </p>
                      <Button className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Deliver Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
