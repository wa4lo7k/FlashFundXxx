"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth-context"
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NotificationCenter from "@/components/admin/NotificationCenter"
import {
  LayoutDashboard,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Shield,
  Zap,
  Target,
  BarChart3,
  FileText,
  Bell,
  Package,
  Server,
  Coins,
  Search,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { adminLogout, isLoading } = useAdminAuth()

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading admin portal...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    adminLogout()
    router.push("/admin/login")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Order Management",
      href: "/admin/order-management",
      icon: Package,
      current: pathname === "/admin/order-management",
    },
    {
      name: "Account Container",
      href: "/admin/account-container",
      icon: Server,
      current: pathname === "/admin/account-container",
    },
    {
      name: "Trading Rules",
      href: "/admin/trading-rules",
      icon: Settings,
      current: pathname === "/admin/trading-rules",
    },
    {
      name: "Crypto Management",
      href: "/admin/crypto-management",
      icon: Coins,
      current: pathname === "/admin/crypto-management",
    },
    {
      name: "All Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      current: pathname === "/admin/orders",
      badge: "131",
    },
    {
      name: "Completed Orders",
      href: "/admin/orders/completed",
      icon: CheckCircle,
      current: pathname === "/admin/orders/completed",
      badge: "113",
    },
    {
      name: "Failed Orders",
      href: "/admin/orders/failed",
      icon: XCircle,
      current: pathname === "/admin/orders/failed",
      badge: "42",
    },
    {
      name: "Pending Orders",
      href: "/admin/orders/pending",
      icon: Clock,
      current: pathname === "/admin/orders/pending",
      badge: "111",
    },
  ]

  const accountTypes = [
    {
      name: "Instant Active",
      href: "/admin/accounts/instant-active",
      icon: Zap,
      current: pathname === "/admin/accounts/instant-active",
      badge: "45",
      color: "emerald",
    },
    {
      name: "Instant Failed",
      href: "/admin/accounts/instant-failed",
      icon: Zap,
      current: pathname === "/admin/accounts/instant-failed",
      badge: "12",
      color: "red",
    },
    {
      name: "OneStep Active",
      href: "/admin/accounts/onestep-active",
      icon: Target,
      current: pathname === "/admin/accounts/onestep-active",
      badge: "34",
      color: "blue",
    },
    {
      name: "OneStep Failed",
      href: "/admin/accounts/onestep-failed",
      icon: Target,
      current: pathname === "/admin/accounts/onestep-failed",
      badge: "9",
      color: "red",
    },
    {
      name: "Two-Step Active",
      href: "/admin/accounts/two-step-active",
      icon: Target,
      current: pathname === "/admin/accounts/two-step-active",
      badge: "67",
      color: "teal",
    },
    {
      name: "Two-Step Failed",
      href: "/admin/accounts/two-step-failed",
      icon: Target,
      current: pathname === "/admin/accounts/two-step-failed",
      badge: "15",
      color: "red",
    },
    {
      name: "HFT Active",
      href: "/admin/accounts/hft-active",
      icon: BarChart3,
      current: pathname === "/admin/accounts/hft-active",
      badge: "28",
      color: "purple",
    },
    {
      name: "HFT Failed",
      href: "/admin/accounts/hft-failed",
      icon: BarChart3,
      current: pathname === "/admin/accounts/hft-failed",
      badge: "8",
      color: "red",
    },
  ]

  const analytics = [
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname === "/admin/analytics",
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileText,
      current: pathname === "/admin/reports",
    },
  ]

  const management = [
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathname === "/admin/users",
      badge: "1998",
    },
    {
      name: "Fix User Data",
      href: "/admin/fix-user-data",
      icon: Shield,
      current: pathname === "/admin/fix-user-data",
      badge: "Debug",
    },
    {
      name: "Certificates",
      href: "/admin/certificates",
      icon: FileText,
      current: pathname === "/admin/certificates",
      badge: "1",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800">
            <AdminSidebar
              navigation={navigation}
              accountTypes={accountTypes}
              analytics={analytics}
              management={management}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-950 border-r border-slate-800">
          <AdminSidebar
            navigation={navigation}
            accountTypes={accountTypes}
            analytics={analytics}
            management={management}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-slate-800 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 h-5 w-5 text-slate-400" />
              <input
                className="block h-10 w-full rounded-lg border-0 bg-slate-800/50 py-0 pl-10 pr-3 text-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 sm:text-sm"
                placeholder="Search orders, users, or IDs..."
                type="search"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <NotificationCenter />

              {/* Profile dropdown */}
              <div className="flex items-center gap-x-3">
                <div className="hidden lg:flex lg:flex-col lg:text-right lg:leading-tight">
                  <span className="text-sm font-semibold text-white">Admin User</span>
                  <span className="text-xs text-slate-400">admin@flashfundx.com</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <AdminProtectedRoute>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminProtectedRoute>
      </AdminAuthProvider>
    </ErrorBoundary>
  )
}

interface AdminSidebarProps {
  navigation: any[]
  accountTypes: any[]
  analytics: any[]
  management: any[]
  onClose?: () => void
  onLogout?: () => void
}

function AdminSidebar({ navigation, accountTypes, analytics, management, onClose, onLogout }: AdminSidebarProps) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 py-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow-emerald">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-slate-900" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-gradient-primary">Admin Portal</span>
            <div className="text-xs text-slate-400 font-medium">FlashFundX</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col space-y-8">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Overview
          </h3>
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className={`${
                      item.current 
                        ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                    } text-xs px-2 py-0.5`}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account Types */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Account Types
          </h3>
          <ul className="space-y-1">
            {accountTypes.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? `bg-${item.color}-500/20 text-${item.color}-400 border border-${item.color}-500/30`
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs">{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className={`${
                      item.current 
                        ? `bg-${item.color}-500/30 text-${item.color}-300 border-${item.color}-500/40`
                        : item.color === 'red'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                    } text-xs px-1.5 py-0.5`}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Analytics */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Analytics & Reports
          </h3>
          <ul className="space-y-1">
            {analytics.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Management */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Management
          </h3>
          <ul className="space-y-1">
            {management.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className={`${
                      item.current 
                        ? 'bg-teal-500/30 text-teal-300 border-teal-500/40' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                    } text-xs px-2 py-0.5`}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="mt-auto">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  )
}
