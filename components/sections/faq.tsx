"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    q: "What objectives must be met during the Challenge Phase?",
    a: [
      "Required profit achievement: 8% of account balance",
      "Maximum daily loss limit: 5% of account value",
      "Total account drawdown threshold: 10% maximum",
      "No minimum trading day requirements"
    ],
  },
  {
    q: "Which trading activities are permitted during evaluation?",
    a: [
      "Economic news event trading: Fully permitted",
      "Position holding overnight: Allowed without restrictions",
      "Weekend position maintenance: Forbidden – positions must close before Friday market end",
      "High-frequency trading algorithms: Permitted during evaluation period",
      "Required position hold time: Minimum 2-minute duration before closure"
    ],
  },
  {
    q: "How does the single trade profit limitation work?",
    a: [
      "Individual trade profit cap: 35% of total account gains",
      "Consecutive trades within 2 minutes: Treated as single position",
      "Maximum daily earnings from one trade: 35% of total profits",
      "Violation consequences: Potential profit adjustments or reductions"
    ],
  },
  {
    q: "What are the position sizing consistency requirements?",
    a: [
      "Average position calculation: Total volume ÷ Number of trades",
      "Minimum position size: 25% of calculated average (Average × 0.25)",
      "Maximum position size: 200% of calculated average (Average × 2.00)",
      "Practical example: 2.0 lot average allows 0.5 to 4.0 lot range",
      "Non-compliant trades: Excluded from payout calculations",
      "Position grouping: Trades within 2-minute intervals count as one"
    ],
  },
  {
    q: "What limitations apply to funded account trading?",
    a: [
      "Automated trading systems: Completely forbidden on live accounts",
      "Position hedging: Permitted within same account only, no cross-account hedging",
      "Weekend position holding: Absolutely prohibited (immediate breach)",
      "Maximum trading layers: Limited to 2 concurrent layers",
      "Martingale trading approach: Strictly forbidden",
      "Position duration requirement: 2-minute minimum holding period"
    ],
  },
  {
    q: "How does the profit sharing and withdrawal system work?",
    a: [
      "Trader profit retention: Between 50% and 90% of generated profits",
      "Payout processing schedule: Every two weeks",
      "Distribution calculation: Based on individual performance metrics and contract terms",
      "Position sizing compliance: Must maintain consistency for withdrawal eligibility",
      "Rule adherence requirement: All trading guidelines must be followed for payouts"
    ],
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="relative">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950" />

      <div className="container mx-auto px-6 py-16 relative z-10">
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

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass border-slate-800/30 rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left hover:text-emerald-400 transition-colors font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed font-medium pb-4">
                  <ul className="space-y-2 mt-2">
                    {faq.a.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-400 mr-3 mt-1 text-sm">•</span>
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
