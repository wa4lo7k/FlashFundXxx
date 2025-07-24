import Header from "@/components/sections/header"
import Hero from "@/components/sections/hero"
import HowItWorks from "@/components/sections/how-it-works"
import WhyChooseUs from "@/components/sections/why-choose-us"
import Pricing from "@/components/sections/pricing"
import Testimonials from "@/components/sections/testimonials"
import FAQ from "@/components/sections/faq"
import Footer from "@/components/sections/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* LiveTicker removed - updated */}
      {/* Professional Background System */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Subtle accent gradients */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-emerald-950/10 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-teal-950/10 to-transparent" />

        {/* Professional grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <Header />
      <Hero />
      <HowItWorks />
      <WhyChooseUs />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}
