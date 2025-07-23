"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Shield, Award, Users, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-20 bg-slate-950 border-t border-slate-800/30 overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

      {/* Subtle accent lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/[0.015] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/[0.015] rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo.svg"
                alt="FlashFundX"
                width={200}
                height={60}
                className="h-10 w-auto"
              />
              <div className="text-xs text-slate-400 font-medium mt-2">Professional Trading Capital</div>
            </div>

            <p className="text-slate-400 mb-6 leading-relaxed font-medium">
              Empowering traders worldwide with instant funding, institutional infrastructure, and professional support.
            </p>

            {/* Trust Badges */}
            <div className="space-y-3 mb-6">
              <Badge className="glass-card text-emerald-300 border-emerald-500/30 font-semibold">
                <Award className="w-3 h-3 mr-2" />
                Regulated & Licensed
              </Badge>
              <Badge className="glass-card text-teal-300 border-teal-500/30 font-semibold">
                <Users className="w-3 h-3 mr-2" />
                15,000+ Active Traders
              </Badge>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { icon: "𝕏", label: "Twitter" },
                { icon: "📘", label: "Facebook" },
                { icon: "📷", label: "Instagram" },
                { icon: "💼", label: "LinkedIn" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href="#"
                  className="w-10 h-10 glass-card rounded-xl flex items-center justify-center hover:bg-slate-700/50 transition-all duration-300 group hover:scale-110 border border-slate-700/30"
                  aria-label={social.label}
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Products</h3>
            <ul className="space-y-4">
              {[
                { name: "Instant Accounts", href: "#pricing" },
                { name: "HFT Accounts", href: "#pricing" },
                { name: "1-Step Evaluation", href: "#pricing" },
                { name: "2-Step Evaluation", href: "#pricing" },
                { name: "Account Scaling", href: "#" },
                { name: "Risk Management", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Support</h3>
            <ul className="space-y-4">
              {[
                { name: "Help Center", href: "#faq" },
                { name: "Trading Rules", href: "#" },
                { name: "Platform Setup", href: "#" },
                { name: "Withdrawal Process", href: "#" },
                { name: "Account Verification", href: "#" },
                { name: "Contact Support", href: "#" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors group font-medium"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Contact</h3>

            <div className="glass-card p-4 rounded-xl border border-slate-700/30 mb-6">
              <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>24/7 Support</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <Link
                    href="mailto:support@flashfundx.com"
                    className="text-slate-300 hover:text-emerald-400 transition-colors font-medium"
                  >
                    support@flashfundx.com
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <Link
                    href="tel:+15551234567"
                    className="text-slate-300 hover:text-teal-400 transition-colors font-medium"
                  >
                    +1 (555) 123-4567
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">New York, NY</span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  { name: "Privacy Policy", href: "#" },
                  { name: "Terms of Service", href: "#" },
                  { name: "Risk Disclosure", href: "#" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium flex items-center space-x-2 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/30 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-slate-400 text-sm font-medium mb-2">
                © {currentYear} FlashFundX. All rights reserved.
              </p>
              <p className="text-slate-500 text-xs font-medium">
                Trading involves substantial risk of loss. Past performance is not indicative of future results.
              </p>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <Badge className="glass-card text-emerald-300 border-emerald-500/30 mb-1 font-semibold">Licensed</Badge>
                <div className="text-xs text-slate-500 font-medium">Regulated</div>
              </div>
              <div className="text-center">
                <Badge className="glass-card text-teal-300 border-teal-500/30 mb-1 font-semibold">Insured</Badge>
                <div className="text-xs text-slate-500 font-medium">Protected</div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center lg:text-right">
              <Button className="gradient-primary shadow-glow-emerald text-white font-semibold px-6 py-2 hover:scale-105 transition-all duration-300">
                Start Trading
              </Button>
              <div className="text-xs text-slate-500 mt-2 font-medium">Get funded in minutes</div>
            </div>
          </div>
        </div>

        {/* Risk Disclosure */}
        <div className="mt-8 pt-6 border-t border-slate-800/30">
          <div className="glass-card p-6 rounded-xl border border-slate-700/30">
            <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Risk Disclosure</span>
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Trading involves significant risk of loss and may not be suitable for all investors. Past performance is
              not indicative of future results. FlashFundX is a proprietary trading firm that provides funding to
              qualified traders. All trading is conducted with the firm's capital.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
