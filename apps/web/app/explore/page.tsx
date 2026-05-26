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
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { useGetAllPublicForms } from "@/hooks/form/use-forms";

const categories = ["All", "Feedback", "Events", "Marketing", "HR & Culture", "Personal Study"];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: publicForms, error, isLoading } = useGetAllPublicForms();

  const filteredForms = (publicForms ?? []).filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesCategory = selectedCategory === "All";
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-3">
                <Sparkles className="h-3 w-3" /> Community Hub
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Explore Public Forms
              </h1>
            </div>
          </div>

          {/* Search/Filter Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-card rounded-xl pl-10 pr-4 border border-border/60 text-sm focus:border-primary/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredForms.map((form) => (
                <motion.div
                  key={form.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group flex flex-col bg-card rounded-2xl border border-border/50 p-5 hover:border-primary/50 transition-all h-full"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold bg-secondary px-2 py-1 rounded-md uppercase tracking-wider text-muted-foreground">
                        {form.theme} theme
                      </span>
                      {form.isPublished && (
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                          Live
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-semibold mb-2 truncate">{form.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                      {form.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/30 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs h-8"
                      onClick={() => window.open(`/forms/${form.slug}`, "_blank")}
                    >
                      View <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}