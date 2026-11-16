import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Store,
  Network,
  Smartphone,
  Apple,
  Eye,
  Settings2,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Cpu,
  BarChart3,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { CrudModal, type FormField } from "@/components/nexlock/CrudModal";
import { DetailsDialog } from "@/components/nexlock/DetailsDialog";
import { StatusBadge } from "@/components/nexlock/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCrudUi } from "@/lib/use-crud-ui";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/distributor")({
  head: () => ({ meta: [{ title: "Distributor Portal — NexLock" }] }),
  component: DistributorPage,
});

interface PlatformPool {
  pool: number;
  ownUsed: number;
  allocatedToConnectors: number;
  usedByConnectors: number;
  remaining: number;
}

interface Summary {
  id: string;
  name: string;
  code: string;
  android: PlatformPool;
  ios: PlatformPool;
}

interface ConnectorRow {
  id: string;
  code: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  androidEnrollmentLimit: number;
  iosEnrollmentLimit: number;
  androidUsed: number;
  iosUsed: number;
  status: string;
  createdAt: string;
}

const createFields: FormField[] = [
  { name: "name", label: "Dealer Name", required: true, section: "Business" },
  { name: "contact", label: "Contact Person", required: true, section: "Business" },
  { name: "email", label: "Business Email", type: "email", required: true, section: "Business" },
  { name: "phone", label: "Business Phone", type: "tel", required: true, section: "Business" },
  { name: "city", label: "City", required: true, section: "Location" },
  { name: "state", label: "State Code", required: true, placeholder: "MH", section: "Location" },
  { name: "androidEnrollmentLimit", label: "Android Quota to Allocate", type: "number", required: true, placeholder: "0", section: "Quota" },
  { name: "iosEnrollmentLimit", label: "iOS Quota to Allocate", type: "number", required: true, placeholder: "0", section: "Quota" },
  { name: "staffEmail", label: "Dealer App Login Email", type: "email", required: true, section: "Dealer App Login" },
  { name: "staffPassword", label: "Dealer App Login Password", type: "password", required: true, section: "Dealer App Login" },
];

const quotaFields: FormField[] = [
  { name: "androidEnrollmentLimit", label: "Android Quota", type: "number", required: true, section: "Quota" },
  { name: "iosEnrollmentLimit", label: "iOS Quota", type: "number", required: true, section: "Quota" },
];

function DistributorPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [connectors, setConnectors] = useState<ConnectorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const ui = useCrudUi<ConnectorRow>();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, connectorsRes] = await Promise.all([
        apiClient.get("/distributor/summary"),
        apiClient.get("/distributor/connectors"),
      ]);
      if (summaryRes.success) setSummary(summaryRes.data);
      if (connectorsRes.success) setConnectors(connectorsRes.data);
    } catch (err: any) {
      toast.error("Failed to load distributor data", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onCreateConnector = async (v: any) => {
    try {
      const res = await apiClient.post("/distributor/connectors", {
        name: v.name,
        contact: v.contact,
        email: v.email,
        phone: v.phone,
        city: v.city,
        state: v.state,
        androidEnrollmentLimit: Number(v.androidEnrollmentLimit) || 0,
        iosEnrollmentLimit: Number(v.iosEnrollmentLimit) || 0,
        staffEmail: v.staffEmail,
        staffPassword: v.staffPassword,
      });
      if (res.success) {
        toast.success("Connector dealer created", { description: v.name });
        ui.setCreateOpen(false);
        fetchAll();
      }
    } catch (err: any) {
      toast.error("Failed to create connector dealer", { description: err.message });
    }
  };

  const onAdjustQuota = async (v: any) => {
    if (!ui.editRow) return;
    try {
      const res = await apiClient.patch(`/distributor/connectors/${ui.editRow.id}/quota`, {
        androidEnrollmentLimit: Number(v.androidEnrollmentLimit) || 0,
        iosEnrollmentLimit: Number(v.iosEnrollmentLimit) || 0,
      });
      if (res.success) {
        toast.success("Quota updated", { description: ui.editRow.name });
        ui.setEditRow(null);
        fetchAll();
      }
    } catch (err: any) {
      toast.error("Failed to update quota", { description: err.message });
    }
  };

  const cols: Column<ConnectorRow>[] = [
    {
      key: "name",
      header: "Connector Dealer",
      sortable: true,
      accessor: (r) => `${r.name} (${r.contact})`,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Store className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-sm tracking-tight truncate">{r.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span>{r.contact}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="font-mono text-[11px] text-primary">{r.code}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "Location",
      render: (r) => (
        <div className="flex items-center gap-1.5 text-xs text-foreground/90">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
          <span>{r.city}, <span className="font-semibold uppercase">{r.state}</span></span>
        </div>
      ),
    },
    {
      key: "androidEnrollmentLimit",
      header: "Quota Allocation & Usage",
      className: "text-right",
      accessor: (r) => `Android ${r.androidUsed}/${r.androidEnrollmentLimit}, iOS ${r.iosUsed}/${r.iosEnrollmentLimit}`,
      render: (r) => {
        const androidPct = r.androidEnrollmentLimit > 0 ? Math.min(100, Math.round((r.androidUsed / r.androidEnrollmentLimit) * 100)) : 0;
        const iosPct = r.iosEnrollmentLimit > 0 ? Math.min(100, Math.round((r.iosUsed / r.iosEnrollmentLimit) * 100)) : 0;
        return (
          <div className="space-y-1.5 text-right text-xs">
            <div className="flex items-center justify-end gap-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Smartphone className="h-3 w-3 text-emerald-500" /> Android:
              </span>
              <span className="font-mono font-medium text-foreground">
                {r.androidUsed} <span className="text-muted-foreground/70">/</span> {r.androidEnrollmentLimit}
              </span>
              <span className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-mono font-semibold",
                androidPct >= 90 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
              )}>
                {androidPct}%
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Apple className="h-3 w-3 text-sky-500" /> iOS:
              </span>
              <span className="font-mono font-medium text-foreground">
                {r.iosUsed} <span className="text-muted-foreground/70">/</span> {r.iosEnrollmentLimit}
              </span>
              <span className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px] font-mono font-semibold",
                iosPct >= 90 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
              )}>
                {iosPct}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status || "active"} />,
    },
    {
      key: "createdAt",
      header: "Enrolled On",
      sortable: true,
      render: (r) => (
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(r.createdAt).toISOString().slice(0, 10)}
        </span>
      ),
    },
  ];

  const actions: RowAction<ConnectorRow>[] = [
    { label: "View Details", icon: Eye, onClick: (r) => ui.setViewRow(r) },
    { label: "Adjust Quota", icon: Settings2, onClick: (r) => ui.setEditRow(r) },
  ];

  // Calculate overall pool usage percentages
  const androidAllocatedPct = summary && summary.android.pool > 0
    ? Math.min(100, Math.round(((summary.android.ownUsed + summary.android.allocatedToConnectors) / summary.android.pool) * 100))
    : 0;

  const iosAllocatedPct = summary && summary.ios.pool > 0
    ? Math.min(100, Math.round(((summary.ios.ownUsed + summary.ios.allocatedToConnectors) / summary.ios.pool) * 100))
    : 0;

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Distributor Operations Portal"
        description={
          summary
            ? `Master Quota Allocation & Connector Network • ${summary.name} (${summary.code})`
            : "Manage your master quota pool and sub-dealer connector network."
        }
        breadcrumbs={[{ label: "Home", to: "/distributor" }, { label: "Distributor Portal" }]}
        actions={
          <Button size="sm" className="gap-2 shadow-sm" onClick={() => ui.setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Connector Dealer
          </Button>
        }
      />

      {/* Pool Utilization Highlight Bar */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-surface rounded-2xl border border-border/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Android Master Pool</h4>
                  <div className="text-base font-bold text-foreground">
                    {summary.android.pool.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">Keys Total</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-500">{androidAllocatedPct}% Committed</div>
                <div className="text-[11px] text-muted-foreground">{summary.android.remaining.toLocaleString()} Available</div>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${androidAllocatedPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Used by You: <strong className="text-foreground font-mono">{summary.android.ownUsed}</strong></span>
              <span>Allocated to Connectors: <strong className="text-foreground font-mono">{summary.android.allocatedToConnectors}</strong></span>
              <span>Connector Active: <strong className="text-foreground font-mono">{summary.android.usedByConnectors}</strong></span>
            </div>
          </div>

          <div className="card-surface rounded-2xl border border-border/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                  <Apple className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">iOS Master Pool</h4>
                  <div className="text-base font-bold text-foreground">
                    {summary.ios.pool.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">Keys Total</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-sky-500">{iosAllocatedPct}% Committed</div>
                <div className="text-[11px] text-muted-foreground">{summary.ios.remaining.toLocaleString()} Available</div>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${iosAllocatedPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Used by You: <strong className="text-foreground font-mono">{summary.ios.ownUsed}</strong></span>
              <span>Allocated to Connectors: <strong className="text-foreground font-mono">{summary.ios.allocatedToConnectors}</strong></span>
              <span>Connector Active: <strong className="text-foreground font-mono">{summary.ios.usedByConnectors}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <KpiCard
          label="Android Master Pool"
          value={summary ? summary.android.pool.toLocaleString() : "—"}
          sub={summary ? `${summary.android.ownUsed} used by direct store` : undefined}
          icon={Smartphone}
        />
        <KpiCard
          label="Android Available"
          value={summary ? summary.android.remaining.toLocaleString() : "—"}
          sub={summary ? `${summary.android.allocatedToConnectors} allocated to connectors` : undefined}
          icon={Network}
          tone={summary && summary.android.remaining <= 0 ? "danger" : "success"}
        />
        <KpiCard
          label="Android Connector Used"
          value={summary ? summary.android.usedByConnectors.toLocaleString() : "—"}
          sub={summary ? `of ${summary.android.allocatedToConnectors.toLocaleString()} allocated` : undefined}
          icon={Store}
        />
        <KpiCard
          label="iOS Master Pool"
          value={summary ? summary.ios.pool.toLocaleString() : "—"}
          sub={summary ? `${summary.ios.ownUsed} used by direct store` : undefined}
          icon={Apple}
        />
        <KpiCard
          label="iOS Available"
          value={summary ? summary.ios.remaining.toLocaleString() : "—"}
          sub={summary ? `${summary.ios.allocatedToConnectors} allocated to connectors` : undefined}
          icon={Network}
          tone={summary && summary.ios.remaining <= 0 ? "danger" : "success"}
        />
        <KpiCard
          label="iOS Connector Used"
          value={summary ? summary.ios.usedByConnectors.toLocaleString() : "—"}
          sub={summary ? `of ${summary.ios.allocatedToConnectors.toLocaleString()} allocated` : undefined}
          icon={Store}
        />
      </div>

      {/* Connector Dealers Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Managed Connector Dealers</h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {connectors.length}
            </span>
          </div>
        </div>

        <DataTable
          data={connectors}
          columns={cols}
          rowKey={(r) => r.id}
          loading={loading}
          searchPlaceholder="Search connector dealers by store name, contact, city…"
          searchKeys={["name", "city", "contact", "code"]}
          rowActions={actions}
          emptyTitle="No connector dealers registered"
          emptyDescription="Deploy your quota pool to authorized connector dealers across your distribution region."
          emptyAction={
            <Button size="sm" onClick={() => ui.setCreateOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Create Connector Dealer
            </Button>
          }
        />
      </div>

      {/* Create Connector Modal */}
      <CrudModal<any>
        open={ui.createOpen}
        onOpenChange={ui.setCreateOpen}
        title="Register New Connector Dealer"
        description="Allocates license quota from your master pool to an authorized partner store."
        fields={createFields}
        onSubmit={onCreateConnector}
        submitLabel="Create Connector Dealer"
      />

      {/* Adjust Quota Modal */}
      <CrudModal<any>
        open={!!ui.editRow}
        onOpenChange={(o) => !o && ui.setEditRow(null)}
        title="Adjust Connector License Quota"
        description={`Modify license allocation boundaries for ${ui.editRow?.name} (${ui.editRow?.code})`}
        fields={quotaFields}
        initial={ui.editRow ?? undefined}
        mode="edit"
        onSubmit={onAdjustQuota}
        submitLabel="Save Quota Allocation"
      />

      {/* Connector Details Dialog */}
      <DetailsDialog
        open={!!ui.viewRow}
        onOpenChange={(o) => !o && ui.setViewRow(null)}
        title={ui.viewRow?.name ?? ""}
        subtitle={ui.viewRow ? `Connector Code: ${ui.viewRow.code} • ${ui.viewRow.city}, ${ui.viewRow.state}` : ""}
        fields={
          ui.viewRow
            ? [
                { label: "Contact Person", value: ui.viewRow.contact },
                { label: "Business Email", value: ui.viewRow.email },
                { label: "Phone Number", value: ui.viewRow.phone },
                { label: "Store Location", value: `${ui.viewRow.city}, ${ui.viewRow.state}` },
                {
                  label: "Android Quota Utilization",
                  value: `${ui.viewRow.androidUsed.toLocaleString()} active devices / ${ui.viewRow.androidEnrollmentLimit.toLocaleString()} allocated keys`,
                },
                {
                  label: "iOS Quota Utilization",
                  value: `${ui.viewRow.iosUsed.toLocaleString()} active devices / ${ui.viewRow.iosEnrollmentLimit.toLocaleString()} allocated keys`,
                },
                { label: "Connector Status", value: ui.viewRow.status },
              ]
            : []
        }
        footer={
          ui.viewRow && (
            <>
              <Button variant="outline" size="sm" onClick={() => ui.setViewRow(null)}>
                Close
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  const r = ui.viewRow!;
                  ui.setViewRow(null);
                  ui.setEditRow(r);
                }}
              >
                <Settings2 className="h-4 w-4" />
                Adjust Quota
              </Button>
            </>
          )
        }
      />
    </div>
  );
}
