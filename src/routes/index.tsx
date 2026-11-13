import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Store,
  Smartphone,
  Lock,
  Unlock,
  Plus,
  ArrowRight,
  ShieldOff,
  Sparkles,
  Activity,
  Users,
  Shield,
  RefreshCw,
  Zap,
  BarChart3,
  Maximize2,
  Trophy,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { StatusBadge } from "@/components/nexlock/StatusBadge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Operations Dashboard — Nexus Console" }] }),
  component: Dashboard,
});

// Spline trend data for the Device Analytics card matching the reference design
const splineData = [
  { date: "Oct 10", enrolled: 2200, locked: 1200, released: 700 },
  { date: "Oct 17", enrolled: 3100, locked: 1700, released: 1000 },
  { date: "Oct 24", enrolled: 4300, locked: 2200, released: 1400 },
  { date: "Oct 31", enrolled: 6400, locked: 3100, released: 2100 },
  { date: "Nov 09", enrolled: 5200, locked: 2800, released: 1900 },
];

function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-xl text-xs space-y-1.5 min-w-[130px]">
        <div className="font-bold text-foreground border-b border-black/5 dark:border-white/10 pb-1">
          {label}
        </div>
        <div className="flex items-center justify-between text-[#8B5CF6]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Enrolled
          </span>
          <span className="font-bold font-mono">{(payload[0]?.value / 1000).toFixed(1)}K</span>
        </div>
        <div className="flex items-center justify-between text-[#1E1B4B] dark:text-indigo-300">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#1E1B4B] dark:bg-indigo-300" /> Locked
          </span>
          <span className="font-bold font-mono">{(payload[1]?.value / 1000).toFixed(1)}K</span>
        </div>
        <div className="flex items-center justify-between text-[#A78BFA]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#A78BFA]" /> Released
          </span>
          <span className="font-bold font-mono">{(payload[2]?.value / 1000).toFixed(1)}K</span>
        </div>
      </div>
    );
  }
  return null;
}

function Dashboard() {
  const [activeRange, setActiveRange] = useState("30D");
  const user = session.getUser();
  const userName = user?.name ? user.name.split(" ")[0] : "Somya";

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["bi", "summary"],
    queryFn: () => apiClient.get("/bi/summary"),
  });

  const summary = data?.data || {
    totalDealers: 248,
    totalDevicesEnrolled: 12500,
    devicesLocked: 7800,
    devicesUnlocked: 3100,
    devicesReleased: 3900,
    recentEnrollments: [] as any[],
  };

  // Pie chart breakdown
  const pieData = [
    { name: "Locked", value: summary.devicesLocked || 7800, color: "#6366F1" },
    { name: "Unlocked", value: summary.devicesUnlocked || 3100, color: "#C7D2FE" },
    { name: "Released", value: summary.devicesReleased || 1600, color: "#E0E7FF" },
  ];

  const totalPie = pieData.reduce((acc, curr) => acc + curr.value, 0) || 12500;
  const formatK = (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val));

  return (
    <div className="space-y-7 animate-fade-up">
      {/* 1. Hero Greeting Banner from Reference Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14172C] dark:text-white flex items-center gap-2">
            <span>Good Morning, {userName}!</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="mt-1 text-sm text-[#64748B] dark:text-slate-400">
            Here's what's happening with your NexLock platform today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-10 rounded-full border border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl text-xs font-semibold px-4 shadow-xs hover:bg-white transition-all cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", isRefetching ? "animate-spin" : "")} />
            <span>Sync Fleet</span>
          </Button>
          <Link to="/devices">
            <Button
              size="sm"
              className="h-10 rounded-full bg-[#1E1B4B] hover:bg-[#2A2665] text-white text-xs font-semibold px-5 shadow-xs transition-all cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5 mr-1.5" />
              <span>Fleet Manager</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Row: 4 Metric Cards matching Reference */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/dealers" className="block focus:outline-none">
          <KpiCard
            label="Total Dealers"
            value={formatK(summary.totalDealers || 248)}
            icon={Users}
            tone="primary"
            trend={{ value: "12%", up: true }}
          />
        </Link>
        <Link to="/devices" className="block focus:outline-none">
          <KpiCard
            label="Enrolled Devices"
            value={formatK(summary.totalDevicesEnrolled || 12500)}
            icon={Smartphone}
            tone="primary"
            trend={{ value: "8%", up: true }}
          />
        </Link>
        <Link to="/devices" className="block focus:outline-none">
          <KpiCard
            label="Locked Devices"
            value={formatK(summary.devicesLocked || 7800)}
            icon={Lock}
            tone="primary"
            trend={{ value: "5%", up: true }}
          />
        </Link>
        <Link to="/devices" className="block focus:outline-none">
          <KpiCard
            label="Released Devices"
            value={formatK(summary.devicesReleased || 3900)}
            icon={CheckCircle2}
            tone="primary"
            trend={{ value: "10%", up: true }}
          />
        </Link>
      </div>

      {/* 3. Middle Row: Device Analytics + Remote Device Control */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Device Analytics Card (Left: 7 cols) */}
        <div className="card-surface lg:col-span-7 flex flex-col justify-between p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-[#14172C] dark:text-white">
                Device Analytics
              </h2>
            </div>

            {/* Timeframe selector pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <div className="flex items-center rounded-full bg-black/5 dark:bg-white/10 p-1 text-xs">
                {["7D", "30D", "90D", "1Y"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={cn(
                      "rounded-full px-3 py-1 font-semibold transition-all cursor-pointer text-xs",
                      activeRange === range
                        ? "bg-[#3D3882] text-white shadow-xs"
                        : "text-[#64748B] dark:text-slate-300 hover:text-foreground"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Expand chart"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Enrolled
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#1E1B4B] dark:bg-indigo-300" /> Locked
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-[#C4B5FD]" /> Released
            </span>
          </div>

          {/* Spline Area Chart */}
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={splineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorLocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#312E81" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#312E81" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorReleased" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4B5FD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C4B5FD" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}K`)}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEnrolled)"
                />
                <Area
                  type="monotone"
                  dataKey="locked"
                  stroke="#312E81"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLocked)"
                />
                <Area
                  type="monotone"
                  dataKey="released"
                  stroke="#C4B5FD"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReleased)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Remote Device Control Card (Right: 5 cols) */}
        <div className="card-surface lg:col-span-5 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#14172C] dark:text-white">
                  Remote Device Control
                </h2>
                <p className="text-xs text-muted-foreground">Lock or Unlock devices instantly</p>
              </div>
            </div>
            <Link
              to="/devices"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 dark:border-white/10 bg-white/70 dark:bg-white/10 text-foreground hover:bg-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Interactive 3D Phone Mockup with glowing shield lock */}
          <div className="my-4 flex items-center justify-between gap-4">
            <div className="relative flex items-center justify-center pl-2">
              {/* Radial glow background */}
              <div className="absolute h-36 w-36 rounded-full bg-gradient-to-tr from-indigo-500/25 via-purple-500/15 to-transparent blur-2xl" />

              {/* 3D Phone Body */}
              <div className="relative h-44 w-24 rounded-[26px] border-[3px] border-[#2A2B44] bg-[#0B0C18] p-1.5 shadow-2xl ring-1 ring-white/20 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
                {/* Speaker notch */}
                <div className="mx-auto h-1 w-7 rounded-full bg-[#2A2B44] mb-1" />
                {/* Screen */}
                <div className="flex h-[calc(100%-10px)] w-full flex-col items-center justify-center rounded-[20px] bg-gradient-to-b from-[#14162B] to-[#0A0B14] p-2 text-center overflow-hidden relative">
                  {/* Subtle particle ring */}
                  <div className="absolute inset-0 border border-primary/30 rounded-full animate-ping opacity-25" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 text-white">
                    <Shield className="h-6 w-6" />
                    <Lock className="absolute h-3 w-3 text-white" />
                  </div>
                  <span className="mt-2 text-[9px] font-mono text-indigo-300">NEXLOCK</span>
                </div>
              </div>
            </div>

            {/* Action Buttons from Reference Design */}
            <div className="flex-1 space-y-3 pr-2">
              <Link to="/devices" className="block">
                <Button
                  className="w-full h-12 rounded-2xl bg-[#1E1E2F] hover:bg-[#2C2C42] text-white text-xs font-semibold gap-2 shadow-sm transition-all"
                >
                  <Lock className="h-4 w-4" />
                  <span>Lock Device</span>
                </Button>
              </Link>

              <Link to="/devices" className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl border border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 hover:bg-white text-[#1E1E2F] dark:text-white text-xs font-semibold gap-2 shadow-xs transition-all"
                >
                  <Unlock className="h-4 w-4" />
                  <span>Unlock Device</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom status indicators */}
          <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
            </span>
            <span className="text-[11px]">Last Sync: 2m ago</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 4 Specialized Cards from Reference Design */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Device Status Overview (Donut Chart) */}
        <div className="card-surface flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#14172C] dark:text-white">
              Device Status Overview
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
              This Month <ChevronDown className="h-3 w-3" />
            </span>
          </div>

          <div className="my-3 flex items-center justify-between gap-2">
            {/* Donut Chart */}
            <div className="relative h-28 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={36}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-extrabold text-foreground leading-tight">
                  {formatK(totalPie)}
                </span>
                <span className="text-[9px] text-muted-foreground leading-none">Total</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-1.5 text-xs flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                  <span className="h-2 w-2 rounded-full bg-[#6366F1] shrink-0" /> Locked
                </span>
                <span className="font-semibold text-foreground font-mono">
                  {formatK(summary.devicesLocked || 7800)} <span className="text-muted-foreground/70 font-normal">62%</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                  <span className="h-2 w-2 rounded-full bg-[#C7D2FE] shrink-0" /> Unlocked
                </span>
                <span className="font-semibold text-foreground font-mono">
                  {formatK(summary.devicesUnlocked || 3100)} <span className="text-muted-foreground/70 font-normal">25%</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground truncate">
                  <span className="h-2 w-2 rounded-full bg-[#E0E7FF] shrink-0" /> Released
                </span>
                <span className="font-semibold text-foreground font-mono">
                  {formatK(summary.devicesReleased || 1600)} <span className="text-muted-foreground/70 font-normal">13%</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Activity Timeline */}
        <div className="card-surface flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-[#14172C] dark:text-white">Recent Activity</h3>
            </div>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3 my-1">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 shrink-0 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground truncate">Device Locked</p>
                  <span className="text-[10px] text-muted-foreground">2m ago</span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  IMEI 356789012345678
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 shrink-0 mt-0.5">
                <Store className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground truncate">New Dealer Registered</p>
                  <span className="text-[10px] text-muted-foreground">12m ago</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">TechNova Solutions</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 shrink-0 mt-0.5">
                <Unlock className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground truncate">Device Unlocked</p>
                  <span className="text-[10px] text-muted-foreground">25m ago</span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  IMEI 356789012345679
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Top Dealers Ranked List */}
        <div className="card-surface flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-[#14172C] dark:text-white">Top Dealers</h3>
            </div>
            <Link
              to="/dealers"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3 my-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/15 text-purple-700 font-bold text-xs">
                  T
                </span>
                <span className="text-xs font-semibold text-foreground truncate">
                  TechNova Solutions
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                +524 Units
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 font-bold text-xs">
                  G
                </span>
                <span className="text-xs font-semibold text-foreground truncate">
                  Global Mobiles
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                +382 Units
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 text-blue-700 font-bold text-xs">
                  S
                </span>
                <span className="text-xs font-semibold text-foreground truncate">
                  SmartBuy Retail
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                +317 Units
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Sapphire Obsidian Promo Card from Reference */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2038] via-[#15172C] to-[#0E1020] p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <Sparkles className="h-4 w-4 text-indigo-300 animate-pulse" />
          </div>

          <div className="relative z-10 my-3">
            <h4 className="text-sm font-bold tracking-tight text-white leading-snug">
              Powering Smarter Device Management
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Realtime telemetry & automated locking policies for device financing.
            </p>
          </div>

          <Link to="/devices" className="relative z-10">
            <Button
              size="sm"
              className="w-full h-9 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold gap-1.5 shadow-sm transition-all"
            >
              <span>Explore More</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
