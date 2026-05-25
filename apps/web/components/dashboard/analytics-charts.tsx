"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock Data Arrays relocated for optimization
const responseData = [
  { date: "Jan 1", responses: 45, views: 120 },
  { date: "Jan 8", responses: 78, views: 210 },
  { date: "Jan 15", responses: 92, views: 280 },
  { date: "Jan 22", responses: 156, views: 420 },
  { date: "Jan 29", responses: 134, views: 380 },
  { date: "Feb 5", responses: 189, views: 520 },
  { date: "Feb 12", responses: 223, views: 610 },
  { date: "Feb 19", responses: 278, views: 720 },
  { date: "Feb 26", responses: 312, views: 850 },
  { date: "Mar 4", responses: 340, views: 920 },
];

const formPerformance = [
  { name: "Customer Feedback", responses: 234, completionRate: 87 },
  { name: "Job Application", responses: 89, completionRate: 72 },
  { name: "Newsletter Signup", responses: 1203, completionRate: 94 },
  { name: "Contact Form", responses: 567, completionRate: 91 },
  { name: "Event Registration", responses: 156, completionRate: 68 },
];

const deviceData = [
  { name: "Desktop", value: 55, color: "var(--chart-1)" },
  { name: "Mobile", value: 38, color: "var(--chart-2)" },
  { name: "Tablet", value: 7, color: "var(--chart-5)" },
];

export function AnalyticsCharts() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Responses Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card rounded-xl border border-border/50 p-6"
      >
        <h3 className="font-serif text-lg text-foreground mb-6">Responses Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={responseData}>
              <defs>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResponses)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Form Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card rounded-xl border border-border/50 p-6"
      >
        <h3 className="font-serif text-lg text-foreground mb-6">Form Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="responses" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Device Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-xl border border-border/50 p-6 lg:col-span-2"
      >
        <h3 className="font-serif text-lg text-foreground mb-6">Device Breakdown</h3>
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-6 sm:flex sm:flex-col sm:space-y-4 w-full sm:w-auto">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: device.color }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
