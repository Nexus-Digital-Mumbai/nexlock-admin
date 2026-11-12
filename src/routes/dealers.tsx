import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Store, Building2, CheckCircle2, Eye, Pencil, Ban, Play, Trash2, Network, AlertTriangle, Layers, PauseCircle, Sparkles } from "lucide-react";
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
  head: () => ({ meta: [{ title: "Dealers — NexLock Admin" }] }),
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

// The full set of toggleable per-dealer feature keys — mirrors DEALER_FEATURE_KEYS in the
// backend's dealer.validator.ts. Opt-in only: not available to any dealer until chosen here.
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

// distributor -> connector -> sub-connector. Mirrors MAX_DISTRIBUTOR_DEPTH in
// dealer.service.ts — this is a display-only gate for the "Convert to Distributor" action; the
// backend re-enforces the same cap on the actual PATCH, so getting this out of sync only ever
// shows (or hides) the button incorrectly, it can't let a deeper chain actually get created.
const MAX_DISTRIBUTOR_DEPTH = 3;

// Walks distributorId pointers upward through the already-loaded dealer list to count how many
// levels deep this dealer already is (0 = not a connector of anyone). allRows must contain every
// ancestor for this to be accurate — true here since fetchDealers loads up to 1000 dealers in one
// shot, effectively "all of them" for any tenant this admin panel manages today.
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
    { key: "id", header: "Dealer ID", sortable: true, render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id.slice(0, 8)}</span> },
    {
      key: "name",
      header: "Dealer",
      sortable: true,
      // Export (CSV/PDF) and column search both fall back to flattening this column's rendered
      // JSX when there's no accessor — but this cell nests a name + badges + contact line three
      // divs deep, past what that generic flattening can reach, so both silently produced an
      // empty cell. accessor bypasses that entirely with the plain value it actually needs.
      accessor: (r) => r.name,
      render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Store className="h-4 w-4" /></div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{r.name}</span>
            {r.isDistributor && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                <Network className="h-2.5 w-2.5" /> Distributor
              </span>
            )}
            {r.distributorId && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Connector</span>
            )}
            {r.androidEnrolledCount + r.iosEnrolledCount + r.androidAllocatedToConnectors + r.iosAllocatedToConnectors === 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
                <AlertTriangle className="h-2.5 w-2.5" /> Never enrolled
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{r.contact}</div>
        </div>
      </div>
    )},
    { key: "city", header: "Location", render: (r) => <span>{r.city}, {r.state}</span> },
    {
      key: "androidEnrollmentLimit",
      header: "Device Quota",
      className: "text-right",
      // Same reason as the Dealer column's accessor above — this renders two nested lines
      // (Android + iOS, each with a "used/limit (left) · to connectors" breakdown), well past
      // what the generic export/search JSX-flattening can reach.
      accessor: (r) => {
        const androidUsed = r.androidEnrolledCount + r.androidAllocatedToConnectors;
        const iosUsed = r.iosEnrolledCount + r.iosAllocatedToConnectors;
        return `${androidUsed}/${r.androidEnrollmentLimit} Android, ${iosUsed}/${r.iosEnrollmentLimit} iOS`;
      },
      render: (r) => {
        // "Used" includes quota already handed to connector dealers, not just this dealer's own
        // enrolled devices — a distributor who's allocated 100 of their 500 to a connector but
        // enrolled 0 devices themselves previously showed as "0/500 used" here, which wrongly
        // implied all 500 were still free to give out. Mirrors the same total the backend's own
        // enrollment-quota check and DistributorService.getPoolState use.
        const androidUsed = r.androidEnrolledCount + r.androidAllocatedToConnectors;
        const iosUsed = r.iosEnrolledCount + r.iosAllocatedToConnectors;
        const androidLeft = r.androidEnrollmentLimit - androidUsed;
        const iosLeft = r.iosEnrollmentLimit - iosUsed;
        return (
          <div className="text-xs text-right">
            <div>
              {androidUsed}/{r.androidEnrollmentLimit} <span className="text-muted-foreground">Android</span>{" "}
              <span className={androidLeft <= 0 ? "text-red-500" : "text-emerald-500"}>({androidLeft} left)</span>
              {r.androidAllocatedToConnectors > 0 && (
                <span className="text-muted-foreground"> · {r.androidAllocatedToConnectors} to connectors</span>
              )}
            </div>
            <div>
              {iosUsed}/{r.iosEnrollmentLimit} <span className="text-muted-foreground">iOS</span>{" "}
              <span className={iosLeft <= 0 ? "text-red-500" : "text-emerald-500"}>({iosLeft} left)</span>
              {r.iosAllocatedToConnectors > 0 && (
                <span className="text-muted-foreground"> · {r.iosAllocatedToConnectors} to connectors</span>
              )}
            </div>
          </div>
        );
      },
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "joined", header: "Onboarded", sortable: true },
  ];

  const actions: RowAction<DealerRow>[] = [
    { label: "View", icon: Eye, onClick: (r) => ui.setViewRow(r) },
    { label: "Edit", icon: Pencil, onClick: (r) => ui.setEditRow(r) },
    { label: "Manage Features", icon: Sparkles, onClick: (r) => setFeaturesRow(r) },
    { label: "Suspend", icon: Ban, onClick: (r) => setStatus(r, "suspended"), show: (r) => r.status !== "suspended" },
    { label: "Activate", icon: Play, onClick: (r) => setStatus(r, "active"), show: (r) => r.status !== "active" },
    {
      label: "Convert to Distributor",
      icon: Network,
      onClick: (r) => setDistributorStatus(r, true),
      // Mirrors the backend's depth cap (MAX_DISTRIBUTOR_DEPTH, dealer.service.ts): a connector
      // CAN become a sub-distributor now, as long as doing so wouldn't exceed the max chain
      // length. depth 0 (not a connector of anyone) or depth 1 (one level down) can still
      // promote; depth 2 (already a sub-connector) cannot go deeper.
      show: (r) => !r.isDistributor && getDistributorDepth(r, items) < MAX_DISTRIBUTOR_DEPTH - 1,
      separatorBefore: true,
    },
    {
      label: "Revoke Distributor Status",
      icon: Network,
      onClick: (r) => setDistributorStatus(r, false),
      show: (r) => r.isDistributor,
    },
    { label: "Delete", icon: Trash2, onClick: (r) => ui.setDeleteRow(r), destructive: true, separatorBefore: true },
  ];

  const counts = {
    total: items.length,
    active: items.filter((d) => d.status === "active").length,
    pending: items.filter((d) => d.status === "pending").length,
  };

  // "Ever enrolled" — androidEnrolledCount/iosEnrolledCount already count ENROLLED, Released, or
  // any device with an enrolledAt timestamp (see dealer.service.ts#listDealers), not just
  // currently-active enrollments, so zero here really means zero activity ever, not just right now.
  // Also excludes distributors who've allocated quota to connectors but haven't enrolled any
  // devices themselves — that quota isn't idle, it's just in use one level down.
  const zeroEnrollmentDealers = items.filter(
    (d) => d.androidEnrolledCount + d.iosEnrolledCount + d.androidAllocatedToConnectors + d.iosAllocatedToConnectors === 0
  );
  const totalQuotaAllocated = items.reduce((sum, d) => sum + d.androidEnrollmentLimit + d.iosEnrollmentLimit, 0);
  const idleQuota = zeroEnrollmentDealers.reduce((sum, d) => sum + d.androidEnrollmentLimit + d.iosEnrollmentLimit, 0);
  const visibleItems = zeroEnrollmentOnly ? zeroEnrollmentDealers : items;

  return (
    <div>
      <PageHeader
        title="Dealers"
        description="Onboard dealers and set their device-enrollment quota."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Dealers" }]}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => ui.setCreateOpen(true)}>
            <Plus className="h-4 w-4" />Onboard Dealer
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Total Dealers" value={counts.total.toString()} icon={Store} />
        <KpiCard label="Active" value={counts.active.toString()} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending KYC" value={counts.pending.toString()} icon={Building2} tone="warning" />
        <button
          type="button"
          onClick={() => setZeroEnrollmentOnly((v) => !v)}
          className={`text-left rounded-xl transition-shadow ${zeroEnrollmentOnly ? "ring-2 ring-warning" : ""}`}
          title={zeroEnrollmentOnly ? "Showing zero-enrollment dealers only — click to clear filter" : "Click to filter the table to zero-enrollment dealers"}
        >
          <KpiCard label="Zero Enrollment" value={zeroEnrollmentDealers.length.toString()} icon={AlertTriangle} tone="warning" />
        </button>
        <KpiCard label="Total Quota Allocated" value={totalQuotaAllocated.toLocaleString()} icon={Layers} />
        <KpiCard label="Idle Quota" value={idleQuota.toLocaleString()} icon={PauseCircle} tone="warning" />
      </div>

      {zeroEnrollmentOnly && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Showing zero-enrollment dealers only ({zeroEnrollmentDealers.length})</span>
          <button
            type="button"
            onClick={() => setZeroEnrollmentOnly(false)}
            className="ml-auto text-xs font-medium underline underline-offset-2 hover:no-underline"
          >
            Clear filter
          </button>
        </div>
      )}

      <DataTable
        data={visibleItems}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search dealers by name, ID, city…"
        searchKeys={["name", "id", "city", "contact"]}
        rowActions={actions}
        onBulkDelete={(ids) => ui.setBulkDeleteIds(ids)}
        emptyTitle={zeroEnrollmentOnly ? "No zero-enrollment dealers" : "No dealers found"}
        emptyDescription={zeroEnrollmentOnly ? "Every dealer has at least one enrollment or allocated connector quota." : "Onboard your first authorized dealer to start enrolling devices."}
        emptyAction={<Button size="sm" onClick={() => ui.setCreateOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Onboard Dealer</Button>}
      />

      <CrudModal<any>
        open={ui.createOpen}
        onOpenChange={ui.setCreateOpen}
        title="Onboard New Dealer"
        description="Creates the dealer record and its first dealer-app login together."
        fields={createFields}
        onSubmit={onCreate}
        submitLabel="Onboard Dealer"
      />
      <CrudModal<any>
        open={!!ui.editRow}
        onOpenChange={(o) => !o && ui.setEditRow(null)}
        title="Edit Dealer"
        description={ui.editRow?.name}
        fields={editFields}
        initial={ui.editRow ?? undefined}
        mode="edit"
        onSubmit={onEdit}
      />

      <CrudModal<any>
        open={!!featuresRow}
        onOpenChange={(o) => !o && setFeaturesRow(null)}
        title="Manage Features"
        description={featuresRow ? `Choose which opt-in commands ${featuresRow.name} can use.` : undefined}
        fields={featureFields}
        initial={
          featuresRow
            ? Object.fromEntries(DEALER_FEATURE_KEYS.map((key) => [`feature_${key}`, featuresRow.enabledFeatures.includes(key)]))
            : undefined
        }
        mode="edit"
        submitLabel="Save Features"
        onSubmit={onSetFeatures}
      />

      <DetailsDialog
        open={!!ui.viewRow}
        onOpenChange={(o) => !o && ui.setViewRow(null)}
        title={ui.viewRow?.name ?? ""}
        subtitle={ui.viewRow?.id}
        fields={ui.viewRow ? [
          { label: "Contact Person", value: ui.viewRow.contact },
          { label: "Status", value: <StatusBadge status={ui.viewRow.status} /> },
          { label: "Email", value: ui.viewRow.email },
          { label: "Phone", value: ui.viewRow.phone },
          { label: "Location", value: `${ui.viewRow.city}, ${ui.viewRow.state}` },
          { label: "Onboarded", value: ui.viewRow.joined },
          { label: "Android Enrollment Limit", value: ui.viewRow.androidEnrollmentLimit.toLocaleString() },
          { label: "iOS Enrollment Limit", value: ui.viewRow.iosEnrollmentLimit.toLocaleString() },
        ] : []}
        footer={ui.viewRow && (
          <>
            <Button variant="outline" size="sm" onClick={() => ui.setViewRow(null)}>Close</Button>
            <Button size="sm" onClick={() => { const r = ui.viewRow!; ui.setViewRow(null); ui.setEditRow(r); }}>
              <Pencil className="mr-1.5 h-4 w-4" />Edit
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        open={!!ui.deleteRow}
        onOpenChange={(o) => !o && ui.setDeleteRow(null)}
        title="Delete this dealer?"
        description={ui.deleteRow ? `${ui.deleteRow.name} will be permanently removed. This cannot be undone.` : ""}
        confirmLabel="Delete Dealer"
        onConfirm={() => { const r = ui.deleteRow!; removeDealer(r.id); ui.setDeleteRow(null); }}
      />
      <ConfirmDialog
        open={!!ui.bulkDeleteIds}
        onOpenChange={(o) => !o && ui.setBulkDeleteIds(null)}
        title={`Delete ${ui.bulkDeleteIds?.length ?? 0} dealers?`}
        description="Selected dealers will be permanently removed."
        confirmLabel="Delete All"
        onConfirm={() => { const ids = ui.bulkDeleteIds!; removeManyDealers(ids); ui.setBulkDeleteIds(null); }}
      />
    </div>
  );
}
