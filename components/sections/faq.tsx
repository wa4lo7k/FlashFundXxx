"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    q: "What learning objectives must be achieved during the Skill Assessment Phase?",
    a: [
      "Required performance target: 8% portfolio growth demonstration",
      "Risk management limit: 5% maximum daily loss in simulation",
      "Total risk threshold: 10% maximum drawdown in training account",
      "No minimum trading day requirements for skill demonstration"
    ],
  },
  {
    q: "Which trading strategies are permitted during skill evaluation?",
    a: [
      "Economic news event trading: Fully permitted in simulation",
      "Position holding overnight: Allowed without restrictions in training",
      "Weekend position maintenance: Forbidden – educational focus on weekday markets",
      "Algorithmic trading strategies: Permitted during evaluation period",
      "Required position hold time: Minimum 2-minute duration for educational purposes"
    ],
  },
  {
    q: "How does the single trade performance limitation work in training?",
    a: [
      "Individual trade performance cap: 35% of total portfolio gains",
      "Consecutive trades within 2 minutes: Treated as single learning exercise",
      "Maximum daily performance from one trade: 35% of total training profits",
      "Educational consequences: Performance adjustments for learning purposes"
    ],
  },
  {
    q: "What are the position sizing consistency requirements for skill development?",
    a: [
      "Average position calculation: Total volume ÷ Number of trades",
      "Minimum position size: 25% of calculated average (Average × 0.25)",
      "Maximum position size: 200% of calculated average (Average × 2.00)",
      "Practical example: 2.0 lot average allows 0.5 to 4.0 lot range",
      "Non-compliant trades: Excluded from skill assessment calculations",
      "Position grouping: Trades within 2-minute intervals count as one learning exercise"
    ],
  },
  {
    q: "What limitations apply to advanced skill development programs?",
    a: [
      "Automated trading systems: Completely forbidden in live simulation accounts",
      "Position hedging: Permitted within same training account only, no cross-account hedging",
      "Weekend position holding: Absolutely prohibited (immediate skill assessment failure)",
      "Maximum trading layers: Limited to 2 concurrent layers for educational purposes",
      "Martingale trading approach: Strictly forbidden in skill development",
      "Position duration requirement: 2-minute minimum holding period for learning"
    ],
  },
  {
    q: "How does the performance reward and recognition system work?",
    a: [
      "Student reward retention: Between 50% and 90% of generated training profits",
      "Recognition processing schedule: Every two weeks",
      "Reward calculation: Based on individual skill development metrics and program terms",
      "Position sizing compliance: Must maintain consistency for reward eligibility",
      "Rule adherence requirement: All training guidelines must be followed for rewards"
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
