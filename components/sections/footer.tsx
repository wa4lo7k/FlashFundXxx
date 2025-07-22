"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/30">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900/50" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/250 1.svg"
                alt="FlashFundX"
                width={195}
                height={126}
                className="h-10 w-auto mb-4"
              />
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              RISK DISCLOSURE: This site provides educational information on financial markets
              trading, not investment advice. FundedFolk does not offer investment services. It not a
              broker. Third-party liquidity providers power our platforms and data feed.
            </p>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white mb-6 text-lg">Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Offer", href: "#" },
                { name: "Features", href: "#" },
                { name: "Loyalty Program", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white mb-6 text-lg">Contact Us</h3>

            {/* Social Links */}
            <div className="flex space-x-3 mb-6">
              {[
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: MessageCircle, label: "Telegram", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Facebook, label: "Facebook", href: "#" },
                {
                  icon: ({ className }: { className?: string }) => (
                    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  ),
                  label: "Discord",
                  href: "#"
                },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>

            {/* Contact Email */}
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <Link
                href="mailto:support@flashfundx.com"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                support@flashfundx.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
