import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Store, Building2, CheckCircle2, Eye, Pencil, Ban, Play, Trash2, Network, AlertTriangle, Layers, PauseCircle, Sparkles, X } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { StatusBadge } from "@/components/nexlock/StatusBadge";
import { CrudModal, type FormField } from "@/components/nexlock/CrudModal";
import { ConfirmDialog } from "@/components/nexlock/ConfirmDialog";
import { DetailsDialog } from "@/components/nexlock/DetailsDialog";
import { Button } from "@/components/ui/button";
import { useCrudUi } from "@/lib/use-crud-ui";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/dealers")({
  head: () => ({ meta: [{ title: "Dealers — Nexus Console" }] }),
  component: DealersPage,
});

type DealerStatus = "active" | "suspended" | "pending";
interface DealerRow {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  androidEnrollmentLimit: number;
  iosEnrollmentLimit: number;
  androidEnrolledCount: number;
  iosEnrolledCount: number;
  androidAllocatedToConnectors: number;
  iosAllocatedToConnectors: number;
  status: DealerStatus;
  joined: string;
  isDistributor: boolean;
  distributorId: string | null;
  enabledFeatures: string[];
}

const DEALER_FEATURE_KEYS = ["WALLPAPER_OVERLAY", "ALARM"] as const;
const featureFields: FormField[] = [
  {
    name: "feature_WALLPAPER_OVERLAY",
    label: "Wallpaper Overlay Message",
    type: "switch",
    helper: "A non-removable, persistent on-screen payment-overdue message. Does not lock the device.",
  },
  {
    name: "feature_ALARM",
    label: "Alarm / Buzzer",
    type: "switch",
    helper: "A loud 90-second buzzer that bypasses silent and vibrate mode.",
  },
];

const MAX_DISTRIBUTOR_DEPTH = 3;

function getDistributorDepth(row: DealerRow, allRows: DealerRow[]): number {
  let depth = 0;
  let currentId = row.distributorId;
  const visited = new Set<string>();
  while (currentId && !visited.has(currentId) && depth <= MAX_DISTRIBUTOR_DEPTH) {
    visited.add(currentId);
    depth += 1;
    currentId = allRows.find((r) => r.id === currentId)?.distributorId ?? null;
  }
  return depth;
}

const createFields: FormField[] = [
  { name: "name", label: "Dealer Name", required: true, section: "Business" },
  { name: "contact", label: "Contact Person", required: true, section: "Business" },
  { name: "email", label: "Business Email", type: "email", required: true, section: "Business" },
  { name: "phone", label: "Business Phone", type: "tel", required: true, section: "Business" },
  { name: "city", label: "City", required: true, section: "Location" },
  { name: "state", label: "State Code", required: true, placeholder: "MH", section: "Location" },
  { name: "androidEnrollmentLimit", label: "Android Enrollment Limit", type: "number", required: true, placeholder: "500", section: "Quota" },
  { name: "iosEnrollmentLimit", label: "iOS Enrollment Limit", type: "number", required: true, placeholder: "0", section: "Quota" },
  { name: "staffEmail", label: "Dealer App Login Email", type: "email", required: true, section: "Dealer App Login" },
  { name: "staffPassword", label: "Dealer App Login Password", type: "password", required: true, section: "Dealer App Login" },
];

const editFields: FormField[] = [
  { name: "name", label: "Dealer Name", required: true, section: "Business" },
  { name: "contact", label: "Contact Person", required: true, section: "Business" },
  { name: "email", label: "Business Email", type: "email", required: true, section: "Business" },
  { name: "phone", label: "Business Phone", type: "tel", required: true, section: "Business" },
  { name: "city", label: "City", required: true, section: "Location" },
  { name: "state", label: "State Code", required: true, placeholder: "MH", section: "Location" },
  { name: "androidEnrollmentLimit", label: "Android Enrollment Limit", type: "number", required: true, section: "Quota" },
  { name: "iosEnrollmentLimit", label: "iOS Enrollment Limit", type: "number", required: true, section: "Quota" },
  {
    name: "status", label: "Status", type: "select", required: true, section: "Onboarding",
    options: [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending KYC" },
      { value: "suspended", label: "Suspended" },
    ],
  },
];

function DealersPage() {
  const [items, setItems] = useState<DealerRow[]>([]);
  const [zeroEnrollmentOnly, setZeroEnrollmentOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const ui = useCrudUi<DealerRow>();

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/dealers?limit=1000");
      if (res.success) {
        const mapped = res.data.map((d: any) => ({
          id: d.id,
          name: d.name,
          contact: d.contact,
          email: d.email,
          phone: d.phone,
          city: d.city,
          state: d.state,
          androidEnrollmentLimit: d.androidEnrollmentLimit ?? 0,
          iosEnrollmentLimit: d.iosEnrollmentLimit ?? 0,
          androidEnrolledCount: d.androidEnrolledCount ?? 0,
          iosEnrolledCount: d.iosEnrolledCount ?? 0,
          androidAllocatedToConnectors: d.androidAllocatedToConnectors ?? 0,
          iosAllocatedToConnectors: d.iosAllocatedToConnectors ?? 0,
          status: d.status as DealerStatus,
          joined: new Date(d.createdAt).toISOString().slice(0, 10),
          isDistributor: d.isDistributor ?? false,
          distributorId: d.distributorId ?? null,
          enabledFeatures: d.enabledFeatures ?? [],
        }));
        setItems(mapped);
      }
    } catch (err: any) {
      toast.error("Failed to load dealers", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const onCreate = async (v: any) => {
    try {
      const payload = {
        name: v.name,
        contact: v.contact,
        email: v.email,
        phone: v.phone,
        city: v.city,
        state: v.state,
        status: "pending",
        androidEnrollmentLimit: Number(v.androidEnrollmentLimit) || 0,
        iosEnrollmentLimit: Number(v.iosEnrollmentLimit) || 0,
        staffEmail: v.staffEmail,
        staffPassword: v.staffPassword,
      };
      const res = await apiClient.post("/dealers", payload);
      if (res.success) {
        toast.success("Dealer onboarded", {
          description: `${res.data.name} added. Dealer app login: ${res.data.staffLogin?.email}`,
        });
        fetchDealers();
        ui.setCreateOpen(false);
      }
    } catch (err: any) {
      toast.error("Failed to onboard dealer", { description: err.message });
    }
  };

  const onEdit = async (v: any) => {
    if (!ui.editRow) return;
    try {
      const payload = {
        name: v.name,
        contact: v.contact,
        email: v.email,
        phone: v.phone,
        city: v.city,
        state: v.state,
        status: v.status,
        androidEnrollmentLimit: Number(v.androidEnrollmentLimit) || 0,
        iosEnrollmentLimit: Number(v.iosEnrollmentLimit) || 0,
      };
      const res = await apiClient.put(`/dealers/${ui.editRow.id}`, payload);
      if (res.success) {
        toast.success("Dealer updated");
        fetchDealers();
        ui.setEditRow(null);
      }
    } catch (err: any) {
      toast.error("Failed to update dealer", { description: err.message });
    }
  };

  const setStatus = async (row: DealerRow, status: DealerStatus) => {
    try {
      const action = status === "suspended" ? "suspend" : "activate";
      const res = await apiClient.patch(`/dealers/${row.id}/${action}`);
      if (res.success) {
        toast.success(`Dealer ${status === "suspended" ? "suspended" : "activated"}`, { description: row.name });
        fetchDealers();
      }
    } catch (err: any) {
      toast.error("Failed to update status", { description: err.message });
    }
  };

  const setDistributorStatus = async (row: DealerRow, isDistributor: boolean) => {
    try {
      const res = await apiClient.patch(`/dealers/${row.id}/distributor-status`, { isDistributor });
      if (res.success) {
        toast.success(isDistributor ? "Converted to distributor" : "Distributor status revoked", { description: row.name });
        fetchDealers();
      }
    } catch (err: any) {
      toast.error("Failed to update distributor status", { description: err.message });
    }
  };

  const [featuresRow, setFeaturesRow] = useState<DealerRow | null>(null);

  const onSetFeatures = async (v: any) => {
    if (!featuresRow) return;
    const enabledFeatures = DEALER_FEATURE_KEYS.filter((key) => v[`feature_${key}`]);
    try {
      const res = await apiClient.patch(`/dealers/${featuresRow.id}/features`, { enabledFeatures });
      if (res.success) {
        toast.success("Dealer features updated", { description: featuresRow.name });
        fetchDealers();
        setFeaturesRow(null);
      }
    } catch (err: any) {
      toast.error("Failed to update dealer features", { description: err.message });
    }
  };

  const removeDealer = async (id: string) => {
    try {
      const res = await apiClient.delete(`/dealers/${id}`);
      if (res.success) {
        toast.success("Dealer deleted");
        fetchDealers();
      }
    } catch (err: any) {
      toast.error("Failed to delete dealer", { description: err.message });
    }
  };

  const removeManyDealers = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => apiClient.delete(`/dealers/${id}`)));
      toast.success(`${ids.length} dealers deleted`);
      fetchDealers();
    } catch (err: any) {
      toast.error("Failed to delete all dealers", { description: err.message });
    }
  };

  const cols: Column<DealerRow>[] = [
    {
      key: "id",
      header: "Dealer ID",
      sortable: true,
      render: (r) => <span className="font-mono text-xs font-semibold text-muted-foreground">{r.id.slice(0, 8)}</span>,
    },
    {
      key: "name",
      header: "Dealer Name",
      sortable: true,
      accessor: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Store className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-foreground text-xs md:text-sm">{r.name}</span>
              {r.isDistributor && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <Network className="h-2.5 w-2.5" /> Distributor
                </span>
              )}
              {r.distributorId && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/80">
                  Connector
                </span>
              )}
              {r.androidEnrolledCount + r.iosEnrolledCount + r.androidAllocatedToConnectors + r.iosAllocatedToConnectors === 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground border border-warning/30">
                  <AlertTriangle className="h-2.5 w-2.5" /> Never enrolled
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{r.contact} • {r.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "Location",
      render: (r) => <span className="text-xs font-medium text-foreground">{r.city}, {r.state}</span>,
    },
    {
      key: "androidEnrollmentLimit",
      header: "Device Quota",
      className: "text-right",
      accessor: (r) => {
        const androidUsed = r.androidEnrolledCount + r.androidAllocatedToConnectors;
        const iosUsed = r.iosEnrolledCount + r.iosAllocatedToConnectors;
        return `${androidUsed}/${r.androidEnrollmentLimit} Android, ${iosUsed}/${r.iosEnrollmentLimit} iOS`;
      },
      render: (r) => {
        const androidUsed = r.androidEnrolledCount + r.androidAllocatedToConnectors;
        const iosUsed = r.iosEnrolledCount + r.iosAllocatedToConnectors;
        const androidLeft = r.androidEnrollmentLimit - androidUsed;
        const iosLeft = r.iosEnrollmentLimit - iosUsed;
        return (
          <div className="text-xs text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5">
              <span className="font-semibold text-foreground">{androidUsed}/{r.androidEnrollmentLimit}</span>
              <span className="text-muted-foreground">Android</span>
              <span className={`font-semibold ${androidLeft <= 0 ? "text-destructive" : "text-emerald-500"}`}>
                ({androidLeft} left)
              </span>
            </div>
            {r.iosEnrollmentLimit > 0 && (
              <div className="flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">{iosUsed}/{r.iosEnrollmentLimit}</span>
                <span>iOS</span>
                <span className={`font-semibold ${iosLeft <= 0 ? "text-destructive" : "text-emerald-500"}`}>
                  ({iosLeft} left)
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "joined", header: "Onboarded", sortable: true },
  ];

  const actions: RowAction<DealerRow>[] = [
    { label: "View Details", icon: Eye, onClick: (r) => ui.setViewRow(r) },
    { label: "Edit Dealer", icon: Pencil, onClick: (r) => ui.setEditRow(r) },
    { label: "Manage Features", icon: Sparkles, onClick: (r) => setFeaturesRow(r) },
    { label: "Suspend Dealer", icon: Ban, onClick: (r) => setStatus(r, "suspended"), show: (r) => r.status !== "suspended" },
    { label: "Activate Dealer", icon: Play, onClick: (r) => setStatus(r, "active"), show: (r) => r.status !== "active" },
    {
      label: "Convert to Distributor",
      icon: Network,
      onClick: (r) => setDistributorStatus(r, true),
      show: (r) => !r.isDistributor && getDistributorDepth(r, items) < MAX_DISTRIBUTOR_DEPTH - 1,
      separatorBefore: true,
    },
    {
      label: "Revoke Distributor Status",
      icon: Network,
      onClick: (r) => setDistributorStatus(r, false),
      show: (r) => r.isDistributor,
    },
    { label: "Delete Dealer", icon: Trash2, onClick: (r) => ui.setDeleteRow(r), destructive: true, separatorBefore: true },
  ];

  const counts = {
    total: items.length,
    active: items.filter((d) => d.status === "active").length,
    pending: items.filter((d) => d.status === "pending").length,
  };

  const zeroEnrollmentDealers = items.filter(
    (d) => d.androidEnrolledCount + d.iosEnrolledCount + d.androidAllocatedToConnectors + d.iosAllocatedToConnectors === 0
  );
  const totalQuotaAllocated = items.reduce((sum, d) => sum + d.androidEnrollmentLimit + d.iosEnrollmentLimit, 0);
  const idleQuota = zeroEnrollmentDealers.reduce((sum, d) => sum + d.androidEnrollmentLimit + d.iosEnrollmentLimit, 0);
  const visibleItems = zeroEnrollmentOnly ? zeroEnrollmentDealers : items;

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Dealer Network"
        description="Onboard retail partner locations, allocate enrollment quotas, and configure feature policies."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "Dealers" }]}
        actions={
          <Button size="sm" className="h-9 gap-1.5 text-xs font-semibold shadow-xs" onClick={() => ui.setCreateOpen(true)}>
            <Plus className="h-4 w-4" />Onboard Dealer
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Total Dealers" value={counts.total.toString()} icon={Store} tone="primary" />
        <KpiCard label="Active Partners" value={counts.active.toString()} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending KYC" value={counts.pending.toString()} icon={Building2} tone="warning" />
        <button
          type="button"
          onClick={() => setZeroEnrollmentOnly((v) => !v)}
          className={`text-left rounded-xl transition-all cursor-pointer ${
            zeroEnrollmentOnly ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
          }`}
          title={zeroEnrollmentOnly ? "Click to clear filter" : "Filter to zero-enrollment dealers"}
        >
          <KpiCard label="Zero Activity" value={zeroEnrollmentDealers.length.toString()} icon={AlertTriangle} tone="warning" />
        </button>
        <KpiCard label="Total Quota" value={totalQuotaAllocated.toLocaleString()} icon={Layers} tone="primary" />
        <KpiCard label="Idle Quota" value={idleQuota.toLocaleString()} icon={PauseCircle} tone="warning" />
      </div>

      {zeroEnrollmentOnly && (
        <div className="flex items-center justify-between rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs text-warning-foreground animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <span className="font-semibold">Filtered: Showing dealers with zero device enrollments ({zeroEnrollmentDealers.length})</span>
          </div>
          <button
            type="button"
            onClick={() => setZeroEnrollmentOnly(false)}
            className="inline-flex items-center gap-1 font-bold underline hover:no-underline cursor-pointer"
          >
            <X className="h-3 w-3" /> Clear filter
          </button>
        </div>
      )}

      <DataTable
        data={visibleItems}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search dealers by name, ID, contact, city…"
        searchKeys={["name", "id", "city", "contact", "email"]}
        rowActions={actions}
        onBulkDelete={(ids) => ui.setBulkDeleteIds(ids)}
        emptyTitle={zeroEnrollmentOnly ? "No zero-enrollment dealers" : "No dealers found"}
        emptyDescription={zeroEnrollmentOnly ? "Every dealer has active enrollments or assigned connector quotas." : "Onboard your first authorized dealer to begin allocating quotas."}
        emptyAction={<Button size="sm" onClick={() => ui.setCreateOpen(true)} className="gap-1.5"><Plus className="h-4 w-4" />Onboard Dealer</Button>}
      />

      <CrudModal<any>
        open={ui.createOpen}
        onOpenChange={ui.setCreateOpen}
        title="Onboard New Dealer"
        description="Creates the dealer store record and configures credentials for the Dealer mobile app."
        fields={createFields}
        onSubmit={onCreate}
        submitLabel="Onboard Dealer"
      />

      <CrudModal<any>
        open={!!ui.editRow}
        onOpenChange={(o) => !o && ui.setEditRow(null)}
        title="Edit Dealer Profile"
        description={ui.editRow?.name}
        fields={editFields}
        initial={ui.editRow ?? undefined}
        mode="edit"
        onSubmit={onEdit}
      />

      <CrudModal<any>
        open={!!featuresRow}
        onOpenChange={(o) => !o && setFeaturesRow(null)}
        title="Manage Dealer Feature Policies"
        description={featuresRow ? `Configure remote device actions permitted for ${featuresRow.name}.` : undefined}
        fields={featureFields}
        initial={
          featuresRow
            ? Object.fromEntries(DEALER_FEATURE_KEYS.map((key) => [`feature_${key}`, featuresRow.enabledFeatures.includes(key)]))
            : undefined
        }
        mode="edit"
        submitLabel="Save Policy Settings"
        onSubmit={onSetFeatures}
      />

      <DetailsDialog
        open={!!ui.viewRow}
        onOpenChange={(o) => !o && ui.setViewRow(null)}
        title={ui.viewRow?.name ?? "Dealer Details"}
        subtitle={`Dealer ID: ${ui.viewRow?.id}`}
        fields={ui.viewRow ? [
          { label: "Contact Person", value: ui.viewRow.contact },
          { label: "Operating Status", value: <StatusBadge status={ui.viewRow.status} /> },
          { label: "Email Address", value: ui.viewRow.email },
          { label: "Phone Number", value: ui.viewRow.phone },
          { label: "Store Location", value: `${ui.viewRow.city}, ${ui.viewRow.state}` },
          { label: "Onboarding Date", value: ui.viewRow.joined },
          { label: "Android Enrollment Limit", value: `${ui.viewRow.androidEnrollmentLimit.toLocaleString()} units` },
          { label: "iOS Enrollment Limit", value: `${ui.viewRow.iosEnrollmentLimit.toLocaleString()} units` },
          { label: "Active Features", value: ui.viewRow.enabledFeatures.length > 0 ? ui.viewRow.enabledFeatures.join(", ") : "Standard Lock Only", colSpan: 2 },
        ] : []}
        footer={ui.viewRow && (
          <>
            <Button variant="outline" size="sm" onClick={() => ui.setViewRow(null)}>Close</Button>
            <Button size="sm" onClick={() => { const r = ui.viewRow!; ui.setViewRow(null); ui.setEditRow(r); }}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit Profile
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!ui.deleteRow}
        onOpenChange={(o) => !o && ui.setDeleteRow(null)}
        title="Delete Dealer Location?"
        description={ui.deleteRow ? `The dealer "${ui.deleteRow.name}" and associated quota allocations will be permanently removed.` : ""}
        confirmLabel="Delete Dealer"
        onConfirm={() => { const r = ui.deleteRow!; removeDealer(r.id); ui.setDeleteRow(null); }}
      />

      <ConfirmDialog
        open={!!ui.bulkDeleteIds}
        onOpenChange={(o) => !o && ui.setBulkDeleteIds(null)}
        title={`Delete ${ui.bulkDeleteIds?.length ?? 0} dealers?`}
        description="All selected dealer profiles will be permanently removed from the Nexus system."
        confirmLabel="Delete All Selected"
        onConfirm={() => { const ids = ui.bulkDeleteIds!; removeManyDealers(ids); ui.setBulkDeleteIds(null); }}
      />
    </div>
  );
}
