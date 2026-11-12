import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import {
  Plus, Users, KeyRound, Eye, Pencil, Ban, Play, Trash2, LogOut, RefreshCw, Filter
} from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { StatusBadge } from "@/components/nexlock/StatusBadge";
import { ConfirmDialog } from "@/components/nexlock/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";

export const Route = createFileRoute("/user-management")({
  head: () => ({ meta: [{ title: "User Management — NexLock Admin" }] }),
  component: UsersPage,
});

interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: string;
  dealerId: string | null;
  dealerName: string | null;
  status: "active" | "disabled" | "pending";
  lastActiveAt: string | null;
  createdAt: string;
  activeSessionsCount: number;
}

interface RoleOption { id: string; name: string; }
interface DealerOption { id: string; name: string; }
interface UserDetails extends AdminUser {
  sessions: { id: string; ipAddress: string; userAgent: string; createdAt: string; expiresAt: string; isRevoked: boolean }[];
  loginHistories: { id: string; ipAddress: string; userAgent: string; status: string; createdAt: string }[];
}

const initials = (s: string) => s.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

function UsersPage() {
  const currentUser = session.getUser();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [dealers, setDealers] = useState<DealerOption[]>([]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [viewUser, setViewUser] = useState<UserDetails | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const [forceLogoutUser, setForceLogoutUser] = useState<AdminUser | null>(null);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", password: "", roleId: "", dealerId: "", status: "active" });
  const [resetPwd, setResetPwd] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (roleFilter !== "all") params.append("roleId", roleFilter);

      const res = await apiClient.get<any>(`/users?${params}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, roleFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    apiClient.get<any>("/roles?limit=100").then((r) => setRoles(r.data.items.map((x: any) => ({ id: x.id, name: x.name })))).catch(() => {});
    // GET /dealers returns its list directly as `data` (not nested under `data.items` like
    // /roles does) — this was silently throwing and getting swallowed by .catch(), leaving
    // the "Assign Dealer" dropdown permanently empty.
    apiClient.get<any>("/dealers?limit=100").then((r) => setDealers(r.data.map((x: any) => ({ id: x.id, name: x.name })))).catch(() => {});
  }, []);

  const openView = async (u: AdminUser) => {
    try {
      const res = await apiClient.get<any>(`/users/${u.id}`);
      setViewUser(res.data);
    } catch { toast.error("Failed to load user details"); }
  };

  const openEdit = (u: AdminUser) => {
    setForm({ name: u.name, email: u.email, password: "", roleId: u.roleId, dealerId: u.dealerId || "", status: u.status });
    setEditUser(u);
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password || !form.roleId) {
      toast.error("Name, email, password, and role are required");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/users", { ...form, dealerId: form.dealerId || null });
      toast.success("User created", { description: `${form.name} can now log in.` });
      setCreateOpen(false);
      setForm({ name: "", email: "", password: "", roleId: "", dealerId: "", status: "active" });
      load();
    } catch (e: any) { toast.error(e.message || "Failed to create user"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const payload: any = { name: form.name, email: form.email, roleId: form.roleId, status: form.status, dealerId: form.dealerId || null };
      await apiClient.put(`/users/${editUser.id}`, payload);
      toast.success("User updated");
      setEditUser(null);
      load();
    } catch (e: any) { toast.error(e.message || "Failed to update user"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await apiClient.delete(`/users/${deleteUser.id}`);
      toast.success("User deleted");
      setDeleteUser(null);
      load();
    } catch (e: any) { toast.error(e.message || "Failed to delete user"); }
  };

  const handleResetPassword = async () => {
    if (!resetUser || !resetPwd) return;
    setSaving(true);
    try {
      await apiClient.post(`/users/${resetUser.id}/reset-password`, { password: resetPwd });
      toast.success("Password reset", { description: `${resetUser.name}'s password has been updated.` });
      setResetUser(null);
      setResetPwd("");
    } catch (e: any) { toast.error(e.message || "Failed to reset password"); }
    finally { setSaving(false); }
  };

  const handleForceLogout = async () => {
    if (!forceLogoutUser) return;
    try {
      await apiClient.post(`/users/${forceLogoutUser.id}/force-logout`);
      toast.success("Sessions revoked", { description: `${forceLogoutUser.name} has been logged out everywhere.` });
      setForceLogoutUser(null);
      load();
    } catch (e: any) { toast.error(e.message || "Failed to force logout"); }
  };

  const quickStatus = async (u: AdminUser, status: "active" | "disabled") => {
    try {
      await apiClient.put(`/users/${u.id}`, { status });
      toast.success(status === "active" ? "User enabled" : "User disabled");
      load();
    } catch (e: any) { toast.error(e.message || "Failed to update status"); }
  };

  const cols: Column<AdminUser>[] = [
    {
      key: "name", header: "User", sortable: true, render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials(r.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "role", header: "Role", render: (r) => (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{r.role}</span>
      )
    },
    {
      key: "dealerName", header: "Dealer", render: (r) => (
        <span className="text-sm text-muted-foreground">{r.dealerName || "—"}</span>
      )
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "lastActiveAt", header: "Last Active", sortable: true, render: (r) => (
        <span className="text-sm text-muted-foreground">{r.lastActiveAt ? fmtDate(r.lastActiveAt) : "Never"}</span>
      )
    },
  ];

  const actions: RowAction<AdminUser>[] = [
    { label: "View Details", icon: Eye, onClick: openView },
    { label: "Edit", icon: Pencil, onClick: openEdit },
    { label: "Reset Password", icon: KeyRound, onClick: (r) => { setResetPwd(""); setResetUser(r); } },
    { label: "Force Logout", icon: LogOut, onClick: (r) => setForceLogoutUser(r) },
    { label: "Disable", icon: Ban, onClick: (r) => quickStatus(r, "disabled"), show: (r) => r.status === "active" },
    { label: "Enable", icon: Play, onClick: (r) => quickStatus(r, "active"), show: (r) => r.status !== "active" },
    { label: "Delete", icon: Trash2, onClick: (r) => setDeleteUser(r), destructive: true, separatorBefore: true, show: (r) => r.id !== currentUser?.userId },
  ];

  const active = items.filter((u) => u.status === "active").length;

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage admin users, roles, and access sessions."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "User Management" }]}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => { setForm({ name: "", email: "", password: "", roleId: "", dealerId: "", status: "active" }); setCreateOpen(true); }}>
            <Plus className="h-4 w-4" />Add User
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Total Users" value={total.toString()} icon={Users} />
        <KpiCard label="Active Users" value={active.toString()} icon={Play} tone="success" />
        <KpiCard label="Roles Defined" value={roles.length.toString()} icon={KeyRound} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-56"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load} className="h-9 gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />Refresh
        </Button>
      </div>

      <DataTable
        data={items}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search users…"
        searchKeys={["name", "email", "role"]}
        rowActions={actions}
        emptyTitle="No users found"
        emptyDescription="Add your first admin user to get started."
      />

      {/* Create User Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new admin user account.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name *">
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Rohan Agarwal" />
              </FormField>
              <FormField label="Email *">
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="rohan@nexlock.io" />
              </FormField>
            </div>
            <FormField label="Password *">
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role *">
                <Select value={form.roleId} onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status">
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Assign Dealer (Optional)">
              <Select value={form.dealerId || "none"} onValueChange={(v) => setForm((f) => ({ ...f, dealerId: v === "none" ? "" : v }))}>
                <SelectTrigger><SelectValue placeholder="No dealer" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No dealer</SelectItem>
                  {dealers.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <DialogFooter className="border-t border-border px-6 py-3">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Creating…" : "Create User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>{editUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name">
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </FormField>
              <FormField label="Email">
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role">
                <Select value={form.roleId} onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status">
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>
          <DialogFooter className="border-t border-border px-6 py-3">
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Modal */}
      <Dialog open={!!viewUser} onOpenChange={(o) => !o && setViewUser(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{viewUser ? initials(viewUser.name) : ""}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>{viewUser?.name}</DialogTitle>
                <DialogDescription className="text-xs">{viewUser?.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Role</div>
                <div className="mt-1 text-sm font-medium">{viewUser?.role}</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-[10px] font-semibold uppercase text-muted-foreground">Status</div>
                <div className="mt-1"><StatusBadge status={viewUser?.status || ""} /></div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Sessions ({viewUser?.sessions?.filter(s => !s.isRevoked).length ?? 0})</div>
              <div className="space-y-2">
                {viewUser?.sessions?.filter(s => !s.isRevoked).slice(0, 5).map((s) => (
                  <div key={s.id} className="rounded-lg border border-border p-3 text-xs">
                    <div className="font-medium truncate">{s.userAgent}</div>
                    <div className="text-muted-foreground mt-0.5">{s.ipAddress} · Started {fmtDate(s.createdAt)}</div>
                  </div>
                ))}
                {!viewUser?.sessions?.filter(s => !s.isRevoked).length && (
                  <div className="text-xs text-muted-foreground">No active sessions</div>
                )}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Login History</div>
              <div className="space-y-2">
                {viewUser?.loginHistories?.map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-xs">
                    <div>
                      <div className="font-medium">{h.ipAddress}</div>
                      <div className="text-muted-foreground">{fmtDate(h.createdAt)}</div>
                    </div>
                    <Badge variant={h.status === "success" ? "default" : "destructive"} className="text-[10px]">{h.status}</Badge>
                  </div>
                ))}
                {!viewUser?.loginHistories?.length && (
                  <div className="text-xs text-muted-foreground">No login history</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={!!resetUser} onOpenChange={(o) => !o && setResetUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for {resetUser?.name}. They will be logged out of all sessions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-xs font-medium">New Password</Label>
            <Input type="password" placeholder="Min 6 characters" value={resetPwd} onChange={(e) => setResetPwd(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetUser(null)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={saving || !resetPwd}>{saving ? "Resetting…" : "Reset Password"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Logout Confirm */}
      <ConfirmDialog
        open={!!forceLogoutUser}
        onOpenChange={(o) => !o && setForceLogoutUser(null)}
        title="Force logout?"
        description={`${forceLogoutUser?.name} will be signed out of all active sessions immediately.`}
        onConfirm={handleForceLogout}
        confirmLabel="Force Logout"
        destructive
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
        title="Delete this user?"
        description={`${deleteUser?.name} will permanently lose access to the platform.`}
        onConfirm={handleDelete}
        confirmLabel="Delete User"
        destructive
      />
    </div>
  );
}
