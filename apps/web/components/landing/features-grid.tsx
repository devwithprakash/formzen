"use client"

import { motion } from "framer-motion"
import { 
  Layers, 
  Zap, 
  BarChart3, 
  Palette, 
  Share2, 
  Shield 
} from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Smart Logic",
    description: "Create dynamic forms with complex conditional logic and branching parameters.",
    className: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description: "Track submission rates, form drops, and user field behavior with custom real-time metrics.",
    className: "col-span-1",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Distribute instantly via raw links, embedded iframes, or automated QR codes.",
    className: "col-span-1",
  },
  {
    icon: Layers,
    title: "Drag & Drop Builder",
    description: "Build beautiful layouts with our intuitive visual editor. No coding required—just drag, drop, and launch.",
    className: "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-card to-primary/5",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    description: "Match your identity perfectly with design themes and typography overrides.",
    className: "md:col-span-1 lg:col-span-1",
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-medium tracking-wider uppercase">Features</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3 tracking-tight">
            Everything you need to build amazing forms
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Powerful features wrapped in a beautiful, intuitive interface.
          </p>
        </motion.div>

        {/* New Staggered Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`
                  group bg-card rounded-2xl p-6 border border-border/50 
                  hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 
                  transition-all duration-300 flex flex-col justify-between
                  ${feature.className || ""}
                `}
              >
                <div>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-sans font-semibold text-base text-foreground mb-1.5 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}