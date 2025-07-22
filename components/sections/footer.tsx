"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/20">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900/30" />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Link href="/" className="inline-block group">
                <Image
                  src="/250 1.svg"
                  alt="FlashFundX"
                  width={195}
                  height={126}
                  className="h-8 w-auto mb-3 transition-all duration-300 group-hover:scale-105 opacity-90"
                />
              </Link>
            </div>

            {/* Sophisticated Risk Disclosure Section */}
            <div className="relative mb-4 max-w-sm">
              <div className="border-l-2 border-slate-700/30 pl-3">
                {/* Minimalist header */}
                <h4 className="text-slate-400 font-normal text-xs uppercase tracking-wide mb-2 opacity-80">
                  Risk Disclosure
                </h4>

                {/* Refined typography with Netflix/Amazon styling */}
                <div className="space-y-2 text-slate-400">
                  <p className="text-xs leading-relaxed font-light tracking-wide">
                    This site provides educational information on financial markets trading, not investment advice.
                    FlashFundX does not offer investment services. It is not a broker.
                    Third-party liquidity providers power our platforms and data feed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-1">
            <h3 className="font-normal text-slate-300 mb-4 text-sm tracking-wide">Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Offer", href: "#" },
                { name: "Features", href: "#" },
                { name: "Loyalty Program", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-slate-200 transition-colors text-xs font-light tracking-wide hover:underline underline-offset-2"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="font-normal text-slate-300 mb-4 text-sm tracking-wide">Contact Us</h3>

            {/* Social Links */}
            <div className="flex space-x-2 mb-4">
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
                  className="w-7 h-7 bg-slate-800/50 rounded-md flex items-center justify-center hover:bg-slate-700/70 transition-all duration-200 hover:scale-105"
                  aria-label={social.label}
                >
                  <social.icon className="w-3.5 h-3.5 text-slate-400 hover:text-slate-300" />
                </Link>
              ))}
            </div>

            {/* Contact Email */}
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href="mailto:support@flashfundx.com"
                className="text-slate-400 hover:text-slate-200 transition-colors text-xs font-light tracking-wide hover:underline underline-offset-2"
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
