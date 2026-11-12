import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Network, Smartphone, Apple, Table2 } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/distributor-analytics")({
  head: () => ({ meta: [{ title: "Analytics — Distributor Portal" }] }),
  component: DistributorAnalyticsPage,
});

interface TrendPoint { month: string; count: number }
interface Analytics {
  totalConnectors: number;
  android: { totalEnrolled: number; trend: TrendPoint[] };
  ios: { totalEnrolled: number; trend: TrendPoint[] };
}

// Same validated pair as the admin's own /analytics dashboard (node validate_palette.js
// "#1565F5,#22C55E" --mode light) — kept identical on purpose so "blue = Android, green = iOS"
// reads the same way here as it does everywhere else a reader has already seen it.
const ANDROID_COLOR = "#1565F5";
const IOS_COLOR = "#22C55E";

function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

function TrendChart({
  title,
  icon: Icon,
  color,
  data,
  loading,
}: {
  title: string;
  icon: typeof Smartphone;
  color: string;
  data: TrendPoint[];
  loading: boolean;
}) {
  const [showTable, setShowTable] = useState(false);
  const total = data.reduce((sum, p) => sum + p.count, 0);
  const chartData = data.map((p) => ({ ...p, label: monthLabel(p.month) }));

  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ backgroundColor: `${color}1a`, color }}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">{total.toLocaleString()} in the last 6 months</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" onClick={() => setShowTable((s) => !s)}>
          <Table2 className="h-3.5 w-3.5" />
          {showTable ? "Chart" : "Table"}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">Loading…</div>
      ) : chartData.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">No enrollments yet.</div>
      ) : showTable ? (
        <div className="max-h-[220px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-1.5 text-left font-medium">Month</th>
                <th className="py-1.5 text-right font-medium">Count</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((p) => (
                <tr key={p.month} className="border-b border-border/50">
                  <td className="py-1.5 text-foreground">{p.label}</td>
                  <td className="py-1.5 text-right font-medium text-foreground">{p.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={32}
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

function DistributorAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/distributor/analytics");
        if (res.success) setData(res.data);
      } catch (err: any) {
        toast.error("Failed to load analytics", { description: err.message });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Your connector network's enrollment activity at a glance."
        breadcrumbs={[{ label: "Home", to: "/distributor" }, { label: "Analytics" }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Total Connectors"
          value={data ? data.totalConnectors.toLocaleString() : loading ? "—" : "0"}
          icon={Network}
        />
        <KpiCard
          label="Android Enrolled"
          value={data ? data.android.totalEnrolled.toLocaleString() : loading ? "—" : "0"}
          icon={Smartphone}
        />
        <KpiCard
          label="iOS Enrolled"
          value={data ? data.ios.totalEnrolled.toLocaleString() : loading ? "—" : "0"}
          icon={Apple}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendChart title="Android Enrollments" icon={Smartphone} color={ANDROID_COLOR} data={data?.android.trend ?? []} loading={loading} />
        <TrendChart title="iOS Enrollments" icon={Apple} color={IOS_COLOR} data={data?.ios.trend ?? []} loading={loading} />
      </div>
    </div>
  );
}
