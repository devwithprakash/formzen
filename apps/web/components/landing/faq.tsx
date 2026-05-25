"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How does the free plan work?",
    answer: "Our free plan lets you create up to 3 forms with 100 responses per month. It includes basic analytics and email notifications. No credit card required to get started.",
  },
  {
    question: "Can I upgrade or downgrade at any time?",
    answer: "Absolutely. You can change your plan whenever you need. Upgrades take effect immediately, and downgrades apply at the end of your billing cycle. We prorate any differences.",
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. All data is encrypted at rest and in transit using AES-256 encryption. We are SOC 2 Type II certified, GDPR compliant, and never sell your data.",
  },
  {
    question: "What integrations do you support?",
    answer: "FormZen integrates with 50+ tools including Slack, Google Sheets, Airtable, Notion, Zapier, and more. Pro and Enterprise plans have access to our full API for custom integrations.",
  },
  {
    question: "Can I customize the look of my forms?",
    answer: "Yes! Free users can choose from our beautiful templates. Pro users get full custom branding including colors, fonts, logos, and custom CSS. Make forms that match your brand perfectly.",
  },
  {
    question: "Do you offer support?",
    answer: "All plans include email support with responses within 24 hours. Pro users get priority support with faster response times. Enterprise customers receive dedicated account management.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-medium">FAQ</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3 text-balance">
            Common questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about FormZen.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
