import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { ProductShowcase } from "@/components/landing/product-showcase";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <ProductShowcase />
        <FeaturesGrid />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
