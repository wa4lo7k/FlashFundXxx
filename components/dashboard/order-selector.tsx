"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Plus, BarChart3 } from "lucide-react"
import Link from "next/link"

interface Order {
  order_id: string
  account_type: string
  account_size: number
  order_status: string
  delivery_status: string
}

interface OrderSelectorProps {
  orders: Order[]
  selectedOrderId: string
  onOrderSelect: (orderId: string) => void
}

export function OrderSelector({ orders, selectedOrderId, onOrderSelect }: OrderSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)

  const currentOrder = orders.find((order) => order.order_id === selectedOrderId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const formatAccountType = (type: string) => {
    switch (type) {
      case 'instant':
        return 'Instant Account'
      case 'hft':
        return 'HFT Account'
      case 'one_step':
        return '1-Step Evaluation'
      case 'two_step':
        return '2-Step Evaluation'
      default:
        return type
    }
  }

  const formatAccountSize = (size: number) => {
    if (size >= 1000000) {
      return `$${(size / 1000000).toFixed(1)}M`
    } else if (size >= 1000) {
      return `$${(size / 1000).toFixed(0)}K`
    } else {
      return `$${size}`
    }
  }

  if (isLoading) {
    return (
      <div className="glass-card p-4 rounded-xl border border-slate-800/30 mb-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return null // Don't show order selector if no orders
  }

  return (
    <div className="glass-card p-4 rounded-xl border border-slate-800/30 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-400 font-medium">Selected Account:</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="glass-card border-slate-600/50 text-white hover:bg-slate-800/50 bg-transparent h-10"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="text-sm font-semibold">{currentOrder?.order_id}</div>
                    <div className="text-xs text-slate-400">{formatAccountType(currentOrder?.account_type || '')}</div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 glass border-slate-700/50 bg-slate-900">
              <div className="p-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Accounts</div>
                {orders.map((order) => (
                  <DropdownMenuItem
                    key={order.order_id}
                    onClick={() => onOrderSelect(order.order_id)}
                    className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 p-3 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold font-mono text-sm">{order.order_id}</span>
                          <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.delivery_status)}`}>
                            {order.delivery_status}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-400">
                          {formatAccountType(order.account_type)} • {formatAccountSize(order.account_size)}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <Link href="/dashboard/place-order">
                <DropdownMenuItem className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-3 cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-slate-400">Account Size</div>
            <div className="text-lg font-bold text-white">{formatAccountSize(currentOrder?.account_size || 0)}</div>
          </div>
          <Badge className={`px-3 py-1 ${getStatusColor(currentOrder?.delivery_status || "")}`}>
            {currentOrder?.delivery_status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
