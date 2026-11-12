import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Smartphone, Apple, Wallet, Store } from "lucide-react";
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

// `<input type="date">` gives a bare "YYYY-MM-DD" string that `new Date(...)` parses as UTC
// midnight, not local midnight — the same off-by-almost-a-day gotcha already fixed in
// analytics.tsx's localDayBoundary. Mirrored here rather than shared since each file owns its
// own tiny date-filter state and this is the only place either needs it.
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
      // accessor: DataTable's CSV/PDF export can only read a plain value or a single flat
      // text node out of `render` — it can't walk a nested <div> tree, so without this every
      // multi-line cell (this one, Android, iOS below) exported blank, leaving only the
      // single-<span> "Bill Amount" column with real data in the export.
      accessor: (r) => `${r.name} (${r.code}, ${r.city}, ${r.state})`,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Store className="h-4 w-4" /></div>
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.code} · {r.city}, {r.state}</div>
          </div>
        </div>
      ),
    },
    {
      key: "androidUsed",
      header: "Android",
      className: "text-right",
      sortable: true,
      accessor: (r) => `${r.androidUsed} devices (${fmtInr(r.androidAmount)})`,
      render: (r) => (
        <div className="text-right text-xs">
          <div className="font-medium text-foreground">{r.androidUsed.toLocaleString()} devices</div>
          <div className="text-muted-foreground">{fmtInr(r.androidAmount)}</div>
        </div>
      ),
    },
    {
      key: "iosUsed",
      header: "iOS",
      className: "text-right",
      sortable: true,
      accessor: (r) => `${r.iosUsed} devices (${fmtInr(r.iosAmount)})`,
      render: (r) => (
        <div className="text-right text-xs">
          <div className="font-medium text-foreground">{r.iosUsed.toLocaleString()} devices</div>
          <div className="text-muted-foreground">{fmtInr(r.iosAmount)}</div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Bill Amount",
      className: "text-right",
      sortable: true,
      accessor: (r) => fmtInr(r.amount),
      render: (r) => <span className="font-semibold text-foreground">{fmtInr(r.amount)}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Billing"
        description="What each connector owes for devices they enrolled in the selected period."
        breadcrumbs={[{ label: "Home", to: "/distributor" }, { label: "Billing" }]}
      />

      {/* Filters — one row, above everything they scope, date range first, matching the
          dataviz skill's filter composition rule (same layout as /analytics). */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
          />
          <span>to</span>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-sm text-foreground"
          />
        </div>
        <Button size="sm" onClick={() => fetchBilling(from, to)} disabled={loading}>Apply</Button>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <Button key={p.label} size="sm" variant="outline" onClick={() => applyPreset(p.range())}>{p.label}</Button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          label="Android Devices Billed"
          value={data ? data.totals.androidUsed.toLocaleString() : loading ? "—" : "0"}
          sub={data ? `@ ${fmtInr(data.rates.android)}/device` : undefined}
          icon={Smartphone}
        />
        <KpiCard
          label="iOS Devices Billed"
          value={data ? data.totals.iosUsed.toLocaleString() : loading ? "—" : "0"}
          sub={data ? `@ ${fmtInr(data.rates.ios)}/device` : undefined}
          icon={Apple}
        />
        <KpiCard
          label="Total Bill"
          value={data ? fmtInr(data.totals.amount) : loading ? "—" : fmtInr(0)}
          icon={Wallet}
        />
      </div>

      <DataTable
        data={data?.connectors ?? []}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search connector dealers…"
        searchKeys={["name", "code", "city"]}
        emptyTitle="No usage in this period"
        emptyDescription="No connector enrolled a device in the selected date range."
      />
    </div>
  );
}
