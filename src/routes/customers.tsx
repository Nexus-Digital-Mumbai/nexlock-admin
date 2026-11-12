import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Eye, Pencil, Camera, Search } from "lucide-react";
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
  head: () => ({ meta: [{ title: "Customers — NexLock Admin" }] }),
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
        toast.success("Customer updated");
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
    { key: "customerCode", header: "Customer ID", render: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.customerCode}</span> },
    { key: "name", header: "Customer", sortable: true, render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-border">
          {r.photoUrl ? (
            <img src={r.photoUrl} alt={r.name} className="object-cover w-full h-full" />
          ) : (
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">{initials(r.name)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-medium text-foreground">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.phone}</div>
        </div>
      </div>
    )},
    { key: "email", header: "Email", render: (r) => <span className="text-sm text-muted-foreground">{r.email || "N/A"}</span> },
    { key: "dealer", header: "Enrolled By", render: (r) => <span className="text-sm font-medium text-muted-foreground">{r.dealer?.name || "N/A"}</span> },
  ];

  const actions: RowAction<CustomerData>[] = [
    { label: "View Details", icon: Eye, onClick: openViewDialog },
    { label: "Edit Details", icon: Pencil, onClick: openEditDialog },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Customers registered by dealers, with minimal KYC details. Name, phone, and email can be corrected here."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Customers" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Customers" value={pagination.total.toLocaleString()} icon={Users} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/40 border-border text-foreground"
          />
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
        emptyDescription="Customers are registered from the dealer app during device enrollment."
      />

      {pagination.pages > 1 && (
        <div className="flex justify-between items-center bg-card px-4 py-3 rounded-xl border border-border">
          <span className="text-xs text-muted-foreground">
            Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total items)
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={pagination.page <= 1} onClick={() => fetchCustomers(pagination.page - 1)} className="border-border text-foreground hover:bg-muted">
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={pagination.page >= pagination.pages} onClick={() => fetchCustomers(pagination.page + 1)} className="border-border text-foreground hover:bg-muted">
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Customer — {viewCustomer?.name}</DialogTitle>
            <DialogDescription>Minimal KYC identity details.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-40 h-40 rounded-xl overflow-hidden border border-border bg-muted/10 shadow-inner">
                  {viewCustomer?.photoUrl ? (
                    <img src={viewCustomer.photoUrl} alt="KYC" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Camera className="h-10 w-10" /></div>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">KYC Photo</span>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Customer ID</span>
                  <p className="text-sm font-semibold font-mono text-primary">{viewCustomer?.customerCode}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Enrolled By</span>
                  <p className="text-sm font-medium text-foreground">{viewCustomer?.dealer?.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Phone Number</span>
                  <p className="text-sm font-medium text-foreground">{viewCustomer?.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Email Address</span>
                  <p className="text-sm font-medium text-foreground">{viewCustomer?.email || "N/A"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Aadhaar Number</span>
                  <p className="text-sm font-semibold text-foreground font-mono">{viewCustomer?.aadhaarNumber || "N/A"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">PAN Number</span>
                  <p className="text-sm font-semibold text-foreground font-mono">{viewCustomer?.panNumber || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Reference Person</span>
              <div className="p-3 bg-muted/15 border border-border rounded-xl">
                <div className="text-sm font-medium">{viewCustomer?.referenceName1 || "N/A"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {viewCustomer?.referencePhone1 && `Phone: ${viewCustomer.referencePhone1}`}
                  {viewCustomer?.referenceRelation1 && ` (${viewCustomer.referenceRelation1})`}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-3">
            <Button onClick={() => setViewOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground border border-border p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Edit Customer — {editCustomer?.customerCode}</DialogTitle>
            <DialogDescription>Corrects the record on file. Does not notify the customer or dealer.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="bg-muted/40 border-border text-foreground"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-3">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving} className="border-border text-foreground hover:bg-muted">
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
