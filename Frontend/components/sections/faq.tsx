"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, MessageCircle, Phone, Mail, Clock, Shield, CheckCircle } from "lucide-react"

const faqs = [
  {
    q: "How quickly can I get funded?",
    a: "Instant Accounts are activated immediately after purchase. Evaluation accounts are funded within 24-48 hours after passing the challenge.",
  },
  {
    q: "What is the profit-split structure?",
    a: "Depending on the plan, you keep 80-90% of all profits. There are no hidden platform or withdrawal fees.",
  },
  {
    q: "Are there any minimum trading-day requirements?",
    a: "Instant & HFT accounts have none. Evaluation plans require a minimum of 5 trading days to request a payout.",
  },
  {
    q: "How do profit withdrawals work?",
    a: "You can request profit withdrawals at any time once you meet the minimum requirements. Most withdrawals are processed within 24-48 hours.",
  },
  {
    q: "Which platforms do you support?",
    a: "MetaTrader 4, MetaTrader 5 and cTrader with institutional liquidity and <10ms execution latency.",
  },
  {
    q: "What are the drawdown limits?",
    a: "Limits vary by account type: Instant (5% max), HFT (6% max), 1-Step (8% max), 2-Step (10% max).",
  },
  {
    q: "Can I trade news events?",
    a: "Yes, news trading is permitted on all account types. We provide a professional trading environment without restrictions.",
  },
  {
    q: "Is there a refund policy?",
    a: "Evaluation accounts offer refundable fees upon successful completion. Instant accounts are non-refundable but provide immediate access.",
  },
]

const supportFeatures = [
  {
    title: "24/7 Live Support",
    description: "Get instant help from our expert team",
    icon: MessageCircle,
    availability: "Always Available",
    color: "emerald",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our specialists",
    icon: Phone,
    availability: "Business Hours",
    color: "teal",
  },
  {
    title: "Email Support",
    description: "Detailed responses within 2 hours",
    icon: Mail,
    availability: "24/7 Response",
    color: "blue",
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-32 relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 glass-card text-blue-300 px-6 py-2 font-medium border border-blue-500/20">
            <HelpCircle className="w-4 h-4 mr-2" />
            Knowledge Base
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-secondary">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Everything you need to know before getting started with your funded trading journey
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* FAQ Content */}
            <div className="lg:col-span-2">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="glass border-slate-800/30 rounded-xl px-6 py-2">
                    <AccordionTrigger className="text-left hover:text-emerald-400 transition-colors font-semibold">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 leading-relaxed font-medium pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Support Sidebar */}
            <div className="space-y-6">
              <Card className="glass border-slate-800/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <span>Need Help?</span>
                  </h3>

                  <div className="space-y-4">
                    {supportFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className={`glass-card p-4 rounded-xl border border-${feature.color}-500/20 hover:border-${feature.color}-500/40 transition-all duration-300`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${
                              feature.color === "emerald"
                                ? "gradient-primary"
                                : feature.color === "teal"
                                  ? "gradient-secondary"
                                  : "gradient-accent"
                            } flex items-center justify-center`}
                          >
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                            <p className="text-sm text-slate-400 mb-2">{feature.description}</p>
                            <div className="flex items-center space-x-1 text-xs">
                              <Clock className={`w-3 h-3 text-${feature.color}-400`} />
                              <span className={`text-${feature.color}-400 font-medium`}>{feature.availability}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 gradient-primary shadow-glow-emerald text-white font-semibold">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card className="glass border-slate-800/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Why Choose Us</h3>
                  <div className="space-y-3">
                    {[
                      "Regulated & Licensed",
                      "24/7 Professional Support",
                      "Instant Payouts",
                      "No Hidden Fees",
                      "Advanced Risk Management",
                      "Institutional Infrastructure",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass rounded-2xl p-8 border border-slate-800/30 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-white">Still Have Questions?</h3>
            <p className="text-slate-400 mb-6 font-light">
              Our expert team is here to help you succeed. Get personalized answers to your trading questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gradient-primary shadow-glow-emerald text-white font-semibold px-8 py-3">
                Schedule a Call
              </Button>
              <Button
                variant="outline"
                className="glass-card border-slate-600/50 text-slate-300 hover:bg-slate-800/50 font-semibold bg-transparent"
              >
                Browse Help Center
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
