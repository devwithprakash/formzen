"use client";

import dynamic from "next/dynamic";
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const stats = [
  {
    label: "Total Responses",
    value: "1,847",
    changePercent: "+21%",
    positive: true,
    icon: Users,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Total Views",
    value: "4,521",
    changePercent: "+12%",
    positive: true,
    icon: Eye,
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    label: "Completion Rate",
    value: "87%",
    changePercent: "+5%",
    positive: true,
    icon: TrendingUp,
    color: "bg-chart-5/20 text-chart-5",
  },
  {
    label: "Avg. Time",
    value: "2m 34s",
    changePercent: "-8%",
    positive: true,
    icon: Clock,
    color: "bg-chart-4/50 text-foreground",
  },
];

const sourceData = [
  { name: "Direct", value: 42 },
  { name: "Social", value: 28 },
  { name: "Email", value: 18 },
  { name: "Referral", value: 12 },
];

const recentResponses = [
  {
    form: "Customer Feedback",
    email: "john@example.com",
    date: "2 min ago",
    time: "3m 12s",
    status: "Complete",
  },
  {
    form: "Job Application",
    email: "sarah@example.com",
    date: "15 min ago",
    time: "8m 45s",
    status: "Complete",
  },
  {
    form: "Newsletter Signup",
    email: "mike@example.com",
    date: "1 hour ago",
    time: "42s",
    status: "Complete",
  },
  {
    form: "Contact Form",
    email: "emily@example.com",
    date: "2 hours ago",
    time: "1m 23s",
    status: "Complete",
  },
  {
    form: "Event Registration",
    email: "alex@example.com",
    date: "3 hours ago",
    time: "5m 18s",
    status: "Partial",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-20 lg:pb-0 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track performance across all your forms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[140px] bg-card border-border/50">
              <Calendar className="h-4 w-4 mr-2" />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-5 border border-border/50 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    stat.positive ? "text-primary" : "text-destructive"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.changePercent}
                </div>
              </div>
              <p className="font-serif text-2xl text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Heavy Lazy-Loaded Charts Section */}
      <AnalyticsCharts />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-card rounded-xl border border-border/50 p-6 h-full">
          <h3 className="font-serif text-lg text-foreground mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {sourceData.map((source) => (
              <div key={source.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{source.name}</span>
                  <span className="text-sm font-medium text-foreground">{source.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    style={{ width: `${source.value}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Responses Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 overflow-hidden h-full">
          <div className="p-5 border-b border-border/50">
            <h3 className="font-serif text-lg text-foreground">Recent Responses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Form
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Respondent
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentResponses.map((response, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground truncate max-w-[150px]">
                          {response.form}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground truncate max-w-[180px]">
                      {response.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          response.status === "Complete"
                            ? "bg-primary/10 text-primary"
                            : "bg-chart-4/50 text-foreground"
                        }`}
                      >
                        {response.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
