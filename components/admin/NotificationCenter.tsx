"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  DollarSign,
  Users,
  ShoppingCart,
  Settings,
  Clock,
  Eye,
  Trash2,
} from "lucide-react"

interface Notification {
  id: string
  type: "order" | "payment" | "user" | "system" | "alert"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high" | "critical"
  actionUrl?: string
  metadata?: any
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  // Mock notifications - replace with real-time data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "order",
        title: "New Order Received",
        message: "Order FxE42616723 from Erkinov requires review",
        timestamp: "2 minutes ago",
        read: false,
        priority: "high",
        actionUrl: "/admin/orders/FxE42616723",
        metadata: { orderId: "FxE42616723", userId: "USR001", amount: 1000 }
      },
      {
        id: "2",
        type: "payment",
        title: "Payment Confirmed",
        message: "USDT payment of $5,000 confirmed for order FxE46883135",
        timestamp: "5 minutes ago",
        read: false,
        priority: "medium",
        actionUrl: "/admin/orders/FxE46883135",
        metadata: { orderId: "FxE46883135", amount: 5000, currency: "USDT" }
      },
      {
        id: "3",
        type: "user",
        title: "KYC Verification Required",
        message: "User Ahmed Hassan submitted KYC documents for review",
        timestamp: "12 minutes ago",
        read: true,
        priority: "medium",
        actionUrl: "/admin/users/USR003",
        metadata: { userId: "USR003", userName: "Ahmed Hassan" }
      },
      {
        id: "4",
        type: "system",
        title: "System Maintenance",
        message: "Scheduled maintenance window starts in 2 hours",
        timestamp: "1 hour ago",
        read: false,
        priority: "critical",
        metadata: { maintenanceStart: "2025-07-05T22:00:00Z" }
      },
      {
        id: "5",
        type: "alert",
        title: "High Server Load",
        message: "Trading server CPU usage at 85% - monitoring required",
        timestamp: "1 hour ago",
        read: true,
        priority: "high",
        metadata: { serverName: "trading-01", cpuUsage: 85 }
      },
    ]
    setNotifications(mockNotifications)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === "critical" ? "text-red-400" : 
                     priority === "high" ? "text-orange-400" :
                     priority === "medium" ? "text-blue-400" : "text-slate-400"

    switch (type) {
      case "order":
        return <ShoppingCart className={`w-4 h-4 ${iconClass}`} />
      case "payment":
        return <DollarSign className={`w-4 h-4 ${iconClass}`} />
      case "user":
        return <Users className={`w-4 h-4 ${iconClass}`} />
      case "system":
        return <Settings className={`w-4 h-4 ${iconClass}`} />
      case "alert":
        return <AlertTriangle className={`w-4 h-4 ${iconClass}`} />
      default:
        return <Info className={`w-4 h-4 ${iconClass}`} />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const config = {
      critical: { color: "bg-red-500/20 text-red-400 border-red-500/30", label: "Critical" },
      high: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", label: "High" },
      medium: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Medium" },
      low: { color: "bg-slate-500/20 text-slate-400 border-slate-500/30", label: "Low" },
    }
    const { color, label } = config[priority as keyof typeof config] || config.low
    return <Badge className={`${color} text-xs px-2 py-0.5`}>{label}</Badge>
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setSelectedNotification(notification)
    setIsDetailOpen(true)
    setIsOpen(false)
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative p-2 text-slate-400 hover:text-white">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-xs text-white flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 bg-slate-950 border-slate-800" align="end">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-emerald-400 hover:text-emerald-300 text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {notifications.length} total
                </Badge>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No notifications</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors ${
                      !notification.read ? "bg-slate-800/20" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-medium ${!notification.read ? "text-white" : "text-slate-300"}`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getPriorityBadge(notification.priority)}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{notification.timestamp}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-slate-800">
              <Button
                variant="ghost"
                className="w-full text-slate-400 hover:text-white text-sm"
                onClick={() => setIsOpen(false)}
              >
                View All Notifications
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Notification Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type, selectedNotification.priority)}
              <span>{selectedNotification?.title}</span>
              {selectedNotification && getPriorityBadge(selectedNotification.priority)}
            </DialogTitle>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <p className="text-slate-300 mb-4">{selectedNotification.message}</p>
                <p className="text-sm text-slate-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {selectedNotification.timestamp}
                </p>
              </div>

              {selectedNotification.metadata && (
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Details</h4>
                  <div className="space-y-1">
                    {Object.entries(selectedNotification.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-4">
                {selectedNotification.actionUrl && (
                  <Button
                    className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                    onClick={() => {
                      // Navigate to action URL
                      console.log("Navigate to:", selectedNotification.actionUrl)
                      setIsDetailOpen(false)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteNotification(selectedNotification.id)
                    setIsDetailOpen(false)
                  }}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
