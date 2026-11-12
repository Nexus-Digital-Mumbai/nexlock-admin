import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Store, Network, Smartphone, Apple, Eye, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { CrudModal, type FormField } from "@/components/nexlock/CrudModal";
import { DetailsDialog } from "@/components/nexlock/DetailsDialog";
import { Button } from "@/components/ui/button";
import { useCrudUi } from "@/lib/use-crud-ui";
import { apiClient } from "@/lib/api-client";

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
      // accessor: DataTable's CSV/PDF export can only read a plain value or a single flat
      // text node out of `render` — it can't walk a nested <div> tree, so without this the
      // export left this and the quota column blank.
      accessor: (r) => `${r.name} (${r.contact})`,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Store className="h-4 w-4" /></div>
          <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.contact}</div></div>
        </div>
      ),
    },
    { key: "city", header: "Location", render: (r) => <span>{r.city}, {r.state}</span> },
    {
      key: "androidEnrollmentLimit",
      header: "Quota (Used / Allocated)",
      className: "text-right",
      accessor: (r) => `Android ${r.androidUsed}/${r.androidEnrollmentLimit}, iOS ${r.iosUsed}/${r.iosEnrollmentLimit}`,
      render: (r) => (
        <div className="text-xs text-right">
          <div>{r.androidUsed} / {r.androidEnrollmentLimit} <span className="text-muted-foreground">Android</span></div>
          <div>{r.iosUsed} / {r.iosEnrollmentLimit} <span className="text-muted-foreground">iOS</span></div>
        </div>
      ),
    },
    { key: "createdAt", header: "Created", sortable: true, render: (r) => new Date(r.createdAt).toISOString().slice(0, 10) },
  ];

  const actions: RowAction<ConnectorRow>[] = [
    { label: "View", icon: Eye, onClick: (r) => ui.setViewRow(r) },
    { label: "Adjust Quota", icon: Settings2, onClick: (r) => ui.setEditRow(r) },
  ];

  return (
    <div>
      <PageHeader
        title="Distributor Portal"
        description={summary ? `${summary.name} · ${summary.code}` : "Manage your quota pool and connector dealers."}
        breadcrumbs={[{ label: "Home", to: "/distributor" }, { label: "Distributor Portal" }]}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => ui.setCreateOpen(true)}>
            <Plus className="h-4 w-4" />Create Connector Dealer
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard
          label="Android Pool"
          value={summary ? summary.android.pool.toLocaleString() : "—"}
          sub={summary ? `${summary.android.ownUsed} used by you` : undefined}
          icon={Smartphone}
        />
        <KpiCard
          label="Android Remaining"
          value={summary ? summary.android.remaining.toLocaleString() : "—"}
          sub={summary ? `${summary.android.allocatedToConnectors} allocated to connectors` : undefined}
          icon={Network}
          tone={summary && summary.android.remaining <= 0 ? "danger" : "success"}
        />
        <KpiCard
          label="Android Keys Used by Connectors"
          value={summary ? summary.android.usedByConnectors.toLocaleString() : "—"}
          sub={summary ? `of ${summary.android.allocatedToConnectors.toLocaleString()} allocated` : undefined}
          icon={Store}
        />
        <KpiCard
          label="iOS Pool"
          value={summary ? summary.ios.pool.toLocaleString() : "—"}
          sub={summary ? `${summary.ios.ownUsed} used by you` : undefined}
          icon={Apple}
        />
        <KpiCard
          label="iOS Remaining"
          value={summary ? summary.ios.remaining.toLocaleString() : "—"}
          sub={summary ? `${summary.ios.allocatedToConnectors} allocated to connectors` : undefined}
          icon={Network}
          tone={summary && summary.ios.remaining <= 0 ? "danger" : "success"}
        />
        <KpiCard
          label="iOS Keys Used by Connectors"
          value={summary ? summary.ios.usedByConnectors.toLocaleString() : "—"}
          sub={summary ? `of ${summary.ios.allocatedToConnectors.toLocaleString()} allocated` : undefined}
          icon={Store}
        />
      </div>

      <DataTable
        data={connectors}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search connector dealers by name, city…"
        searchKeys={["name", "city", "contact"]}
        rowActions={actions}
        emptyTitle="No connector dealers yet"
        emptyDescription="Create a connector dealer to hand out part of your quota pool to them."
        emptyAction={<Button size="sm" onClick={() => ui.setCreateOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Create Connector Dealer</Button>}
      />

      <CrudModal<any>
        open={ui.createOpen}
        onOpenChange={ui.setCreateOpen}
        title="Create Connector Dealer"
        description="Allocates part of your quota pool to a new dealer you manage."
        fields={createFields}
        onSubmit={onCreateConnector}
        submitLabel="Create Connector Dealer"
      />

      <CrudModal<any>
        open={!!ui.editRow}
        onOpenChange={(o) => !o && ui.setEditRow(null)}
        title="Adjust Connector Quota"
        description={ui.editRow?.name}
        fields={quotaFields}
        initial={ui.editRow ?? undefined}
        mode="edit"
        onSubmit={onAdjustQuota}
      />

      <DetailsDialog
        open={!!ui.viewRow}
        onOpenChange={(o) => !o && ui.setViewRow(null)}
        title={ui.viewRow?.name ?? ""}
        subtitle={ui.viewRow?.code}
        fields={ui.viewRow ? [
          { label: "Contact Person", value: ui.viewRow.contact },
          { label: "Email", value: ui.viewRow.email },
          { label: "Phone", value: ui.viewRow.phone },
          { label: "Location", value: `${ui.viewRow.city}, ${ui.viewRow.state}` },
          { label: "Android Quota", value: `${ui.viewRow.androidUsed.toLocaleString()} used / ${ui.viewRow.androidEnrollmentLimit.toLocaleString()} allocated` },
          { label: "iOS Quota", value: `${ui.viewRow.iosUsed.toLocaleString()} used / ${ui.viewRow.iosEnrollmentLimit.toLocaleString()} allocated` },
          { label: "Status", value: ui.viewRow.status },
        ] : []}
        footer={ui.viewRow && (
          <>
            <Button variant="outline" size="sm" onClick={() => ui.setViewRow(null)}>Close</Button>
            <Button size="sm" onClick={() => { const r = ui.viewRow!; ui.setViewRow(null); ui.setEditRow(r); }}>
              <Settings2 className="mr-1.5 h-4 w-4" />Adjust Quota
            </Button>
          </>
        )}
      />
    </div>
  );
}
