import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Eye, Pencil, Camera, Search, UserCheck, Shield, Phone, Mail, Store, X } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers — Nexus Console" }] }),
  component: CustomersPage,
});

interface CustomerData {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  aadhaarNumber: string | null;
  panNumber: string | null;
  referenceName1: string | null;
  referencePhone1: string | null;
  referenceRelation1: string | null;
  createdAt: string;
  dealer: {
    id: string;
    name: string;
  };
}

const initials = (s: string) => s.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const [viewOpen, setViewOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<CustomerData | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerData | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search ? { search } : {}),
      }).toString();

      const res = await apiClient.get(`/customers?${query}`);
      if (res.success) {
        setCustomers(res.data);
        if (res.meta?.pagination) {
          const pg = res.meta.pagination;
          setPagination({ page: pg.page, limit: pg.limit, total: pg.total, pages: pg.pages });
        }
      }
    } catch (err: any) {
      toast.error("Failed to load customers", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, [search]);

  const openViewDialog = (row: CustomerData) => {
    setViewCustomer(row);
    setViewOpen(true);
  };

  const openEditDialog = (row: CustomerData) => {
    setEditCustomer(row);
    setEditForm({ name: row.name, phone: row.phone, email: row.email || "" });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editCustomer) return;
    if (!editForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const res = await apiClient.put(`/customers/${editCustomer.id}`, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim(),
      });
      if (res.success) {
        toast.success("Customer record updated");
        setEditOpen(false);
        fetchCustomers(pagination.page);
      }
    } catch (err: any) {
      toast.error("Failed to update customer", { description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const cols: Column<CustomerData>[] = [
    {
      key: "customerCode",
      header: "Customer ID",
      render: (r) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
          {r.customerCode}
        </span>
      ),
    },
    {
      key: "name",
      header: "Customer Name",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/80 shadow-xs">
            {r.photoUrl ? (
              <img src={r.photoUrl} alt={r.name} className="object-cover w-full h-full" />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {initials(r.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-xs md:text-sm">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email Address",
      render: (r) => (
        <span className="text-xs text-muted-foreground font-medium">
          {r.email || "—"}
        </span>
      ),
    },
    {
      key: "dealer",
      header: "Enrolled By Dealer",
      render: (r) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Store className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span>{r.dealer?.name || "Independent"}</span>
        </div>
      ),
    },
  ];

  const actions: RowAction<CustomerData>[] = [
    { label: "View KYC Details", icon: Eye, onClick: openViewDialog },
    { label: "Edit Record", icon: Pencil, onClick: openEditDialog },
  ];

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Consumer Directory"
        description="Financed hardware consumers registered across dealerships with verified identity records."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "Customers" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Registered Consumers"
          value={pagination.total.toLocaleString()}
          sub="Verified accounts"
          icon={Users}
          tone="primary"
        />
      </div>

      {/* Search Toolbar */}
      <div className="glass-toolbar p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4B6188]/70 dark:text-[#8CA5C8]/80" />
          <Input
            placeholder="Search by customer name, phone, code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-pill h-10 pl-11 pr-8 text-xs md:text-sm w-full text-[#071B5E] dark:text-[#F5F8FF] placeholder:text-slate-400 dark:placeholder:text-[#8CA5C8]/75 focus-visible:border-[#0755D8] dark:focus-visible:border-[#00D4FF] focus-visible:ring-[#0755D8]/20 dark:focus-visible:ring-[#00D4FF]/25 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-black/5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <DataTable
        data={customers}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        rowActions={actions}
        hideSearch
        emptyTitle="No customers registered yet"
        emptyDescription="Customer records will appear here as soon as they are registered during device financing at dealer shops."
      />

      {pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-card px-5 py-3 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">
            Page <span className="font-bold text-foreground">{pagination.page}</span> of <span className="font-bold text-foreground">{pagination.pages}</span> ({pagination.total} total customers)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => fetchCustomers(pagination.page - 1)}
              className="h-8 text-xs font-semibold border-border/80"
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchCustomers(pagination.page + 1)}
              className="h-8 text-xs font-semibold border-border/80"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* VIEW KYC DETAILS DIALOG */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border/80 p-0 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60">
            <DialogTitle className="text-base font-bold text-foreground">
              Consumer Record — {viewCustomer?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Verified identity credentials and emergency reference contacts.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2.5 mx-auto md:mx-0">
                <div className="w-36 h-36 rounded-2xl overflow-hidden border border-border/80 bg-muted/20 shadow-inner ring-2 ring-primary/20">
                  {viewCustomer?.photoUrl ? (
                    <img src={viewCustomer.photoUrl} alt="KYC" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-8 w-8 text-muted-foreground/60 mb-1" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  KYC Photo Verification
                </span>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Customer ID</span>
                  <p className="mt-0.5 text-sm font-bold font-mono text-primary">{viewCustomer?.customerCode}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Enrolled At Dealer</span>
                  <p className="mt-0.5 text-xs font-semibold text-foreground">{viewCustomer?.dealer?.name || "Independent Store"}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mobile Phone</span>
                  <p className="mt-0.5 text-xs font-semibold text-foreground font-mono">{viewCustomer?.phone}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                  <p className="mt-0.5 text-xs font-semibold text-foreground truncate">{viewCustomer?.email || "—"}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Aadhaar ID</span>
                  <p className="mt-0.5 text-xs font-bold font-mono text-foreground">{viewCustomer?.aadhaarNumber || "—"}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">PAN Number</span>
                  <p className="mt-0.5 text-xs font-bold font-mono text-foreground">{viewCustomer?.panNumber || "—"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border/80 pt-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
                Primary Reference Contact
              </span>
              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl">
                <div className="text-sm font-bold text-foreground">{viewCustomer?.referenceName1 || "None Provided"}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  {viewCustomer?.referencePhone1 && (
                    <span className="font-mono">{viewCustomer.referencePhone1}</span>
                  )}
                  {viewCustomer?.referenceRelation1 && (
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Relation: {viewCustomer.referenceRelation1}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border/80 px-6 py-3.5 bg-muted/20">
            <Button size="sm" onClick={() => setViewOpen(false)} className="text-xs font-semibold">
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT CUSTOMER DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground border border-border/80 p-0 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60">
            <DialogTitle className="text-base font-bold text-foreground">
              Edit Consumer — {editCustomer?.customerCode}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update name and contact coordinates on file.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-xs font-semibold text-foreground">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="h-9 text-xs bg-muted/20 border-border/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone" className="text-xs font-semibold text-foreground">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                className="h-9 text-xs bg-muted/20 border-border/80"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email" className="text-xs font-semibold text-foreground">Email Address</Label>
              <Input
                id="edit-email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="h-9 text-xs bg-muted/20 border-border/80"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border/80 px-6 py-3.5 bg-muted/20 gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)} disabled={saving} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={saveEdit} disabled={saving} className="text-xs font-semibold">
              {saving ? "Saving…" : "Save Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
