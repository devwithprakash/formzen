import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { PricingContent } from "@/components/pricing/pricing-content"

export const metadata = {
  title: "Pricing — FormZen",
  description: "Simple, transparent pricing. Start free and scale as you grow.",
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PricingContent />
      <Footer />
    </main>
  )
}
