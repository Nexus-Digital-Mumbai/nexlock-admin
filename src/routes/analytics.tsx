import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Smartphone, Store, Table2 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
  head: () => ({ meta: [{ title: "Analytics — NexLock Admin" }] }),
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

// Validated pair (node validate_palette.js "#1565F5,#22C55E" --mode light): CVD/normal-vision
// checks pass. Each series lives on its own single-axis chart below (never combined — device
// enrollment and dealer onboarding are wildly different scales, so one shared axis would flatten
// the smaller series), so this is really two independent single-color assignments, not a
// categorical pair read side by side — but keeping them distinct and validated still matters
// since a reader flips between the two chart cards and should keep "blue = devices, green =
// dealers" consistent.
const ENROLLMENT_COLOR = "#1565F5";
const DEALERS_COLOR = "#22C55E";

// `<input type="date">` gives a bare "YYYY-MM-DD" string. `new Date("2026-09-30")` parses that
// as UTC midnight at the START of the day (a well-known JS gotcha: date-only ISO strings are
// UTC-interpreted, unlike the new Date(y, m, d) constructor form, which is local-time). Sending
// that straight to the backend as the "to" boundary silently excluded almost the entire last day
// of whatever range was selected (e.g. "Sept 1–30" actually queried through "Sept 30 00:00 UTC",
// i.e. ~5:30 AM IST — missing the whole business day), undercounting by roughly one day's
// enrollments. Parsing the Y/M/D parts manually and constructing a LOCAL Date for an explicit
// start-of-day or end-of-day instant fixes both ends: "from" now genuinely starts at local
// midnight (not ~5:30 AM UTC-shifted), and "to" now genuinely includes the whole selected day.
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
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: `${color}1a`, color }}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">{total.toLocaleString()} total in range</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => setShowTable((s) => !s)}>
          <Table2 className="h-3.5 w-3.5" />
          {showTable ? "Chart" : "Table"}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">Loading…</div>
      ) : chartData.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">No data in this range.</div>
      ) : showTable ? (
        <div className="max-h-[260px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-1.5 text-left font-medium">Period</th>
                <th className="py-1.5 text-right font-medium">Count</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((p) => (
                <tr key={p.bucket} className="border-b border-border/50">
                  <td className="py-1.5 text-foreground">{p.label}</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{p.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={36}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
              formatter={(value: number) => [<span style={{ color: "var(--foreground)", fontWeight: 600 }}>{value.toLocaleString()}</span>, title]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color, strokeWidth: 2, stroke: "var(--card)" }}
              activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: "var(--card)" }}
            />
          </LineChart>
        </ResponsiveContainer>
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
    <div>
      <PageHeader
        title="Analytics"
        description="Device enrollment and dealer onboarding trends across the platform."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Analytics" }]}
      />

      {/* Filters — one row, above everything they scope, granularity first then date range,
          matching the dataviz skill's filter composition rule. */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day wise</SelectItem>
            <SelectItem value="week">Week wise</SelectItem>
            <SelectItem value="month">Month wise</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
          />
          <span>to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
          />
        </div>

        {(from || to) && (
          <Button variant="outline" size="sm" onClick={clearRange}>
            All Time
          </Button>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <KpiCard
          label="Device Enrollments in Range"
          value={totals.enrollment.toLocaleString()}
          sub={from || to ? "selected range" : "all time"}
          icon={Smartphone}
        />
        <KpiCard
          label="Dealers Onboarded in Range"
          value={totals.dealers.toLocaleString()}
          sub={from || to ? "selected range" : "all time"}
          icon={Store}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendChart
          title="Device Enrollment"
          icon={Smartphone}
          color={ENROLLMENT_COLOR}
          data={data?.enrollment ?? []}
          granularity={granularity}
          loading={loading}
        />
        <TrendChart
          title="Dealer Onboarding"
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
