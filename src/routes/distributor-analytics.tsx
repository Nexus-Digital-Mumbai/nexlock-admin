import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Network, Smartphone, Apple, Table2, LineChart as ChartIcon, RefreshCw } from "lucide-react";
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

const ANDROID_COLOR = "#1265D8";
const IOS_COLOR = "#08BFEA";

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
              <span className="font-bold text-foreground">{total.toLocaleString()}</span> units enrolled (last 6 months)
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
        <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span>Generating trend visualization…</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center text-xs text-muted-foreground">
          No hardware enrollments logged in this window.
        </div>
      ) : showTable ? (
        <div className="max-h-[240px] overflow-y-auto rounded-lg border border-border/60">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted/50 border-b border-border/80 text-muted-foreground uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-left">Month</th>
                <th className="py-2.5 px-3 text-right">Units Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {chartData.map((p) => (
                <tr key={p.month} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-3 text-foreground font-medium">{p.label}</td>
                  <td className="py-2 px-3 text-right font-bold text-foreground">{p.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[240px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
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
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Distributor Fleet Analytics"
        description="Enrollment velocity and platform breakdown across all your retail connector stores."
        breadcrumbs={[{ label: "Portal", to: "/distributor" }, { label: "Analytics" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Connector Dealers"
          value={data ? data.totalConnectors.toLocaleString() : loading ? "—" : "0"}
          sub="Subordinate shops"
          icon={Network}
          tone="primary"
        />
        <KpiCard
          label="Android Enrollments"
          value={data ? data.android.totalEnrolled.toLocaleString() : loading ? "—" : "0"}
          sub="6-month total"
          icon={Smartphone}
          tone="primary"
        />
        <KpiCard
          label="iOS Enrollments"
          value={data ? data.ios.totalEnrolled.toLocaleString() : loading ? "—" : "0"}
          sub="6-month total"
          icon={Apple}
          tone="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrendChart
          title="Android Enrollments"
          icon={Smartphone}
          color={ANDROID_COLOR}
          data={data?.android.trend ?? []}
          loading={loading}
        />
        <TrendChart
          title="iOS Enrollments"
          icon={Apple}
          color={IOS_COLOR}
          data={data?.ios.trend ?? []}
          loading={loading}
        />
      </div>
    </div>
  );
}
