"use client"

import {
  BarChart3,
  Plus,
  FileCheck,
  CreditCard,
  Users,
  BookOpen,
  Download,
  TrendingUp,
  Shield,
  User,
  Settings,
  X,
  LogOut,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    isActive: true,
  },
  {
    title: "Place Order",
    url: "/dashboard/place-order",
    icon: Plus,
  },
  {
    title: "KYC",
    url: "/dashboard/kyc",
    icon: FileCheck,
    badge: "Required",
  },
  {
    title: "Withdrawal",
    url: "/dashboard/withdrawal",
    icon: CreditCard,
  },
  {
    title: "Referral System",
    url: "/dashboard/referral",
    icon: Users,
  },
  {
    title: "Rules",
    url: "/dashboard/rules",
    icon: BookOpen,
  },
  {
    title: "Download",
    url: "/dashboard/download",
    icon: Download,
  },
]

interface AppSidebarProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function AppSidebar({ isOpen = true, onToggle }: AppSidebarProps) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      // Still redirect even if there's an error
      router.push("/login")
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50 
        transform transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-16"}
      `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" onClick={onToggle} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo Header - Fixed */}
        <div className="p-6 border-b border-slate-800/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow-emerald">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-slate-900" />
              </div>
            </div>
            {isOpen && (
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-gradient-primary truncate">FlashFundX</div>
                <div className="text-xs text-slate-400 font-medium truncate">Trading Dashboard</div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-slate-800/20 scrollbar-thumb-slate-600/50 hover:scrollbar-thumb-slate-500/70">
          <div className="py-6">
            {/* Navigation */}
            <div className="px-3">
              {isOpen && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Navigation</h3>
              )}
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.title} href={item.url}>
                    <div
                      className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                        item.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10"
                      } ${!isOpen ? "justify-center" : ""}`}
                      title={!isOpen ? item.title : ""}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="font-medium flex-1 truncate">{item.title}</span>
                          {item.badge && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs px-2 py-0.5">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                      {!isOpen && item.badge && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* User Profile - Fixed at Bottom */}
        <div className="p-4 border-t border-slate-800/50 flex-shrink-0">
          <div className="space-y-3">
            {/* User Info */}
            <div
              className={`flex items-center space-x-3 p-3 glass-card rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 cursor-pointer group ${
                !isOpen ? "justify-center" : ""
              }`}
              title={!isOpen ? "John Trader" : ""}
            >
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {isOpen && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white truncate">John Trader</div>
                    <div className="text-xs text-slate-400 truncate">john@example.com</div>
                  </div>
                  <Settings className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors flex-shrink-0" />
                </>
              )}
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className={`glass-card border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 bg-transparent transition-all duration-200 ${
                isOpen ? "w-full" : "w-full px-2"
              }`}
              title={!isOpen ? "Sign Out" : ""}
            >
              <LogOut className="w-4 h-4" />
              {isOpen && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
