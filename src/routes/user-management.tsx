import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import {
  Plus, Users, KeyRound, Eye, Pencil, Ban, Play, Trash2, LogOut, RefreshCw, Filter, ShieldCheck, Activity, Shield
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
  head: () => ({ meta: [{ title: "User Management — Nexus Console" }] }),
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
      <Label className="text-xs font-semibold text-foreground/90">{label}</Label>
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
      key: "name",
      header: "Administrator",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border/80 ring-2 ring-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {initials(r.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-xs md:text-sm">{r.name}</div>
            <div className="text-xs text-muted-foreground">{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role Definition",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground">
          <Shield className="h-3 w-3 text-primary" />
          {r.role}
        </span>
      ),
    },
    {
      key: "dealerName",
      header: "Assigned Dealership",
      render: (r) => (
        <span className="text-xs font-medium text-foreground">{r.dealerName || "Global (All Stores)"}</span>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "lastActiveAt",
      header: "Last Activity",
      sortable: true,
      render: (r) => (
        <span className="text-xs font-medium text-muted-foreground">{r.lastActiveAt ? fmtDate(r.lastActiveAt) : "Never Logged In"}</span>
      ),
    },
  ];

  const actions: RowAction<AdminUser>[] = [
    { label: "View User Details", icon: Eye, onClick: openView },
    { label: "Edit Account", icon: Pencil, onClick: openEdit },
    { label: "Reset Password", icon: KeyRound, onClick: (r) => { setResetPwd(""); setResetUser(r); } },
    { label: "Force Logout", icon: LogOut, onClick: (r) => setForceLogoutUser(r) },
    { label: "Disable Account", icon: Ban, onClick: (r) => quickStatus(r, "disabled"), show: (r) => r.status === "active" },
    { label: "Enable Account", icon: Play, onClick: (r) => quickStatus(r, "active"), show: (r) => r.status !== "active" },
    { label: "Delete User", icon: Trash2, onClick: (r) => setDeleteUser(r), destructive: true, separatorBefore: true, show: (r) => r.id !== currentUser?.userId },
  ];

  const active = items.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="User Management"
        description="Oversee administrative accounts, role assignments, and active workstation sessions."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "User Management" }]}
        actions={
          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
            onClick={() => { setForm({ name: "", email: "", password: "", roleId: "", dealerId: "", status: "active" }); setCreateOpen(true); }}
          >
            <Plus className="h-4 w-4" />Add Admin User
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <KpiCard label="Total Admin Users" value={total.toString()} sub="Platform operators" icon={Users} tone="primary" />
        <KpiCard label="Active Accounts" value={active.toString()} sub="Authorized sign-ins" icon={Play} tone="success" />
        <KpiCard label="Defined Roles" value={roles.length.toString()} sub="Access tier catalog" icon={KeyRound} tone="primary" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
        <Input
          placeholder="Search by name, email, or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full sm:w-64 text-xs bg-muted/30 border-border/70"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36 text-xs bg-muted/30 border-border/70"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="rounded-xl border-border shadow-xl">
            <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
            <SelectItem value="active" className="text-xs">Active Only</SelectItem>
            <SelectItem value="disabled" className="text-xs">Disabled</SelectItem>
            <SelectItem value="pending" className="text-xs">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-9 w-44 text-xs bg-muted/30 border-border/70"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent className="rounded-xl border-border shadow-xl">
            <SelectItem value="all" className="text-xs font-semibold">All Roles</SelectItem>
            {roles.map((r) => <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load} className="h-9 gap-1.5 text-xs font-medium border-border/80">
          <RefreshCw className="h-3.5 w-3.5" />Refresh
        </Button>
      </div>

      <DataTable
        data={items}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search administrators…"
        searchKeys={["name", "email", "role"]}
        rowActions={actions}
        emptyTitle="No administrator accounts found"
        emptyDescription="Add your first administrator to grant console permissions."
      />

      {/* CREATE USER MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card">
          <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60">
            <DialogTitle className="text-base font-bold text-foreground">Add New Administrator</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">Provision a new staff account with granular role permissions.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name *">
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Rohan Agarwal" className="h-9 text-xs bg-muted/20 border-border/80" />
              </FormField>
              <FormField label="Email Address *">
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="rohan@nexus.io" className="h-9 text-xs bg-muted/20 border-border/80" />
              </FormField>
            </div>
            <FormField label="Initial Password *">
              <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" className="h-9 text-xs bg-muted/20 border-border/80" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role *">
                <Select value={form.roleId} onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}>
                  <SelectTrigger className="h-9 text-xs bg-muted/20 border-border/80"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl">
                    {roles.map((r) => <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status">
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger className="h-9 text-xs bg-muted/20 border-border/80"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl">
                    <SelectItem value="active" className="text-xs">Active</SelectItem>
                    <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                    <SelectItem value="disabled" className="text-xs">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Restrict to Dealer Store (Optional)">
              <Select value={form.dealerId || "none"} onValueChange={(v) => setForm((f) => ({ ...f, dealerId: v === "none" ? "" : v }))}>
                <SelectTrigger className="h-9 text-xs bg-muted/20 border-border/80"><SelectValue placeholder="No dealer restriction (Global)" /></SelectTrigger>
                <SelectContent className="rounded-xl border-border shadow-xl">
                  <SelectItem value="none" className="text-xs font-semibold">No dealer restriction (Global Access)</SelectItem>
                  {dealers.map((d) => <SelectItem key={d.id} value={d.id} className="text-xs">{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <DialogFooter className="border-t border-border/80 px-6 py-3.5 bg-muted/20 gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleCreate} disabled={saving} className="text-xs font-semibold shadow-xs">
              {saving ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT USER MODAL */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card">
          <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60">
            <DialogTitle className="text-base font-bold text-foreground">Edit User Profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">{editUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name">
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-9 text-xs bg-muted/20 border-border/80" />
              </FormField>
              <FormField label="Email Address">
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="h-9 text-xs bg-muted/20 border-border/80" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Role Assignment">
                <Select value={form.roleId} onValueChange={(v) => setForm((f) => ({ ...f, roleId: v }))}>
                  <SelectTrigger className="h-9 text-xs bg-muted/20 border-border/80"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl">
                    {roles.map((r) => <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status">
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger className="h-9 text-xs bg-muted/20 border-border/80"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-xl">
                    <SelectItem value="active" className="text-xs">Active</SelectItem>
                    <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                    <SelectItem value="disabled" className="text-xs">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>
          <DialogFooter className="border-t border-border/80 px-6 py-3.5 bg-muted/20 gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditUser(null)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleEdit} disabled={saving} className="text-xs font-semibold shadow-xs">
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW USER DETAILS MODAL */}
      <Dialog open={!!viewUser} onOpenChange={(o) => !o && setViewUser(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card">
          <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{viewUser ? initials(viewUser.name) : ""}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">{viewUser?.name}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">{viewUser?.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Role</div>
                <div className="mt-1 text-xs font-semibold text-foreground">{viewUser?.role}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Status</div>
                <div className="mt-1"><StatusBadge status={viewUser?.status || ""} /></div>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Sessions</div>
                <div className="mt-1 text-xs font-bold text-foreground font-mono">
                  {viewUser?.sessions?.filter(s => !s.isRevoked).length ?? 0}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Active Workstation Sessions ({viewUser?.sessions?.filter(s => !s.isRevoked).length ?? 0})
              </div>
              <div className="space-y-2">
                {viewUser?.sessions?.filter(s => !s.isRevoked).slice(0, 5).map((s) => (
                  <div key={s.id} className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                    <div className="font-semibold text-foreground truncate">{s.userAgent}</div>
                    <div className="text-muted-foreground mt-1 flex items-center gap-2">
                      <span className="font-mono">{s.ipAddress}</span>
                      <span>•</span>
                      <span>Started: {fmtDate(s.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {!viewUser?.sessions?.filter(s => !s.isRevoked).length && (
                  <div className="text-xs text-muted-foreground/70 italic p-3 text-center border border-dashed border-border rounded-xl">
                    No active sessions currently open.
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Recent Sign-In Attempts
              </div>
              <div className="space-y-2">
                {viewUser?.loginHistories?.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                    <div>
                      <div className="font-mono font-semibold text-foreground">{h.ipAddress}</div>
                      <div className="text-[11px] text-muted-foreground">{fmtDate(h.createdAt)}</div>
                    </div>
                    <Badge variant={h.status === "success" ? "default" : "destructive"} className="text-[10px] font-bold">
                      {h.status}
                    </Badge>
                  </div>
                ))}
                {!viewUser?.loginHistories?.length && (
                  <div className="text-xs text-muted-foreground/70 italic p-3 text-center border border-dashed border-border rounded-xl">
                    No previous sign-in records.
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* RESET PASSWORD MODAL */}
      <Dialog open={!!resetUser} onOpenChange={(o) => !o && setResetUser(null)}>
        <DialogContent className="max-w-sm rounded-2xl border-border/80 shadow-2xl p-6 bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Reset Password</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a new password for {resetUser?.name}. All existing active sessions will be terminated immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <Label className="text-xs font-semibold text-foreground">New Access Password</Label>
            <Input
              type="password"
              placeholder="Min 6 characters"
              value={resetPwd}
              onChange={(e) => setResetPwd(e.target.value)}
              className="h-9 text-xs bg-muted/20 border-border/80"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setResetUser(null)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleResetPassword} disabled={saving || !resetPwd} className="text-xs font-semibold">
              {saving ? "Resetting…" : "Confirm Password Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!forceLogoutUser}
        onOpenChange={(o) => !o && setForceLogoutUser(null)}
        title="Force Session Termination?"
        description={`${forceLogoutUser?.name} will be immediately signed out across all workstations and browser sessions.`}
        onConfirm={handleForceLogout}
        confirmLabel="Revoke All Sessions"
        destructive
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
        title="Revoke Administrator Account?"
        description={`The account for "${deleteUser?.name}" will be deleted. Access tokens will be revoked immediately.`}
        onConfirm={handleDelete}
        confirmLabel="Delete User"
        destructive
      />
    </div>
  );
}
