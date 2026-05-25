"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    content: "FormZen has completely changed how we collect customer feedback. The forms are beautiful and the response rate increased by 40%.",
    author: "Sarah Chen",
    role: "Head of Product",
    company: "Bloom",
    rating: 5,
  },
  {
    content: "Finally, a form builder that doesn&apos;t make me cringe. Our surveys look professional and our customers actually complete them.",
    author: "Marcus Johnson",
    role: "Founder & CEO",
    company: "Mindful Labs",
    rating: 5,
  },
  {
    content: "The analytics dashboard alone is worth it. We can see exactly where people drop off and optimize our forms accordingly.",
    author: "Emily Tanaka",
    role: "Growth Lead",
    company: "Craft Studio",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
           <span className="text-sm text-primary font-medium tracking-wider uppercase">Testimonials</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3 text-balance">
            Loved by teams everywhere
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams who have transformed their data collection with FormZen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-serif text-primary">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
