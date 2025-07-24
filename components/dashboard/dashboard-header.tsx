"use client"

import { Bell, Search, Settings, Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  onMenuClick?: () => void
  sidebarOpen?: boolean
}

export function DashboardHeader({ onMenuClick, sidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 h-10 w-10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="hidden lg:flex text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 h-10 w-10 transition-all duration-200"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </Button>

        <div>
          <h1 className="text-xl font-bold text-white">Trading Dashboard</h1>
          <p className="text-sm text-slate-400 hidden sm:block">Welcome back, manage your trading account</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search..."
            className="glass-card border-slate-700/50 text-white placeholder:text-slate-400 pl-10 w-64 h-10"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 h-10 w-10"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            3
          </Badge>
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 h-10 w-10"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
