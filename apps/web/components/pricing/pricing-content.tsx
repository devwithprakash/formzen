"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Up to 3 forms",
      "100 responses/month",
      "Basic analytics",
      "Email notifications",
      "FormZen branding",
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
      "Unlimited forms",
      "10,000 responses/month",
      "Advanced analytics",
      "Remove branding",
      "Custom branding",
      "File uploads (5GB)",
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
      "Unlimited responses",
      "White-label solution",
      "Custom integrations",
      "Dedicated manager",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

export function PricingContent() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <section className="text-center py-16">
        <h1 className="font-serif text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 text-muted-foreground">Start free and scale as you grow.</p>

        <div className="flex items-center justify-center gap-4 mt-10">
          <span className={!isYearly ? "text-foreground" : "text-muted-foreground"}>Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={isYearly ? "text-foreground" : "text-muted-foreground"}>
            Yearly{" "}
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-6 grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-8 rounded-2xl border ${plan.highlighted ? "bg-primary text-primary-foreground" : "bg-card"}`}
          >
            <h3 className="text-xl font-serif">{plan.name}</h3>
            <div className="my-6 text-4xl font-serif">
              {plan.monthlyPrice !== null
                ? `$${isYearly ? plan.yearlyPrice : plan.monthlyPrice}`
                : "Custom"}
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4" /> {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full rounded-full"
              variant={plan.highlighted ? "secondary" : "default"}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </section>
    </div>
  );
}
