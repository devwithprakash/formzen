"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";

const publicForms = [
  {
    id: "form-1",
    title: "SaaS Product Feedback Survey",
    description: "Gather deep UX and feature insights from early-stage platform adapters.",
    category: "Feedback",
    submissions: 1420,
    views: 4800,
    author: "Alex Rivers",
    authorImage: "A",
    isTrending: true,
  },
  {
    id: "form-2",
    title: "Developer Conference 2026 Registration",
    description:
      "Standard ticket pass reservation matrix with custom workshop preference arrays. Form optimized for global developer tracking systems.",
    category: "Events",
    submissions: 840,
    views: 2100,
    author: "DevCon Team",
    authorImage: "D",
    isTrending: true,
  },
  {
    id: "form-3",
    title: "Remote Work Culture Assessment",
    description:
      "Internal pulse check exploring utility metrics, operational strain, and async workflows.",
    category: "HR & Culture",
    submissions: 310,
    views: 920,
    author: "Talent Ops",
    authorImage: "T",
    isTrending: false,
  },
  {
    id: "form-4",
    title: "AI Product Waitlist",
    description:
      "High-conversion landing sequence engineered to collect developer intent profiles.",
    category: "Marketing",
    submissions: 3410,
    views: 9800,
    author: "Neural Labs",
    authorImage: "N",
    isTrending: true,
  },
  {
    id: "form-5",
    title: "Design System UI Evaluation",
    description:
      "Heuristic component-tier review form for front-end engineers and UI architects. Quick 5-minute telemetry layout.",
    category: "Feedback",
    submissions: 190,
    views: 540,
    author: "Sarah Chen",
    authorImage: "S",
    isTrending: false,
  },
  {
    id: "form-6",
    title: "Weekly Fitness & Hydration Log",
    description: "Clean tracking sequence for bio-metric analysis and macro calculation goals.",
    category: "Personal Study",
    submissions: 520,
    views: 1100,
    author: "FitMetrics",
    authorImage: "F",
    isTrending: false,
  },
];

const categories = ["All", "Feedback", "Events", "Marketing", "HR & Culture", "Personal Study"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredForms = publicForms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
<>
<Navbar/>
    <div className="min-h-screen hide-scrollbar scrollbar-none bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
        {/* Page Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-3">
              <Sparkles className="h-3 w-3" />
              Community Hub
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Explore Public Forms
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm sm:text-base">
              Discover, inspect, and submit high-performance forms built by the FormZen global
              developer community.
            </p>
          </div>

          {/* Quick Statistics Badge */}
          <div className="flex gap-6 bg-secondary/20 border border-border/40 p-4 rounded-2xl md:min-w-[260px] shrink-0 h-20 items-center">
            <div>
              <div className="text-2xl font-semibold text-foreground font-serif">6,840</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
                Live Directories
              </div>
            </div>
            <div className="border-l border-border/40 pl-6">
              <div className="text-2xl font-semibold text-primary font-serif">142K</div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
                Total Submissions
              </div>
            </div>
          </div>
        </div>

        {/* Input Controls Container */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full">
          {/* Search Bar */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search templates, use-cases, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-card rounded-xl pl-10 pr-4 border border-border/60 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/5 transition-all placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Category Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar lg:pb-0 scrollbar-none shrink-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 h-11 text-xs font-medium rounded-xl border whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid Matrix View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-stretch">
          <AnimatePresence mode="popLayout">
            {filteredForms.map((form) => (
              <motion.div
                key={form.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -2 }}
                className="group flex flex-col justify-between bg-card rounded-2xl border border-border/50 p-5 hover:border-border/80 hover:shadow-md transition-all overflow-hidden h-full transform-gpu"
              >
                {/* Content Area */}
                <div className="flex flex-col flex-1">
                  {/* Metadata Header */}
                  <div className="flex items-center justify-between mb-4 h-6 shrink-0">
                    <span className="text-[10px] font-semibold bg-secondary px-2.5 py-1 rounded-md text-muted-foreground uppercase tracking-wider">
                      {form.category}
                    </span>

                    {form.isTrending && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 h-7 truncate">
                    {form.title}
                  </h3>

                  {/* Description Box */}
                  <div className="mt-2 mb-6 flex-1">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[54px]">
                      {form.description}
                    </p>
                  </div>
                </div>

                {/* Card Analytics/Action Footer */}
                <div className="pt-4 border-t border-border/30 shrink-0">
                  <div className="flex items-center justify-between mb-4 text-[11px] text-muted-foreground h-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FileSpreadsheet className="h-3.5 w-3.5 text-muted-foreground/70" />
                        <strong>{form.submissions.toLocaleString()}</strong> entries
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                        {form.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-3 pt-1 h-8">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {form.authorImage}
                      </div>
                      <span className="text-[11px] font-medium text-foreground truncate max-w-[100px]">
                        {form.author}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="rounded-xl text-xs gap-1 bg-secondary text-foreground border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all px-3.5 h-8 font-medium shrink-0"
                      onClick={() => alert(`Redirecting to live production instance: ${form.id}`)}
                    >
                      Fill Form
                      <ArrowUpRight className="h-3 w-3 opacity-60" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State Fallback */}
        {filteredForms.length === 0 && (
          <div className="text-center py-20 bg-card/40 rounded-3xl border border-dashed border-border/60 max-w-md mx-auto">
            <div className="h-10 w-10 bg-secondary rounded-xl flex items-center justify-center mx-auto text-muted-foreground mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <h4 className="font-serif text-base font-semibold text-foreground">
              No matching forms detected
            </h4>
            <p className="text-xs text-muted-foreground mt-1 px-6">
              We couldn't track down any public forms matching your parameters. Redefine your search
              parameters or check filters.
            </p>
          </div>
        )}
      </div>
    </div>
</>
  );
}
