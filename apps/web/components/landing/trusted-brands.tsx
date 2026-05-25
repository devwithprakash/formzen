"use client"

import { motion } from "framer-motion"

const brands = [
  { name: "Notion", logo: "N" },
  { name: "Linear", logo: "L" },
  { name: "Vercel", logo: "▲" },
  { name: "Stripe", logo: "S" },
  { name: "Figma", logo: "F" },
  { name: "Slack", logo: "S" },
]

export function TrustedBrands() {
  return (
    <section className="py-16 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by 10,000+ teams at industry-leading companies
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <span className="text-2xl font-serif">{brand.logo}</span>
                <span className="text-lg font-medium">{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
