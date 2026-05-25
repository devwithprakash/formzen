"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "/month",
    features: [
      "Up to 3 forms",
      "100 responses/month",
      "Basic analytics",
      "Email notifications",
      "FormZen branding",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For growing teams",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited forms",
      "10,000 responses/month",
      "Advanced analytics",
      "Custom branding",
      "File uploads",
      "Priority support",
      "Integrations",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    period: "",
    features: [
      "Unlimited everything",
      "Custom integrations",
      "SSO & SAML",
      "Dedicated support",
      "SLA guarantee",
      "Custom contracts",
      "On-premise option",
    ],
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
           <span className="text-sm text-primary font-medium tracking-wider uppercase">Pricing</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3 text-balance">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`
                relative rounded-2xl p-6 lg:p-8 border transition-all duration-300
                ${plan.highlighted 
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105" 
                  : "bg-card border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                }
              `}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-secondary text-secondary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-serif text-xl ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mt-1 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`font-serif text-4xl ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      plan.highlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                    }`}>
                      <Check className={`h-3 w-3 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.price === "Custom" ? "#" : "/dashboard"}>
                <Button
                  className={`w-full rounded-full ${
                    plan.highlighted
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {plan.price === "Custom" ? "Contact Sales" : plan.price === "$0" ? "Get Started Free" : "Start Free Trial"}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
