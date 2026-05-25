"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Settings,
  Eye,
  Globe,
  Lock,
  Palette,
  Sparkles,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Available visual configuration styles
const visualThemes = [
  {
    id: "minimal-light",
    name: "Minimal Light",
    bg: "bg-white border-slate-200",
    primary: "bg-slate-900",
    text: "text-slate-800",
    description: "Clean, default high-contrast layout",
  },
  {
    id: "sleek-dark",
    name: "Sleek Dark",
    bg: "bg-zinc-900 border-zinc-800 dark",
    primary: "bg-indigo-500",
    text: "text-zinc-100",
    description: "Deep workspace style with subtle highlights",
  },
  {
    id: "soft-lavender",
    name: "SaaS Lavender",
    bg: "bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 border-indigo-100/50",
    primary: "bg-violet-600",
    text: "text-indigo-950",
    description: "Modern soft purple developer aesthetic",
  },
  {
    id: "retro-monochrome",
    name: "Tech Explainer",
    bg: "bg-[#fcfbf7] border-neutral-900 [background-image:linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] [background-size:20px_20px]",
    primary: "bg-neutral-900",
    text: "text-neutral-900",
    description: "Flat technical style grid background layout",
  },
];

export default function FormSettingsPage() {
  const params = useParams();
  const router = useRouter();

  // Simulated initial form payload
  const [formName, setFormName] = useState("Customer Feedback Survey");
  const [formDescription, setFormDescription] = useState(
    "Help us improve our developer tooling platform experience.",
  );
  const [isPublished, setIsPublished] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("soft-lavender");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API persistence
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/forms">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 border border-border/40 bg-card"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
              <Settings className="h-3 w-3" />
              <span>Form Management</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-foreground mt-0.5">
              Form Settings
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-card border-border/50">
            <Eye className="h-4 w-4" />
            <span>Preview Form</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground"
            onClick={handleSaveChanges}
            disabled={isSaving || !formName}
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns - Settings Panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Metadata Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/50 rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-serif text-lg text-foreground mb-4">Identity Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm text-foreground">
                  Form Title
                </Label>
                <Input
                  id="title"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter form title..."
                  className="mt-1.5 bg-background border-border/60 focus-visible:ring-primary"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sm text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide context or instructions for your respondents..."
                  className="mt-1.5 bg-background border-border/60 focus-visible:ring-primary resize-none"
                  rows={4}
                />
              </div>
            </div>
          </motion.div>

          {/* Theme Selector Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border/50 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Visual Theme Configuration</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Choose how this form skin appears to public visitors.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {visualThemes.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer text-left transition-all hover:shadow-md flex flex-col justify-between h-36 bg-card",
                    selectedTheme === theme.id
                      ? "border-primary ring-2 ring-primary/20 bg-secondary/20"
                      : "border-border/60 hover:border-border",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{theme.name}</span>
                      {selectedTheme === theme.id && (
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Miniature abstract representation preview */}
                  <div
                    className={cn(
                      "h-10 w-full rounded-lg border p-1.5 flex items-center gap-1.5 mt-3",
                      theme.bg,
                    )}
                  >
                    <div className={cn("h-4 w-12 rounded-sm opacity-80", theme.primary)} />
                    <div className="h-2 w-full space-y-1">
                      <div className={cn("h-1 rounded-full w-4/5", theme.primary, "opacity-30")} />
                      <div className={cn("h-1 rounded-full w-1/2", theme.primary, "opacity-20")} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Danger Zone Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-destructive/20 bg-destructive/5 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-4 w-4" />
              <h3 className="font-serif text-lg">Danger Zone</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Once you remove this form layer, all associated visual metadata structures and
              respondent tables will be permanently deleted.
            </p>
            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90 gap-2 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete this form completely</span>
            </Button>
          </motion.div>
        </div>

        {/* Right Column - Visibility Controls Side Panel */}
        <div className="space-y-6">
          {/* Status Matrix Card */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border/50 rounded-xl p-5 shadow-sm space-y-5"
          >
            <div>
              <h4 className="font-medium text-sm text-foreground">Form Publication Status</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Control live submission window states.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.0 rounded-xl bg-secondary/40 border border-border/40 p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                    isPublished
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-200 dark:bg-neutral-800 text-muted-foreground",
                  )}
                >
                  {isPublished ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isPublished ? "Active & Published" : "Draft / Private"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isPublished ? "Accepting live responses" : "Form is closed"}
                  </p>
                </div>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <div className="text-xs space-y-2 text-muted-foreground border-t border-border/40 pt-4 px-1">
              <div className="flex justify-between">
                <span>Unique Access String:</span>
                <span className="font-mono text-foreground select-all bg-secondary px-1.5 py-0.5 rounded">
                  {params.id ? params.id.slice(0, 8) : "form-id"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>API Submission Endpoint:</span>
                <span className="text-primary hover:underline cursor-pointer">View Docs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
