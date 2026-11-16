import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
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
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Operations Dashboard — Nexus Console" }] }),
  component: Dashboard,
});

function formatNumberVal(val: any) {
  const num = Number(val) || 0;
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
}

function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/80 dark:border-[#164675] bg-white/95 dark:bg-[#0B1D38]/95 p-3.5 shadow-xl backdrop-blur-xl text-xs space-y-1.5 min-w-[130px]">
        <div className="font-bold text-foreground dark:text-[#F5F8FF] border-b border-border/60 dark:border-[#164675]/60 pb-1">
          {label}
        </div>
        <div className="flex items-center justify-between text-[#0755D8] dark:text-[#006BFF]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#0755D8] dark:bg-[#006BFF]" /> Enrolled
          </span>
          <span className="font-bold font-mono text-foreground dark:text-[#F5F8FF]">{formatNumberVal(payload[0]?.value)}</span>
        </div>
        <div className="flex items-center justify-between text-[#008CFF] dark:text-[#00D4FF]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#008CFF] dark:bg-[#00D4FF]" /> Locked
          </span>
          <span className="font-bold font-mono text-foreground dark:text-[#F5F8FF]">{formatNumberVal(payload[1]?.value)}</span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground dark:text-[#8CA5C8]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/60 dark:bg-[#8CA5C8]" /> Released
          </span>
          <span className="font-bold font-mono text-foreground dark:text-[#F5F8FF]">{formatNumberVal(payload[2]?.value)}</span>
        </div>
      </div>
    );
  }
  return null;
}

function formatRelativeTime(dateStr?: string | Date) {
  if (!dateStr) return "Just now";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function generateDynamicTimeAxis(range: string) {
  const points = [];
  const now = new Date();
  const count = range === "7D" ? 7 : range === "30D" ? 5 : range === "90D" ? 6 : 12;
  const stepDays = range === "7D" ? 1 : range === "30D" ? 6 : range === "90D" ? 15 : 30;

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * stepDays * 86400000);
    const dateLabel = range === "1Y"
      ? d.toLocaleDateString("en-US", { month: "short" })
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    points.push({
      date: dateLabel,
      enrolled: 0,
      locked: 0,
      released: 0,
    });
  }
  return points;
}

function Dashboard() {
  const queryClient = useQueryClient();
  const { isDark } = useTheme();
  const [activeRange, setActiveRange] = useState("30D");
  const user = session.getUser();
  const userName = user?.name
    ? user.name.split(" ")[0]
    : user?.email
      ? user.email.split("@")[0]
      : "Administrator";

  // 1. BI Summary Aggregation (KPI counts, status overview, recent enrollments)
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching: isSummaryRefetching,
    dataUpdatedAt: summaryUpdatedAt,
  } = useQuery({
    queryKey: ["bi", "summary"],
    queryFn: () => apiClient.get("/bi/summary"),
  });

  // 2. Full Portfolio & BI Dashboard Endpoint (collections, loans, portfolio risk)
  const {
    data: dashboardData,
    refetch: refetchDashboard,
    isRefetching: isDashboardRefetching,
  } = useQuery({
    queryKey: ["bi", "dashboard"],
    queryFn: () => apiClient.get("/bi/dashboard"),
  });

  // 3. User Personalized Dashboard Layout Endpoint
  const { data: layoutData } = useQuery({
    queryKey: ["bi", "dashboard", "layout"],
    queryFn: () => apiClient.get("/bi/dashboard/layout"),
  });

  // 4. Granular Trends for selected range
  const granularity = activeRange === "7D" ? "day" : activeRange === "30D" ? "day" : activeRange === "90D" ? "week" : "month";
  const {
    data: trendsData,
    refetch: refetchTrends,
    isRefetching: isTrendsRefetching,
  } = useQuery({
    queryKey: ["bi", "trends", granularity],
    queryFn: () => apiClient.get(`/bi/trends?granularity=${granularity}`),
    enabled: user?.role === "Super Admin",
  });

  // 5. Audit Trail for Live Operational Events
  const {
    data: auditData,
    refetch: refetchAudit,
    isRefetching: isAuditRefetching,
  } = useQuery({
    queryKey: ["bi", "audit-trail", { limit: 5 }],
    queryFn: () => apiClient.get("/bi/audit-trail?limit=5"),
  });

  // 6. Registered Dealers List
  const {
    data: dealersData,
    refetch: refetchDealers,
    isRefetching: isDealersRefetching,
  } = useQuery({
    queryKey: ["dealers", "top-list"],
    queryFn: () => apiClient.get("/dealers?limit=5"),
  });

  // Load user's saved layout configuration
  useEffect(() => {
    if (layoutData?.data?.layout?.activeRange) {
      setActiveRange(layoutData.data.layout.activeRange);
    }
  }, [layoutData]);

  // Persist dashboard layout updates
  const saveLayoutMutation = useMutation({
    mutationFn: (newLayout: any) => apiClient.post("/bi/dashboard/layout", { layout: newLayout }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bi", "dashboard", "layout"] });
    },
  });

  const handleRangeChange = (range: string) => {
    setActiveRange(range);
    saveLayoutMutation.mutate({
      ...(layoutData?.data?.layout || {}),
      activeRange: range,
    });
  };

  const isRefetching =
    isSummaryRefetching ||
    isDashboardRefetching ||
    isTrendsRefetching ||
    isAuditRefetching ||
    isDealersRefetching;

  const handleSyncFleet = async () => {
    await Promise.all([
      refetchSummary(),
      refetchDashboard(),
      refetchTrends(),
      refetchAudit(),
      refetchDealers(),
    ]);
  };

  const summary = summaryData?.data || {
    totalDealers: 0,
    totalDevicesEnrolled: 0,
    devicesLocked: 0,
    devicesUnlocked: 0,
    devicesReleased: 0,
    recentEnrollments: [] as any[],
  };

  const lockedCount = summary.devicesLocked ?? 0;
  const unlockedCount = summary.devicesUnlocked ?? 0;
  const releasedCount = summary.devicesReleased ?? 0;
  const totalDevices = summary.totalDevicesEnrolled ?? (lockedCount + unlockedCount + releasedCount);

  const lockedPct = totalDevices > 0 ? Math.round((lockedCount / totalDevices) * 100) : 0;
  const unlockedPct = totalDevices > 0 ? Math.round((unlockedCount / totalDevices) * 100) : 0;
  const releasedPct = totalDevices > 0 ? Math.max(0, 100 - lockedPct - unlockedPct) : 0;

  // Real Dynamic Spline Chart Data
  const chartData = useMemo(() => {
    const enrollmentTrends = trendsData?.data?.enrollment;
    if (enrollmentTrends && Array.isArray(enrollmentTrends) && enrollmentTrends.length > 0) {
      return enrollmentTrends.map((point: any) => {
        const count = Number(point.count) || 0;
        return {
          date: new Date(point.bucket).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          enrolled: count,
          locked: Math.round(count * (lockedPct / 100)),
          released: Math.round(count * (releasedPct / 100)),
        };
      });
    }
    return generateDynamicTimeAxis(activeRange);
  }, [trendsData, activeRange, lockedPct, releasedPct]);

  // Real Dynamic Recent Activities
  const recentActivities = useMemo(() => {
    if (summary.recentEnrollments && summary.recentEnrollments.length > 0) {
      return summary.recentEnrollments.slice(0, 3).map((item: any) => ({
        id: item.deviceId,
        title: item.status === "Locked" ? "Device Locked" : item.status === "Released" ? "Device Released" : "Device Enrolled",
        subtitle: item.imei1 ? `IMEI ${item.imei1}` : (item.deviceCode || "Device Enrolled"),
        time: formatRelativeTime(item.enrolledAt),
        type: item.status || "Assigned",
      }));
    }

    const auditItems = auditData?.data?.items;
    if (auditItems && Array.isArray(auditItems) && auditItems.length > 0) {
      return auditItems.slice(0, 3).map((item: any) => {
        const actionLabel = item.action === "user.login"
          ? "Admin Signed In"
          : item.action === "dealer.create"
            ? "New Dealer Registered"
            : item.action?.replace(".", " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "System Event";

        return {
          id: item.id,
          title: actionLabel,
          subtitle: item.actorEmail || item.targetId || "Console Admin",
          time: formatRelativeTime(item.createdAt),
          type: item.category === "dealer" ? "Dealer" : item.action?.includes("lock") ? "Locked" : "Assigned",
        };
      });
    }

    return [];
  }, [summary.recentEnrollments, auditData]);

  // Real Dynamic Top Dealers
  const topDealersList = useMemo(() => {
    const rawDealers = dealersData?.data?.items || dealersData?.data;
    if (rawDealers && Array.isArray(rawDealers) && rawDealers.length > 0) {
      return rawDealers.slice(0, 3).map((d: any, idx: number) => ({
        id: d.id,
        name: d.name || `Dealer #${idx + 1}`,
        initial: (d.name || "D").charAt(0).toUpperCase(),
        units: d.devicesCount ? `+${d.devicesCount} Units` : (d.status === "active" ? "Active" : "Registered"),
        colorClass: idx === 0 ? "bg-purple-500/15 text-purple-700" : idx === 1 ? "bg-amber-500/15 text-amber-700" : "bg-blue-500/15 text-blue-700",
      }));
    }

    const recentDealers = dashboardData?.data?.recentDealers;
    if (recentDealers && Array.isArray(recentDealers) && recentDealers.length > 0) {
      return recentDealers.slice(0, 3).map((d: any, idx: number) => ({
        id: d.id,
        name: d.name || `Dealer #${idx + 1}`,
        initial: (d.name || "D").charAt(0).toUpperCase(),
        units: d.devicesCount ? `+${d.devicesCount} Units` : (d.status === "active" ? "Active" : "Registered"),
        colorClass: idx === 0 ? "bg-purple-500/15 text-purple-700" : idx === 1 ? "bg-amber-500/15 text-amber-700" : "bg-blue-500/15 text-blue-700",
      }));
    }

    return [];
  }, [dealersData, dashboardData]);

  // Pie chart breakdown
  const pieData = totalDevices > 0
    ? [
        { name: "Locked", value: lockedCount, color: isDark ? "#006BFF" : "#0755D8" },
        { name: "Unlocked", value: unlockedCount, color: isDark ? "#00D4FF" : "#008CFF" },
        { name: "Released", value: releasedCount, color: isDark ? "#164675" : "#00C9E8" },
      ]
    : [
        { name: "Locked", value: 0, color: isDark ? "#006BFF" : "#0755D8" },
        { name: "Unlocked", value: 0, color: isDark ? "#00D4FF" : "#008CFF" },
        { name: "Released", value: 0, color: isDark ? "#164675" : "#00C9E8" },
      ];

  const totalPie = totalDevices;
  const formatK = (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val));

  return (
    <div className="space-y-7 animate-fade-up">
      {/* 1. Hero Greeting Banner from Reference Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground dark:text-[#F5F8FF] flex items-center gap-2">
            <span>Good Morning, {userName}!</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground dark:text-[#8CA5C8]">
            Here's what's happening with your NexLock platform today.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncFleet}
            disabled={isRefetching}
            className="glass-pill h-10 rounded-full text-xs font-semibold px-4 text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF] cursor-pointer"
          >
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", isRefetching ? "animate-spin" : "")} />
            <span>Sync Fleet</span>
          </Button>
          <Link to="/devices">
            <Button
              size="sm"
              className="h-10 rounded-full bg-[#071D62] hover:bg-[#0755D8] dark:bg-[#006BFF] dark:hover:bg-[#008CFF] text-white text-xs font-semibold px-5 shadow-[0_4px_14px_rgba(7,29,98,0.2)] dark:shadow-[0_4px_14px_rgba(0,107,255,0.35)] transition-all cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5 mr-1.5" />
              <span>Fleet Manager</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/dealers" className="block focus:outline-none">
          <KpiCard
            label="Total Dealers"
            value={formatK(summary.totalDealers ?? 0)}
            icon={Users}
            tone="primary"
            trend={
              summary.totalDealers > 0
                ? { value: `${dashboardData?.data?.kpis?.activeDealers ?? summary.totalDealers} Active`, up: true }
                : { value: "0 Registered", up: false }
            }
          />
        </Link>
        <Link to="/devices" className="block focus:outline-none">
          <KpiCard
            label="Enrolled Devices"
            value={formatK(summary.totalDevicesEnrolled ?? 0)}
            icon={Smartphone}
            tone="primary"
            trend={
              totalDevices > 0
                ? { value: `${unlockedPct}% Active`, up: true }
                : { value: "0 Enrolled", up: false }
            }
          />
        </Link>
        <Link to="/devices" className="block focus:outline-none">
          <KpiCard
            label="Locked Devices"
            value={formatK(summary.devicesLocked ?? 0)}
            icon={Lock}
            tone="primary"
            trend={
              totalDevices > 0
                ? { value: `${lockedPct}% Hold`, up: lockedCount > 0 }
                : { value: "0 Locked", up: false }
            }
          />
        </Link>
        <Link to="/devices" className="block focus:outline-none">
          <KpiCard
            label="Released Devices"
            value={formatK(summary.devicesReleased ?? 0)}
            icon={CheckCircle2}
            tone="primary"
            trend={
              totalDevices > 0
                ? { value: `${releasedPct}% Settled`, up: true }
                : { value: "0 Settled", up: false }
            }
          />
        </Link>
      </div>

      {/* 3. Middle Row: Device Analytics + Remote Device Control */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Device Analytics Card (Left: 7 cols) */}
        <div className="card-surface lg:col-span-7 flex flex-col justify-between p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 dark:bg-[#006BFF]/15 text-primary dark:text-[#00D4FF] border border-primary/20 dark:border-[#006BFF]/30">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-foreground dark:text-[#F5F8FF]">
                Device Analytics
              </h2>
            </div>

            {/* Timeframe selector pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <div className="flex items-center rounded-full bg-white/80 dark:bg-[#061329] border border-white/80 dark:border-[#164675] p-1 text-xs">
                {["7D", "30D", "90D", "1Y"].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleRangeChange(range)}
                    className={cn(
                      "rounded-full px-3 py-1 font-semibold transition-all cursor-pointer text-xs",
                      activeRange === range
                        ? "bg-primary text-white shadow-xs"
                        : "text-muted-foreground dark:text-[#8CA5C8] hover:text-foreground dark:hover:text-[#F5F8FF]"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground dark:text-[#8CA5C8] hover:bg-white/40 dark:hover:bg-white/10 hover:text-primary dark:hover:text-[#00D4FF] transition-colors"
                title="Expand chart"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs text-muted-foreground dark:text-[#8CA5C8] mb-4">
            <span className="flex items-center gap-1.5 font-medium text-foreground dark:text-[#F5F8FF]">
              <span className="h-2 w-2 rounded-full bg-[#0755D8] dark:bg-[#006BFF]" /> Enrolled
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground dark:text-[#F5F8FF]">
              <span className="h-2 w-2 rounded-full bg-[#008CFF] dark:bg-[#00D4FF]" /> Locked
            </span>
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground dark:text-[#8CA5C8]">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60 dark:bg-[#8CA5C8]" /> Released
            </span>
          </div>

          {/* Spline Area Chart */}
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#006BFF" : "#0755D8"} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={isDark ? "#006BFF" : "#0755D8"} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorLocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#00D4FF" : "#008CFF"} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={isDark ? "#00D4FF" : "#008CFF"} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="colorReleased" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#268AFF" : "#00C9E8"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={isDark ? "#268AFF" : "#00C9E8"} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? "#8CA5C8" : "#4B6188", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: isDark ? "#8CA5C8" : "#4B6188", fontSize: 11 }}
                  tickFormatter={(val) => (val === 0 ? "0" : val >= 1000 ? `${(val / 1000).toFixed(1)}K` : String(val))}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke={isDark ? "#006BFF" : "#0755D8"}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEnrolled)"
                />
                <Area
                  type="monotone"
                  dataKey="locked"
                  stroke={isDark ? "#00D4FF" : "#008CFF"}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLocked)"
                />
                <Area
                  type="monotone"
                  dataKey="released"
                  stroke={isDark ? "#268AFF" : "#00C9E8"}
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 dark:bg-[#006BFF]/15 text-primary dark:text-[#00D4FF] border border-primary/20 dark:border-[#006BFF]/30">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground dark:text-[#F5F8FF]">
                  Remote Device Control
                </h2>
                <p className="text-xs text-muted-foreground dark:text-[#8CA5C8]">Lock or Unlock devices instantly</p>
              </div>
            </div>
            <Link
              to="/devices"
              className="glass-pill flex h-8 w-8 items-center justify-center rounded-full text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF]"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Interactive 3D Phone Mockup with glowing shield lock */}
          <div className="my-4 flex items-center justify-between gap-4">
            <div className="relative flex items-center justify-center pl-2">
              {/* Radial glow background */}
              <div className="absolute h-36 w-36 rounded-full bg-gradient-to-tr from-[#0755D8]/20 dark:from-[#006BFF]/30 via-[#008CFF]/15 dark:via-[#00D4FF]/20 to-transparent blur-2xl" />

              {/* 3D Phone Body */}
              <div className="relative h-44 w-24 rounded-[26px] border-[3px] border-white/85 dark:border-[#164675] bg-white/90 dark:bg-[#061329] p-1.5 shadow-2xl ring-1 ring-primary/20 dark:ring-[#006BFF]/30 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
                {/* Speaker notch */}
                <div className="mx-auto h-1 w-7 rounded-full bg-slate-300 dark:bg-[#164675] mb-1" />
                {/* Screen */}
                <div className="flex h-[calc(100%-10px)] w-full flex-col items-center justify-center rounded-[20px] bg-gradient-to-b from-blue-50/90 to-indigo-100/80 dark:from-[#0B1D38] dark:to-[#020B1C] p-2 text-center overflow-hidden relative">
                  {/* Subtle particle ring */}
                  <div className="absolute inset-0 border border-primary/20 dark:border-[#00D4FF]/30 rounded-full animate-ping opacity-25" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0755D8] to-[#008CFF] dark:from-[#006BFF] dark:to-[#00D4FF] shadow-lg shadow-primary/30 dark:shadow-[#006BFF]/40 text-white">
                    <Shield className="h-6 w-6" />
                    <Lock className="absolute h-3 w-3 text-white" />
                  </div>
                  <span className="mt-2 text-[9px] font-mono text-[#0755D8] dark:text-[#00D4FF] font-semibold">NEXLOCK</span>
                </div>
              </div>
            </div>

            {/* Action Buttons from Reference Design */}
            <div className="flex-1 space-y-3 pr-2">
              <Link to="/devices" className="block">
                <Button
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0755D8] to-[#008CFF] hover:from-[#008CFF] hover:to-[#0755D8] dark:from-[#006BFF] dark:to-[#00D4FF] text-white dark:text-[#020B1C] text-xs font-bold gap-2 shadow-[0_4px_16px_rgba(7,85,216,0.25)] dark:shadow-[0_4px_16px_rgba(0,107,255,0.35)] transition-all cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>Lock Device</span>
                </Button>
              </Link>

              <Link to="/devices" className="block">
                <Button
                  variant="outline"
                  className="glass-pill w-full h-12 rounded-2xl text-[#071B5E] dark:text-[#F5F8FF] text-xs font-semibold gap-2 hover:bg-white/90 dark:hover:bg-[#0B1D38]/90 transition-all cursor-pointer"
                >
                  <Unlock className="h-4 w-4 text-[#0755D8] dark:text-[#00D4FF]" />
                  <span>Unlock Device</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom status indicators */}
          <div className="flex items-center justify-between border-t border-border/60 dark:border-[#164675]/60 pt-3 text-xs text-muted-foreground dark:text-[#8CA5C8]">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {totalDevices > 0 ? "Telemetry Active" : "Fleet Ready"}
            </span>
            <span className="text-[11px] text-muted-foreground dark:text-[#8CA5C8]">
              Last Sync: {summaryUpdatedAt ? formatRelativeTime(summaryUpdatedAt) : "Just now"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 4 Specialized Cards from Reference Design */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Device Status Overview (Donut Chart) */}
        <div className="card-surface flex flex-col justify-between p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground dark:text-[#F5F8FF]">
              Device Status Overview
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground dark:text-[#8CA5C8] bg-white/80 dark:bg-[#061329] border border-white/80 dark:border-[#164675] px-2 py-0.5 rounded-full">
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
                <span className="text-xs font-extrabold text-foreground dark:text-[#F5F8FF] leading-tight">
                  {formatK(totalPie)}
                </span>
                <span className="text-[9px] text-muted-foreground dark:text-[#8CA5C8] leading-none">Total</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-1.5 text-xs flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground dark:text-[#8CA5C8] truncate">
                  <span className="h-2 w-2 rounded-full bg-[#0755D8] dark:bg-[#006BFF] shrink-0" /> Locked
                </span>
                <span className="font-semibold text-foreground dark:text-[#F5F8FF] font-mono">
                  {formatK(lockedCount)} <span className="text-muted-foreground/70 dark:text-[#8CA5C8]/70 font-normal">{lockedPct}%</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground dark:text-[#8CA5C8] truncate">
                  <span className="h-2 w-2 rounded-full bg-[#008CFF] dark:bg-[#00D4FF] shrink-0" /> Unlocked
                </span>
                <span className="font-semibold text-foreground dark:text-[#F5F8FF] font-mono">
                  {formatK(unlockedCount)} <span className="text-muted-foreground/70 dark:text-[#8CA5C8]/70 font-normal">{unlockedPct}%</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground dark:text-[#8CA5C8] truncate">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 dark:bg-[#164675] shrink-0" /> Released
                </span>
                <span className="font-semibold text-foreground dark:text-[#F5F8FF] font-mono">
                  {formatK(releasedCount)} <span className="text-muted-foreground/70 dark:text-[#8CA5C8]/70 font-normal">{releasedPct}%</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Recent Activity Timeline */}
        <div className="card-surface flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-primary dark:text-[#00D4FF]" />
              <h3 className="text-sm font-bold text-foreground dark:text-[#F5F8FF]">Recent Activity</h3>
            </div>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-primary dark:text-[#00D4FF] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3 my-1">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg shrink-0 mt-0.5 border",
                      act.type === "Locked"
                        ? "bg-primary/10 text-primary border-primary/20 dark:bg-[#006BFF]/15 dark:text-[#006BFF] dark:border-[#006BFF]/30"
                        : act.type === "Released"
                          ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:bg-[#00D4FF]/15 dark:text-[#00D4FF] dark:border-[#00D4FF]/30"
                          : act.type === "Dealer"
                            ? "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30"
                    )}
                  >
                    {act.type === "Locked" ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : act.type === "Released" ? (
                      <ShieldOff className="h-3.5 w-3.5" />
                    ) : act.type === "Dealer" ? (
                      <Store className="h-3.5 w-3.5" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground dark:text-[#F5F8FF] truncate">{act.title}</p>
                      <span className="text-[10px] text-muted-foreground dark:text-[#8CA5C8]">{act.time}</span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground dark:text-[#8CA5C8] truncate">
                      {act.subtitle}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <Activity className="h-5 w-5 mx-auto text-muted-foreground/40 mb-1.5" />
                <p className="text-xs font-semibold text-foreground dark:text-[#F5F8FF]">No Activity Recorded</p>
                <p className="text-[11px] text-muted-foreground dark:text-[#8CA5C8]">Fleet events will stream here live.</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Top Dealers Ranked List */}
        <div className="card-surface flex flex-col justify-between p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-foreground dark:text-[#F5F8FF]">Top Dealers</h3>
            </div>
            <Link
              to="/dealers"
              className="text-xs font-semibold text-primary dark:text-[#00D4FF] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3 my-1">
            {topDealersList.length > 0 ? (
              topDealersList.map((dealer) => (
                <div key={dealer.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs",
                        dealer.colorClass
                      )}
                    >
                      {dealer.initial}
                    </span>
                    <span className="text-xs font-semibold text-foreground dark:text-[#F5F8FF] truncate">
                      {dealer.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {dealer.units}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <Store className="h-5 w-5 mx-auto text-muted-foreground/40 mb-1.5" />
                <p className="text-xs font-semibold text-foreground dark:text-[#F5F8FF]">No Dealers Registered</p>
                <p className="text-[11px] text-muted-foreground dark:text-[#8CA5C8]">Partner retail stores will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Sapphire Obsidian Promo Card from Reference */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071D62] via-[#0B256B] to-[#1265D8] dark:from-[#0B1D38] dark:via-[#061329] dark:to-[#020B1C] border border-white/20 dark:border-[#164675] p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 dark:bg-[#006BFF]/20 text-white dark:text-[#00D4FF] border border-white/20 dark:border-[#00D4FF]/30 shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <Sparkles className="h-4 w-4 text-cyan-300 dark:text-[#00D4FF] animate-pulse" />
          </div>

          <div className="relative z-10 my-3">
            <h4 className="text-sm font-bold tracking-tight text-white dark:text-[#F5F8FF] leading-snug">
              {totalDevices > 0
                ? `Securing ${totalDevices.toLocaleString()} Active Devices`
                : "Powering Smarter Device Management"}
            </h4>
            <p className="text-[11px] text-blue-100/80 dark:text-[#8CA5C8] mt-1 leading-relaxed">
              {summary.totalDealers > 0
                ? `Fleet telemetry coordinated across ${summary.totalDealers} verified dealer locations.`
                : "Realtime telemetry & automated locking policies for device financing."}
            </p>
          </div>

          <Link to="/devices" className="relative z-10">
            <Button
              size="sm"
              className="w-full h-9 rounded-full bg-white/20 hover:bg-white hover:text-[#071D62] dark:bg-[#006BFF] dark:hover:bg-[#00D4FF] dark:hover:text-[#020B1C] text-white dark:text-[#F5F8FF] border border-white/30 dark:border-[#006BFF]/40 text-xs font-semibold gap-1.5 shadow-sm transition-all"
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
