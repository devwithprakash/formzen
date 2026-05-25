"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: "Up to 3 forms", included: true },
      { name: "100 responses/month", included: true },
      { name: "Basic analytics", included: true },
      { name: "Email notifications", included: true },
      { name: "FormZen branding", included: true, tooltip: "Your forms will display 'Powered by FormZen'" },
      { name: "Custom branding", included: false },
      { name: "File uploads", included: false },
      { name: "Conditional logic", included: false },
      { name: "Integrations", included: false },
      { name: "Priority support", included: false },
    ],
    highlighted: false,
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    description: "For growing teams",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      { name: "Unlimited forms", included: true },
      { name: "10,000 responses/month", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Email notifications", included: true },
      { name: "Remove FormZen branding", included: true },
      { name: "Custom branding", included: true, tooltip: "Add your logo, colors, and custom domain" },
      { name: "File uploads (5GB)", included: true },
      { name: "Conditional logic", included: true },
      { name: "50+ integrations", included: true },
      { name: "Priority support", included: true },
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      { name: "Unlimited everything", included: true },
      { name: "Unlimited responses", included: true },
      { name: "Custom analytics", included: true },
      { name: "Advanced notifications", included: true },
      { name: "White-label solution", included: true },
      { name: "Full custom branding", included: true },
      { name: "Unlimited file storage", included: true },
      { name: "Advanced logic & workflows", included: true },
      { name: "Custom integrations + API", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
]

const comparisonFeatures = [
  {
    category: "Forms & Responses",
    features: [
      { name: "Number of forms", free: "3", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "Responses per month", free: "100", pro: "10,000", enterprise: "Unlimited" },
      { name: "Form fields", free: "10 per form", pro: "Unlimited", enterprise: "Unlimited" },
      { name: "File uploads", free: false, pro: "5GB total", enterprise: "Unlimited" },
    ],
  },
  {
    category: "Customization",
    features: [
      { name: "Templates", free: "5 basic", pro: "50+ premium", enterprise: "Custom" },
      { name: "Custom branding", free: false, pro: true, enterprise: true },
      { name: "Custom domain", free: false, pro: true, enterprise: true },
      { name: "Remove branding", free: false, pro: true, enterprise: true },
      { name: "Custom CSS", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Logic & Automation",
    features: [
      { name: "Conditional logic", free: false, pro: true, enterprise: true },
      { name: "Calculator fields", free: false, pro: true, enterprise: true },
      { name: "Webhooks", free: false, pro: true, enterprise: true },
      { name: "Custom workflows", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "Analytics & Reporting",
    features: [
      { name: "Basic analytics", free: true, pro: true, enterprise: true },
      { name: "Advanced analytics", free: false, pro: true, enterprise: true },
      { name: "Export data", free: "CSV", pro: "CSV, Excel, JSON", enterprise: "All formats + API" },
      { name: "Custom reports", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "Support & Security",
    features: [
      { name: "Email support", free: true, pro: true, enterprise: true },
      { name: "Priority support", free: false, pro: true, enterprise: true },
      { name: "SSO / SAML", free: false, pro: false, enterprise: true },
      { name: "SLA guarantee", free: false, pro: false, enterprise: true },
    ],
  },
]

export function PricingContent() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground text-balance">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className={`text-sm ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className={`font-serif text-4xl ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        /month
                      </span>
                      {isYearly && plan.monthlyPrice > 0 && (
                        <p className={`text-xs mt-1 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          Billed annually (${plan.yearlyPrice * 12}/year)
                        </p>
                      )}
                    </>
                  ) : (
                    <span className={`font-serif text-4xl ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                      Custom
                    </span>
                  )}
                </div>

                <TooltipProvider>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? plan.highlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                            : "bg-muted"
                        }`}>
                          {feature.included ? (
                            <Check className={`h-3 w-3 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <span className={`text-sm flex items-center gap-1 ${
                          feature.included
                            ? plan.highlighted ? "text-primary-foreground/90" : "text-foreground"
                            : "text-muted-foreground line-through"
                        }`}>
                          {feature.name}
                          {feature.tooltip && (
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-[200px]">{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TooltipProvider>

                <Link href={plan.cta === "Contact Sales" ? "#" : "/dashboard"}>
                  <Button
                    className={`w-full rounded-full ${
                      plan.highlighted
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
              Compare plans in detail
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about each plan.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-medium text-foreground">Features</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Free</th>
                  <th className="text-center py-4 px-4 font-medium text-primary">Pro</th>
                  <th className="text-center py-4 px-4 font-medium text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category) => (
                  <>
                    <tr key={category.category} className="bg-secondary/50">
                      <td colSpan={4} className="py-3 px-4 font-medium text-foreground text-sm">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-border/50">
                        <td className="py-3 px-4 text-sm text-muted-foreground">{feature.name}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.free === "boolean" ? (
                            feature.free ? (
                              <Check className="h-4 w-4 text-primary mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{feature.free}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center bg-primary/5">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                              <Check className="h-4 w-4 text-primary mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-foreground">{feature.pro}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.enterprise === "boolean" ? (
                            feature.enterprise ? (
                              <Check className="h-4 w-4 text-primary mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground text-balance">
              Ready to build beautiful forms?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join 10,000+ teams who trust FormZen for their form needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full border-border hover:bg-secondary/50 px-8">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
