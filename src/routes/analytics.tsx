import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Smartphone, Store, Table2, LineChart as ChartIcon, Calendar, ArrowRight, RefreshCw, X } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics & Trends — Nexus Console" }] }),
  component: AnalyticsPage,
});

type Granularity = "day" | "week" | "month";
type TrendPoint = { bucket: string; count: number };
type TrendsResponse = {
  granularity: Granularity;
  from: string | null;
  to: string | null;
  enrollment: TrendPoint[];
  dealers: TrendPoint[];
};

const ENROLLMENT_COLOR = "#2563EB";
const DEALERS_COLOR = "#10B981";

function localDayBoundary(dateStr: string, edge: "start" | "end"): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return edge === "start"
    ? new Date(year, month - 1, day, 0, 0, 0, 0)
    : new Date(year, month - 1, day, 23, 59, 59, 999);
}

function formatBucketLabel(iso: string, granularity: Granularity): string {
  const d = new Date(iso);
  if (granularity === "month") return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  if (granularity === "week") return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function TrendChart({
  title,
  icon: Icon,
  color,
  data,
  granularity,
  loading,
}: {
  title: string;
  icon: typeof Smartphone;
  color: string;
  data: TrendPoint[];
  granularity: Granularity;
  loading: boolean;
}) {
  const [showTable, setShowTable] = useState(false);
  const total = data.reduce((sum, p) => sum + p.count, 0);
  const chartData = data.map((p) => ({ ...p, label: formatBucketLabel(p.bucket, granularity) }));

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs"
            style={{ backgroundColor: `${color}15`, borderColor: `${color}30`, color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground font-medium">
              <span className="font-bold text-foreground">{total.toLocaleString()}</span> total units in timeframe
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold border-border/80"
          onClick={() => setShowTable((s) => !s)}
        >
          {showTable ? <ChartIcon className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
          <span>{showTable ? "Chart View" : "Table View"}</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span>Generating chart curves…</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-xs text-muted-foreground">
          No records captured for the selected time window.
        </div>
      ) : showTable ? (
        <div className="max-h-[280px] overflow-y-auto rounded-lg border border-border/60">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/50 border-b border-border/80 text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-left">Period Bucket</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {chartData.map((p) => (
                <tr key={p.bucket} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-3 text-foreground font-medium">{p.label}</td>
                  <td className="py-2 px-3 text-right font-bold text-foreground">{p.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={36}
              />
              <Tooltip
                cursor={{ stroke: color, strokeWidth: 1.5, strokeDasharray: "4 4" }}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                  fontSize: 12,
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "var(--muted-foreground)", fontWeight: 600, marginBottom: 4 }}
                formatter={(value: number) => [
                  <span key="val" style={{ color, fontWeight: 700 }}>
                    {value.toLocaleString()} units
                  </span>,
                  title,
                ]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: color, strokeWidth: 2, stroke: "var(--card)" }}
                activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "var(--card)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ granularity });
      if (from) params.set("from", localDayBoundary(from, "start").toISOString());
      if (to) params.set("to", localDayBoundary(to, "end").toISOString());
      const res = await apiClient.get(`/bi/trends?${params.toString()}`);
      if (res.success) setData(res.data);
    } catch (err: any) {
      toast.error("Failed to load analytics", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granularity, from, to]);

  const totals = useMemo(() => {
    const enrollment = data?.enrollment.reduce((s, p) => s + p.count, 0) ?? 0;
    const dealers = data?.dealers.reduce((s, p) => s + p.count, 0) ?? 0;
    return { enrollment, dealers };
  }, [data]);

  const clearRange = () => {
    setFrom("");
    setTo("");
  };

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Fleet Analytics & Trends"
        description="Comprehensive analysis of hardware enrollments and dealership growth over time."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "Analytics" }]}
      />

      {/* Filter and Range Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
            <SelectTrigger className="w-[150px] h-10 rounded-full text-xs bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 font-medium shadow-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl">
              <SelectItem value="day" className="text-xs rounded-xl">Day-by-Day</SelectItem>
              <SelectItem value="week" className="text-xs rounded-xl">Weekly Rollup</SelectItem>
              <SelectItem value="month" className="text-xs rounded-xl">Monthly Rollup</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 rounded-full border border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            />
            <span className="text-muted-foreground/50">to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            />
          </div>

          {(from || to) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRange}
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Clear Range
            </Button>
          )}
        </div>

        <div className="text-xs font-semibold text-muted-foreground">
          Showing: <span className="text-foreground">{from || to ? "Custom Range" : "All Historical Data"}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label="Device Enrollments in Window"
          value={totals.enrollment.toLocaleString()}
          sub={from || to ? "Within selected date boundaries" : "All-time accumulated volume"}
          icon={Smartphone}
          tone="primary"
        />
        <KpiCard
          label="Dealers Onboarded in Window"
          value={totals.dealers.toLocaleString()}
          sub={from || to ? "Within selected date boundaries" : "All-time accumulated partners"}
          icon={Store}
          tone="success"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendChart
          title="Device Enrollment Growth"
          icon={Smartphone}
          color={ENROLLMENT_COLOR}
          data={data?.enrollment ?? []}
          granularity={granularity}
          loading={loading}
        />
        <TrendChart
          title="Dealer Onboarding Rate"
          icon={Store}
          color={DEALERS_COLOR}
          data={data?.dealers ?? []}
          granularity={granularity}
          loading={loading}
        />
      </div>
    </div>
  );
}
