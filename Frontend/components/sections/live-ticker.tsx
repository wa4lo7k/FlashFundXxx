"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface TickerData {
  symbol: string
  price: string
  change: string
  changePercent: string
  isPositive: boolean
}

export default function LiveTicker() {
  const [tickerData, setTickerData] = useState<TickerData[]>([
    { symbol: "EUR/USD", price: "1.0892", change: "+0.0025", changePercent: "+0.23%", isPositive: true },
    { symbol: "GBP/USD", price: "1.2654", change: "-0.0019", changePercent: "-0.15%", isPositive: false },
    { symbol: "USD/JPY", price: "149.82", change: "+0.45", changePercent: "+0.30%", isPositive: true },
    { symbol: "AUD/USD", price: "0.6543", change: "+0.0012", changePercent: "+0.18%", isPositive: true },
    { symbol: "USD/CAD", price: "1.3621", change: "-0.0008", changePercent: "-0.06%", isPositive: false },
    { symbol: "NZD/USD", price: "0.5987", change: "+0.0034", changePercent: "+0.57%", isPositive: true },
  ])

  const [liveProfit, setLiveProfit] = useState(12847.32)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setCurrentTime(new Date().toLocaleTimeString())

    const interval = setInterval(() => {
      setTickerData((prev) =>
        prev.map((item) => ({
          ...item,
          price: (Number.parseFloat(item.price) + (Math.random() - 0.5) * 0.001).toFixed(4),
          change: (Math.random() - 0.5 > 0 ? "+" : "-") + (Math.random() * 0.01).toFixed(4),
          changePercent: (Math.random() - 0.5 > 0 ? "+" : "-") + (Math.random() * 0.5).toFixed(2) + "%",
          isPositive: Math.random() > 0.5,
        })),
      )
      setLiveProfit((prev) => prev + (Math.random() - 0.5) * 100)
      setCurrentTime(new Date().toLocaleTimeString())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-8 glass border-y border-slate-800/30">
      <div className="container mx-auto px-6">
        {/* Live P&L Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4 glass-card px-6 py-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-300">Live Community P&L:</span>
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              +${liveProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Professional Scrolling Ticker */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll space-x-8">
            {[...tickerData, ...tickerData].map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 whitespace-nowrap glass-card rounded-xl px-6 py-3 border border-slate-700/30"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold text-slate-200">{item.symbol}</span>
                  <span className="text-lg font-mono text-white font-semibold">{item.price}</span>
                </div>
                <div className={`flex items-center space-x-1 ${item.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-xs font-semibold">{item.changePercent}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Status */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Markets Open</span>
            </div>
            {isMounted && <div>Last Updated: {currentTime}</div>}
            <div>Spread from 0.0 pips</div>
          </div>
        </div>
      </div>
    </section>
  )
}
