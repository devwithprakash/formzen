"use client";

import dynamic from "next/dynamic";
import {
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  FileText,
  ArrowLeft,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  Laptop,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useFormAnalytics } from "@/hooks/analytics/use-analytics";
import { useParams } from "next/navigation";

const AnalyticsCharts = dynamic(
  () => import("@/components/dashboard/analytics-charts").then((mod) => mod.AnalyticsCharts),
  {
    ssr: false,
    loading: () => (
      <div className="grid lg:grid-cols-2 gap-6 animate-pulse">
        <div className="h-[380px] bg-card/50 border border-border/40 rounded-xl" />
        <div className="h-[380px] bg-card/50 border border-border/40 rounded-xl" />
        <div className="h-[280px] lg:col-span-2 bg-card/50 border border-border/40 rounded-xl" />
      </div>
    ),
  },
);

export default function SingleFormAnalyticsPage() {
  const params = useParams();
  const formId = params?.formId as string;

  // ✅ Call your custom hook unconditionally at the top level
  const { data, isLoading, error } = useFormAnalytics(formId);

  console.log(data)

  // Static identity details context fallback
  const formMeta = {
    title: "Form Performance Overview",
    status: "Active",
    url: `formzen.com/f/${formId || "loading"}`,
  };

  // 1. Loading Visual State
  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground animate-in fade-in">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Gathering submission analytics charts...</p>
      </div>
    );
  }

  // 2. Error Boundary Visual State
  if (error || !data) {
    return (
      <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl text-destructive text-sm flex items-center gap-3 max-w-2xl mx-auto mt-10">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <h5 className="font-semibold">Failed to load analytics</h5>
          <p className="text-xs opacity-90 mt-0.5">
            Please check your database connection or confirm this Form ID exists.
          </p>
        </div>
      </div>
    );
  }

  // Destructure real payloads safely from backend controller shape
  const { cards, charts } = data;

  return (
    <div className="space-y-8 pb-20 lg:pb-0 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Link href="/forms" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Forms
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
                {formMeta.title}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {formMeta.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="font-mono bg-secondary/50 px-2 py-0.5 rounded text-xs truncate max-w-[240px] sm:max-w-none">
                {formMeta.url}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(formMeta.url)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
                title="Copy Live Link"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <a
                href={`https://${formMeta.url}`}
                target="_blank"
                rel="noreferrer"
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
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
      </div>

      {/* Dynamic Stats Grid (Only 2 columns now since we avoid fake/untracked metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Responses */}
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:border-border transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
              <ArrowUpRight className="h-3 w-3" /> Live
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
            {cards.totalResponses.toLocaleString()}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Submissions</p>
        </div>

        {/* Completion Rate */}
        <div className="bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:border-border transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="font-serif text-2xl sm:text-3xl text-foreground tracking-tight">
            {cards.completionRate}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Submission Rate</p>
        </div>
      </div>

      {/* Database Line/Bar Charts (Render data safely downstream) */}
      <AnalyticsCharts
        responsesOverTime={charts.responsesOverTime}
        weeklyActivity={charts.weeklyActivity}
      />

      {/* Breakdowns Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Side: Question Choice Aggregations (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 p-6 h-full space-y-6">
          <div>
            <h3 className="font-serif text-lg text-foreground">Question Selection Breakdowns</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Frequencies calculated straight from response options answers.
            </p>
          </div>

          <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">
            {charts.questionAnalytics.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No choice questions option metrics discovered yet.
              </p>
            ) : (
              charts.questionAnalytics.map((question) => (
                <div
                  key={question.fieldId}
                  className="space-y-2 border-b border-border/30 pb-4 last:border-none last:pb-0"
                >
                  <h4 className="text-xs font-semibold text-foreground bg-secondary/40 px-2.5 py-1.5 rounded border border-border/40">
                    {question.questionLabel}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    {question.breakdown.map((choice, index) => (
                      <div
                        key={index}
                        className="p-2.5 bg-secondary/10 border border-border/20 rounded-lg flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-muted-foreground truncate max-w-[65%]">
                          {choice.option}
                        </span>
                        <span className="font-mono font-bold bg-background px-1.5 py-0.5 rounded border text-foreground">
                          {choice.votes} submissions
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Simple Context Panel placeholder */}
        <div className="bg-card rounded-xl border border-border/50 p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Laptop className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-lg text-foreground">Operational Data</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Core structural information pulled directly from metadata tracking parameters.
            </p>
            <div className="text-center py-12 border border-dashed rounded-xl border-border/60 bg-secondary/5">
              <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-medium">
                Submission Data Sync Active
              </p>
              <p className="text-[10px] text-muted-foreground/70 max-w-[180px] mx-auto mt-1">
                Incoming rows map into fields synchronously.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
