"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Monitor, Smartphone, Globe, CheckCircle } from "lucide-react"

export default function DownloadPage() {
  const platforms = [
    {
      name: "MetaTrader 4",
      description:
        "The world's most popular trading platform with advanced charting and automated trading capabilities.",
      version: "Build 1380",
      size: "15.2 MB",
      icon: "MT4",
      downloads: [
        { type: "Windows", url: "#", icon: Monitor },
        { type: "Mobile", url: "#", icon: Smartphone },
        { type: "Web", url: "#", icon: Globe },
      ],
      features: [
        "Advanced charting tools",
        "Expert Advisors (EAs)",
        "Custom indicators",
        "One-click trading",
        "Market analysis tools",
      ],
    },
    {
      name: "MetaTrader 5",
      description:
        "Next-generation trading platform with enhanced features, more timeframes, and advanced order types.",
      version: "Build 3815",
      size: "18.7 MB",
      icon: "MT5",
      downloads: [
        { type: "Windows", url: "#", icon: Monitor },
        { type: "Mobile", url: "#", icon: Smartphone },
        { type: "Web", url: "#", icon: Globe },
      ],
      features: [
        "21 timeframes",
        "Depth of Market",
        "Economic calendar",
        "Advanced order types",
        "Multi-asset trading",
      ],
    },
  ]

  const serverDetails = {
    server: "FlashFundX-Live",
    address: "live.flashfundx.com:443",
    type: "Live Trading Server",
    location: "New York, USA",
    latency: "< 10ms",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800/30">
          <div className="flex items-center space-x-3 mb-2">
            <Download className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Platform Downloads</h1>
          </div>
          <p className="text-slate-400 font-medium">
            Download and install your preferred trading platform to start trading with your funded account
          </p>
        </div>

        {/* Server Information */}
        <Card className="glass-card border-slate-800/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Server Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="text-slate-400 font-medium">Server Name</span>
                <div className="text-white font-semibold">{serverDetails.server}</div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-medium">Server Address</span>
                <div className="text-emerald-400 font-mono text-sm">{serverDetails.address}</div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-medium">Server Type</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{serverDetails.type}</Badge>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-medium">Location</span>
                <div className="text-white font-semibold">{serverDetails.location}</div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-medium">Latency</span>
                <div className="text-emerald-400 font-semibold">{serverDetails.latency}</div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-medium">Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-400 font-semibold">Online</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Downloads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              className="glass-card border-slate-800/30 hover:border-slate-700/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow-emerald">
                    <span className="text-white font-bold text-lg">{platform.icon}</span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-white mb-1">{platform.name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Version: {platform.version}</span>
                      <span>Size: {platform.size}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 font-medium mt-4">{platform.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Download Options */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Download Options</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {platform.downloads.map((download, downloadIndex) => (
                      <Button
                        key={downloadIndex}
                        variant="outline"
                        className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent justify-between h-12"
                      >
                        <div className="flex items-center space-x-3">
                          <download.icon className="w-5 h-5" />
                          <span className="font-medium">{download.type} Version</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Key Features</h4>
                  <div className="space-y-2">
                    {platform.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Download Button */}
                <Button className="w-full gradient-primary shadow-glow-emerald text-white font-semibold h-12 hover:scale-105 transition-all duration-300">
                  <Download className="w-5 h-5 mr-2" />
                  Download {platform.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Installation Guide */}
        <Card className="glass-card border-slate-800/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Installation Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Getting Started</h4>
                <ol className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Download your preferred platform from the options above</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Run the installer and follow the setup wizard</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Open the platform and connect to our trading server</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Login with your funded account credentials</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white">Need Help?</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Installation Video Guide
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Platform Documentation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 bg-transparent justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Contact Technical Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
