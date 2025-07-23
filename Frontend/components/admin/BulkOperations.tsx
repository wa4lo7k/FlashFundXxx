"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Upload,
  Mail,
  Settings,
  Trash2,
  AlertTriangle,
  Users,
  FileText,
} from "lucide-react"

interface BulkOperationsProps {
  selectedItems: string[]
  itemType: "orders" | "users"
  onClearSelection: () => void
  onBulkAction: (action: string, options?: any) => void
}

export default function BulkOperations({ 
  selectedItems, 
  itemType, 
  onClearSelection, 
  onBulkAction 
}: BulkOperationsProps) {
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState("")
  const [actionOptions, setActionOptions] = useState<any>({})

  const orderActions = [
    {
      id: "complete",
      label: "Mark as Completed",
      icon: CheckCircle,
      color: "emerald",
      description: "Mark selected orders as completed and deliver accounts",
      requiresConfirmation: true,
    },
    {
      id: "fail",
      label: "Mark as Failed",
      icon: XCircle,
      color: "red",
      description: "Mark selected orders as failed",
      requiresConfirmation: true,
    },
    {
      id: "pending",
      label: "Set to Pending",
      icon: Clock,
      color: "yellow",
      description: "Reset selected orders to pending status",
      requiresConfirmation: false,
    },
    {
      id: "export",
      label: "Export Data",
      icon: Download,
      color: "blue",
      description: "Export selected orders to CSV/Excel",
      requiresConfirmation: false,
    },
    {
      id: "send_email",
      label: "Send Email",
      icon: Mail,
      color: "purple",
      description: "Send bulk email to order customers",
      requiresConfirmation: false,
    },
    {
      id: "delete",
      label: "Delete Orders",
      icon: Trash2,
      color: "red",
      description: "Permanently delete selected orders",
      requiresConfirmation: true,
    },
  ]

  const userActions = [
    {
      id: "activate",
      label: "Activate Users",
      icon: CheckCircle,
      color: "emerald",
      description: "Activate selected user accounts",
      requiresConfirmation: false,
    },
    {
      id: "suspend",
      label: "Suspend Users",
      icon: XCircle,
      color: "red",
      description: "Suspend selected user accounts",
      requiresConfirmation: true,
    },
    {
      id: "verify_kyc",
      label: "Verify KYC",
      icon: CheckCircle,
      color: "teal",
      description: "Mark KYC as verified for selected users",
      requiresConfirmation: false,
    },
    {
      id: "export",
      label: "Export Users",
      icon: Download,
      color: "blue",
      description: "Export selected users to CSV/Excel",
      requiresConfirmation: false,
    },
    {
      id: "send_email",
      label: "Send Email",
      icon: Mail,
      color: "purple",
      description: "Send bulk email to selected users",
      requiresConfirmation: false,
    },
    {
      id: "delete",
      label: "Delete Users",
      icon: Trash2,
      color: "red",
      description: "Permanently delete selected users",
      requiresConfirmation: true,
    },
  ]

  const actions = itemType === "orders" ? orderActions : userActions

  const handleActionSelect = (action: any) => {
    setSelectedAction(action.id)
    setActionOptions({ action })
    
    if (action.requiresConfirmation) {
      setIsConfirmDialogOpen(true)
    } else {
      setIsActionDialogOpen(true)
    }
  }

  const handleConfirmAction = () => {
    onBulkAction(selectedAction, actionOptions)
    setIsConfirmDialogOpen(false)
    setIsActionDialogOpen(false)
    onClearSelection()
  }

  const handleActionWithOptions = (options: any) => {
    onBulkAction(selectedAction, { ...actionOptions, ...options })
    setIsActionDialogOpen(false)
    onClearSelection()
  }

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-card border-slate-800/50 shadow-2xl rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox checked={true} className="border-emerald-500" />
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {selectedItems.length} {itemType} selected
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              {actions.slice(0, 4).map((action) => (
                <Button
                  key={action.id}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleActionSelect(action)}
                  className={`text-${action.color}-400 hover:text-${action.color}-300 hover:bg-${action.color}-500/10`}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              ))}

              <Select onValueChange={(value) => {
                const action = actions.find(a => a.id === value)
                if (action) handleActionSelect(action)
              }}>
                <SelectTrigger className="glass-card border-slate-700/50 text-white w-32">
                  <Settings className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="More" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {actions.slice(4).map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      <div className="flex items-center space-x-2">
                        <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                        <span>{action.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-slate-400 hover:text-white"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Action Options Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="max-w-md bg-slate-950 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {actionOptions.action?.icon && (
                <actionOptions.action.icon className={`w-5 h-5 mr-2 text-${actionOptions.action.color}-400`} />
              )}
              {actionOptions.action?.label}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {actionOptions.action?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedAction === "export" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Export Format</label>
                <Select defaultValue="csv">
                  <SelectTrigger className="glass-card border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="excel">Excel File</SelectItem>
                    <SelectItem value="json">JSON File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedAction === "send_email" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Email Template</label>
                <Select defaultValue="welcome">
                  <SelectTrigger className="glass-card border-slate-700/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="account_ready">Account Ready</SelectItem>
                    <SelectItem value="payment_reminder">Payment Reminder</SelectItem>
                    <SelectItem value="custom">Custom Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-400">
                This will affect {selectedItems.length} {itemType}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsActionDialogOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleActionWithOptions({})}
                  className={`bg-${actionOptions.action?.color}-500/20 text-${actionOptions.action?.color}-400 border border-${actionOptions.action?.color}-500/30 hover:bg-${actionOptions.action?.color}-500/30`}
                >
                  Execute
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent className="bg-slate-950 border-slate-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
              Confirm Bulk Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to {actionOptions.action?.label.toLowerCase()} {selectedItems.length} {itemType}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={`bg-${actionOptions.action?.color}-500/20 text-${actionOptions.action?.color}-400 border border-${actionOptions.action?.color}-500/30 hover:bg-${actionOptions.action?.color}-500/30`}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
