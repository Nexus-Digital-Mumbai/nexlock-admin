import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Smartphone, Apple, Wallet, Store, Calendar, ArrowRight, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column } from "@/components/nexlock/DataTable";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/distributor-billing")({
  head: () => ({ meta: [{ title: "Billing — Distributor Portal" }] }),
  component: DistributorBillingPage,
});

interface ConnectorBillingRow {
  id: string;
  code: string;
  name: string;
  contact: string;
  city: string;
  state: string;
  androidUsed: number;
  iosUsed: number;
  androidAmount: number;
  iosAmount: number;
  amount: number;
}
interface BillingResponse {
  from: string;
  to: string;
  rates: { android: number; ios: number };
  connectors: ConnectorBillingRow[];
  totals: { androidUsed: number; iosUsed: number; amount: number };
}

const fmtInr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function localDayBoundary(dateStr: string, edge: "start" | "end"): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return edge === "start" ? new Date(year, month - 1, day, 0, 0, 0, 0) : new Date(year, month - 1, day, 23, 59, 59, 999);
}
function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const presets = [
  {
    label: "This Month",
    range: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    },
  },
  {
    label: "Last Month",
    range: () => {
      const now = new Date();
      return { from: new Date(now.getFullYear(), now.getMonth() - 1, 1), to: new Date(now.getFullYear(), now.getMonth(), 0) };
    },
  },
  {
    label: "Last 30 Days",
    range: () => {
      const now = new Date();
      return { from: new Date(now.getTime() - 29 * 86400000), to: now };
    },
  },
];

function DistributorBillingPage() {
  const thisMonth = presets[0].range();
  const [from, setFrom] = useState(toDateInputValue(thisMonth.from));
  const [to, setTo] = useState(toDateInputValue(thisMonth.to));
  const [data, setData] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBilling = useCallback(async (fromStr: string, toStr: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        from: localDayBoundary(fromStr, "start").toISOString(),
        to: localDayBoundary(toStr, "end").toISOString(),
      });
      const res = await apiClient.get(`/distributor/billing?${params.toString()}`);
      if (res.success) setData(res.data);
    } catch (err: any) {
      toast.error("Failed to load billing data", { description: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBilling(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (range: { from: Date; to: Date }) => {
    const f = toDateInputValue(range.from);
    const t = toDateInputValue(range.to);
    setFrom(f);
    setTo(t);
    fetchBilling(f, t);
  };

  const cols: Column<ConnectorBillingRow>[] = [
    {
      key: "name",
      header: "Connector Dealer",
      sortable: true,
      accessor: (r) => `${r.name} (${r.code}, ${r.city}, ${r.state})`,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-xs md:text-sm">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.code} • {r.city}, {r.state}</div>
          </div>
        </div>
      ),
    },
    {
      key: "androidUsed",
      header: "Android Units",
      className: "text-right",
      sortable: true,
      accessor: (r) => `${r.androidUsed} devices (${fmtInr(r.androidAmount)})`,
      render: (r) => (
        <div className="text-right text-xs space-y-0.5">
          <div className="font-bold text-foreground">{r.androidUsed.toLocaleString()} devices</div>
          <div className="text-muted-foreground font-mono">{fmtInr(r.androidAmount)}</div>
        </div>
      ),
    },
    {
      key: "iosUsed",
      header: "iOS Units",
      className: "text-right",
      sortable: true,
      accessor: (r) => `${r.iosUsed} devices (${fmtInr(r.iosAmount)})`,
      render: (r) => (
        <div className="text-right text-xs space-y-0.5">
          <div className="font-bold text-foreground">{r.iosUsed.toLocaleString()} devices</div>
          <div className="text-muted-foreground font-mono">{fmtInr(r.iosAmount)}</div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Invoice Subtotal",
      className: "text-right",
      sortable: true,
      accessor: (r) => fmtInr(r.amount),
      render: (r) => (
        <span className="font-mono font-bold text-foreground text-xs md:text-sm bg-muted/40 px-2 py-1 rounded-md border border-border/80">
          {fmtInr(r.amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Distributor Settlement & Billing"
        description="Calculate connector dealer enrollment consumption and invoice charges over billing cycles."
        breadcrumbs={[{ label: "Portal", to: "/distributor" }, { label: "Billing" }]}
      />

      {/* Date Filter & Presets Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            />
            <span className="text-muted-foreground/50">to</span>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            />
          </div>
          <Button
            size="sm"
            onClick={() => fetchBilling(from, to)}
            disabled={loading}
            className="h-8.5 text-xs font-semibold shadow-xs"
          >
            {loading && <RefreshCw className="h-3 w-3 animate-spin mr-1.5" />}
            Calculate Invoice
          </Button>

          <div className="hidden h-5 w-px bg-border/80 sm:block" />

          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <Button
                key={p.label}
                size="sm"
                variant="outline"
                className="h-8 text-xs font-medium border-border/80 hover:bg-muted"
                onClick={() => applyPreset(p.range())}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Billing Totals */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Android Devices Billed"
          value={data ? data.totals.androidUsed.toLocaleString() : loading ? "—" : "0"}
          sub={data ? `@ ${fmtInr(data.rates.android)} per unit fee` : undefined}
          icon={Smartphone}
          tone="primary"
        />
        <KpiCard
          label="iOS Devices Billed"
          value={data ? data.totals.iosUsed.toLocaleString() : loading ? "—" : "0"}
          sub={data ? `@ ${fmtInr(data.rates.ios)} per unit fee` : undefined}
          icon={Apple}
          tone="success"
        />
        <KpiCard
          label="Gross Invoice Total"
          value={data ? fmtInr(data.totals.amount) : loading ? "—" : fmtInr(0)}
          sub="All connector charges combined"
          icon={Wallet}
          tone="primary"
        />
      </div>

      <DataTable
        data={data?.connectors ?? []}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search connector dealers by name, code or city…"
        searchKeys={["name", "code", "city"]}
        emptyTitle="No usage in this billing period"
        emptyDescription="No connector store enrolled a financed device within the specified calendar interval."
      />
    </div>
  );
}
