"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Type, 
  Mail, 
  ListChecks, 
  Calendar, 
  Star, 
  Upload,
  ToggleLeft,
  GripVertical,
  Trash2,
  SlidersHorizontal,
  AlignLeft
} from "lucide-react"

const formElements = [
  { type: "text", icon: Type, label: "Short Text", desc: "Single line input field" },
  { type: "longtext", icon: AlignLeft, label: "Long Text", desc: "Multi-line text area" },
  { type: "email", icon: Mail, label: "Email Address", desc: "Valid email string verification" },
  { type: "select", icon: ListChecks, label: "Multiple Choice", desc: "Drop-down options array" },
  { type: "date", icon: Calendar, label: "Date Picker", desc: "Calendar selector interface" },
  { type: "rating", icon: Star, label: "Star Rating", desc: "Numerical star assessment tier" },
  { type: "file", icon: Upload, label: "File Upload", desc: "Document or image upload slot" },
  { type: "toggle", icon: ToggleLeft, label: "Toggle Switch", desc: "Boolean true/false operation" },
]

export function ProductShowcase() {
  const [selectedField, setSelectedField] = useState<string | null>("field-1")

  return (
    <section id="product" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-medium tracking-wider uppercase">Product Showcase</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mt-3 tracking-tight">
            A form builder that sparks joy
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Intuitive interface, powerful features. Create forms that people actually want to fill out.
          </p>
        </motion.div>

        {/* App Environment Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-3xl bg-card border border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
            
            {/* Browser Window Bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/40 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/40" />
                <div className="h-3 w-3 rounded-full bg-amber-400/40" />
                <div className="h-3 w-3 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-5 py-0.5 rounded-full bg-background border border-border/30 text-[11px] text-muted-foreground tracking-wide max-w-xs sm:max-w-none truncate">
                  app.formzen.io/forms/abc/edit
                </div>
              </div>
            </div>

            {/* Application Grid Framework - Height Locked on Desktop for absolute UI consistency */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/50 bg-secondary/10 lg:h-[520px]">
              
              {/* 1. LEFT SIDEBAR: Add Fields Panel */}
              <div className="lg:col-span-3 bg-card p-4 flex flex-col justify-between h-[320px] lg:h-full">
                <div className="space-y-3 overflow-hidden flex flex-col h-full">
                  <div className="border-b border-border/40 pb-2.5 shrink-0">
                    <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Fields</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Click elements into the layout.</p>
                  </div>

                  {/* Handles internal custom scrolling beautifully without stretching parent wrappers */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none">
                    {formElements.map((element) => {
                      const Icon = element.icon
                      return (
                        <div
                          key={element.type}
                          className="flex items-center gap-2 p-2 rounded-xl border border-border/40 bg-secondary/10 hover:border-primary/40 hover:bg-secondary/40 transition-all group cursor-pointer"
                        >
                          <div className="h-7 w-7 rounded-lg bg-card border border-border/40 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">{element.label}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Micro Sync Badge hidden on mobile for clean landscape tracking */}
                <div className="hidden lg:flex pt-4 border-t border-border/40 items-center justify-between text-[11px] text-muted-foreground shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Engine Sync</span>
                  </div>
                  <span className="font-mono text-[10px]">v1.0.4</span>
                </div>
              </div>

              {/* 2. CENTER CANVAS: Live Form View */}
              <div className="lg:col-span-6 p-4 lg:p-6 space-y-4 overflow-y-auto lg:h-full">
                {/* Form Header Layer */}
                <div className="bg-card rounded-xl border border-border/40 p-4 relative overflow-hidden shadow-sm shrink-0">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground truncate">Customer Feedback Survey</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">Please fill out this form to improve performance metrics.</p>
                    </div>
                    <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Live Draft
                    </span>
                  </div>
                </div>

                {/* Form Elements Stream Area */}
                <div className="space-y-2.5">
                  
                  {/* Form Field 1 */}
                  <div 
                    onClick={() => setSelectedField("field-1")}
                    className={`group relative bg-card rounded-xl p-3.5 border-2 transition-all cursor-pointer ${
                      selectedField === "field-1" ? "border-primary shadow-sm" : "border-transparent hover:border-border"
                    }`}
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="ml-5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Type className="h-3.5 w-3.5 text-primary" />
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <div className="h-9 rounded-lg bg-secondary/30 border border-border/40 mt-1.5" />
                    </div>
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                    </div>
                  </div>

                  {/* Form Field 2 */}
                  <div 
                    onClick={() => setSelectedField("field-2")}
                    className={`group relative bg-card rounded-xl p-3.5 border-2 transition-all cursor-pointer ${
                      selectedField === "field-2" ? "border-primary shadow-sm" : "border-transparent hover:border-border"
                    }`}
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="ml-5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        Email Address <span className="text-destructive">*</span>
                      </label>
                      <div className="h-9 rounded-lg bg-secondary/30 border border-border/40 mt-1.5" />
                    </div>
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                    </div>
                  </div>

                  {/* Form Field 3 */}
                  <div 
                    onClick={() => setSelectedField("field-3")}
                    className={`group relative bg-card rounded-xl p-3.5 border-2 transition-all cursor-pointer ${
                      selectedField === "field-3" ? "border-primary shadow-sm" : "border-transparent hover:border-border"
                    }`}
                  >
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="ml-5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-primary" />
                        How satisfied are you with our service?
                      </label>
                      <div className="flex gap-1.5 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= 4 ? "fill-primary text-primary" : "text-border"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. RIGHT SIDEBAR: Field Info Settings Panel */}
              <div className="lg:col-span-3 bg-card p-4 overflow-y-auto lg:h-full flex flex-col justify-start space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3 shrink-0">
                  <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    Field Info
                  </h4>
                </div>

                <div className="space-y-3.5 flex-1 overflow-y-auto lg:overflow-visible pr-0.5">
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Field Label</label>
                    <div className="h-9 rounded-lg border border-border/60 bg-secondary/20 px-3 flex items-center mt-1 text-xs font-medium text-foreground truncate">
                      {selectedField === "field-1" ? "Full Name" : selectedField === "field-2" ? "Email Address" : "Service Rating"}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground">Placeholder Text</label>
                    <div className="h-9 rounded-lg border border-border/60 bg-secondary/20 px-3 flex items-center mt-1 text-xs text-muted-foreground italic truncate">
                      {selectedField === "field-1" ? "Enter your name..." : selectedField === "field-2" ? "you@example.com" : "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-border/30">
                    <span className="text-[11px] font-medium text-muted-foreground">Required Asset</span>
                    <div className="h-5 w-9 rounded-full bg-primary relative cursor-pointer shrink-0">
                      <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Global Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-card border-t border-border/50 shrink-0">
              <span className="text-xs text-muted-foreground text-center sm:text-left">Changes automatically synchronized to cloud storage.</span>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-secondary border border-border/40 transition-colors">
                  Preview
                </button>
                <button className="flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors">
                  Publish
                </button>
              </div>
            </div>

          </div>

          {/* Ambient Glow */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-3xl rounded-full -z-10" />
        </motion.div>
      </div>
    </section>
  )
}