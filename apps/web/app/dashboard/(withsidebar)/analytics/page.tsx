"use client";

import dynamic from "next/dynamic";
import {
  Users,
  Calendar,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalAnalytics } from "@/hooks/analytics/use-analytics";
import { useAuth } from "@clerk/nextjs";

// Lazy-loaded analytics charts mapping live global dashboard tracking trends
const AnalyticsCharts = dynamic(
  () => import("../../../../components/dashboard/analytics-charts").then((mod) => mod.AnalyticsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid lg:grid-cols-2 gap-6 animate-pulse">
        <div className="h-[380px] bg-card/50 border border-border/40 rounded-xl" />
        <div className="h-[380px] bg-card/50 border border-border/40 rounded-xl" />
      </div>
    ),
  },
);

export default function AnalyticsPage() {
  const { userId } = useAuth();

  // Pass extracted userId context into your custom analytics state hook wrapper
  const { data, error, isLoading } = useGlobalAnalytics();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground animate-in fade-in">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-sm font-medium">Aggregating workspace telemetry charts...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl text-destructive text-sm flex items-center gap-3 max-w-xl mx-auto mt-12 animate-in slide-in-from-top-4">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <h5 className="font-semibold">Failed to load global metrics</h5>
          <p className="text-xs opacity-90 mt-0.5">
            Please verify database connections or confirm your current session credentials.
          </p>
        </div>
      </div>
    );
  }

  const { cards, charts } = data;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Workspace Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Cross-form historical insights and telemetry maps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[140px] bg-card border-border/50">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Global Metrics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Responses */}
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
              <ArrowUpRight className="h-3 w-3" /> Live
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
            {cards.totalResponses.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Submissions</p>
        </div>

        {/* Card 2: Total Created Forms */}
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
            {cards.totalForms.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Created Forms</p>
        </div>

        {/* Card 3: Total Published Forms */}
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:border-border transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
            {cards.totalPublishedForms.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active Public Forms</p>
        </div>
      </div>

      {/* Dynamic Time-Series Analytics Charts Component Wrapper */}
      <AnalyticsCharts
        responsesOverTime={charts.responsesOverTime}
        weeklyActivity={charts.weeklyActivity}
      />
    </div>
  );
}