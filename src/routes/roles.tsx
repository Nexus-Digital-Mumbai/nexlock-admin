import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { Plus, ShieldCheck, Eye, Pencil, Trash2, KeyRound, Copy, RefreshCw, Shield, CheckSquare } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { ConfirmDialog } from "@/components/nexlock/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — Nexus Console" }] }),
  component: RolesPage,
});

interface Role {
  id: string;
  name: string;
  description: string | null;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

interface PermGroup {
  group: string;
  items: { key: string; description: string; groupName: string }[];
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground/90">{label}</Label>
      {children}
    </div>
  );
}

function RolesPage() {
  const [items, setItems] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [permCatalog, setPermCatalog] = useState<PermGroup[]>([]);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [permRole, setPermRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  // Form state
  const [form, setForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  const allPerms = permCatalog.flatMap((g) => g.items.map((i) => i.key));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>("/roles?limit=100");
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    apiClient.get<any>("/roles/permissions").then((r) => setPermCatalog(r.data)).catch(() => {});
  }, []);

  const openPerms = (role: Role) => {
    setPermRole(role);
    setSelectedPerms([...role.permissions]);
  };

  const savePerms = async () => {
    if (!permRole) return;
    setSaving(true);
    try {
      await apiClient.put(`/roles/${permRole.id}`, { permissions: selectedPerms });
      toast.success("Permissions updated", { description: permRole.name });
      setPermRole(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name) {
      toast.error("Role name is required");
      return;
    }
    setSaving(true);
    try {
      await apiClient.post("/roles", form);
      toast.success("Role created successfully");
      setCreateOpen(false);
      setForm({ name: "", description: "" });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to create role");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editRole) return;
    setSaving(true);
    try {
      await apiClient.put(`/roles/${editRole.id}`, form);
      toast.success("Role updated");
      setEditRole(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  const handleClone = async (role: Role) => {
    try {
      await apiClient.post(`/roles/${role.id}/clone`);
      toast.success("Role duplicated", { description: `${role.name} (Copy) created.` });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to clone role");
    }
  };

  const handleDelete = async () => {
    if (!deleteRole) return;
    try {
      await apiClient.delete(`/roles/${deleteRole.id}`);
      toast.success("Role deleted");
      setDeleteRole(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete role");
    }
  };

  const togglePerm = (key: string, checked: boolean) => {
    setSelectedPerms((prev) => (checked ? [...prev, key] : prev.filter((x) => x !== key)));
  };

  const toggleGroup = (group: PermGroup, checked: boolean) => {
    const keys = group.items.map((i) => i.key);
    setSelectedPerms((prev) =>
      checked ? [...new Set([...prev, ...keys])] : prev.filter((k) => !keys.includes(k))
    );
  };

  const cols: Column<Role>[] = [
    {
      key: "name",
      header: "Access Role",
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              r.isSystem
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted/40 text-muted-foreground border-border/80"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs md:text-sm">{r.name}</span>
              {r.isSystem && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                  System Role
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground truncate max-w-sm mt-0.5">
              {r.description || "No description specified"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "userCount",
      header: "Assigned Users",
      sortable: true,
      className: "text-right",
      render: (r) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-foreground">
          {r.userCount} users
        </span>
      ),
    },
    {
      key: "permissions",
      header: "Granted Permissions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${allPerms.length ? (r.permissions.length / allPerms.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground font-mono">
            {r.permissions.length}/{allPerms.length}
          </span>
        </div>
      ),
    },
  ];

  const actions: RowAction<Role>[] = [
    { label: "View Role Permissions", icon: Eye, onClick: (r) => setViewRole(r) },
    { label: "Edit Role Information", icon: Pencil, onClick: (r) => { setForm({ name: r.name, description: r.description || "" }); setEditRole(r); } },
    { label: "Configure Permissions Matrix", icon: KeyRound, onClick: openPerms },
    { label: "Duplicate Role", icon: Copy, onClick: handleClone },
    { label: "Delete Role", icon: Trash2, onClick: (r) => setDeleteRole(r), destructive: true, separatorBefore: true, show: (r) => !r.isSystem && r.userCount === 0 },
  ];

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Roles & Access Control"
        description="Configure role-based access control (RBAC) definitions and feature permissions."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "Roles & Permissions" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} className="h-9 gap-1.5 text-xs font-semibold border-border/80">
              <RefreshCw className="h-3.5 w-3.5" />Refresh
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
              onClick={() => { setForm({ name: "", description: "" }); setCreateOpen(true); }}
            >
              <Plus className="h-4 w-4" />Create New Role
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Defined Roles" value={total.toString()} sub="Access tier categories" icon={ShieldCheck} tone="primary" />
        <KpiCard label="Permission Points" value={allPerms.length.toString()} sub="Granular feature gates" icon={KeyRound} tone="primary" />
        <KpiCard label="Assigned Operators" value={items.reduce((s, r) => s + r.userCount, 0).toString()} sub="Active personnel" icon={Shield} tone="success" />
        <KpiCard label="Protected System Roles" value={items.filter((r) => r.isSystem).length.toString()} sub="Built-in immutable" icon={ShieldCheck} tone="primary" />
      </div>

      <DataTable
        data={items}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search roles by title or capability…"
        searchKeys={["name", "description"]}
        rowActions={actions}
        emptyTitle="No access roles defined"
        emptyDescription="Create customized roles to partition platform privileges safely."
      />

      {/* CREATE ROLE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="card-elevated max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Create Access Role</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define a new security tier for admin users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <FormField label="Role Name *">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Compliance Auditor"
                className="h-9 text-xs bg-muted/20 border-border/80"
              />
            </FormField>
            <FormField label="Description">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief summary of permissions for this security tier…"
                className="text-xs bg-muted/20 border-border/80"
              />
            </FormField>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleCreate} disabled={saving} className="text-xs font-semibold">
              {saving ? "Creating…" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT ROLE MODAL */}
      <Dialog open={!!editRole} onOpenChange={(o) => !o && setEditRole(null)}>
        <DialogContent className="card-elevated max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Edit Role Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">{editRole?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <FormField label="Role Name">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-9 text-xs bg-muted/20 border-border/80"
              />
            </FormField>
            <FormField label="Description">
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="text-xs bg-muted/20 border-border/80"
              />
            </FormField>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditRole(null)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleEdit} disabled={saving} className="text-xs font-semibold">
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW ROLE MODAL */}
      <Dialog open={!!viewRole} onOpenChange={(o) => !o && setViewRole(null)}>
        <DialogContent className="card-elevated max-w-lg max-h-[90vh] flex flex-col p-0 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-4.5 bg-card/60">
            <DialogTitle className="text-base font-bold text-foreground">{viewRole?.name}</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">{viewRole?.description || "No description provided"}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Active Permissions Matrix</span>
              <span className="font-mono text-primary font-bold">({viewRole?.permissions.length ?? 0} enabled)</span>
            </div>
            {permCatalog.map((g) => {
              const grantedInGroup = g.items.filter((i) => viewRole?.permissions.includes(i.key));
              if (!grantedInGroup.length) return null;
              return (
                <div key={g.group} className="mb-4">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{g.group}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {grantedInGroup.map((p) => (
                      <span key={p.key} className="rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 font-mono text-[11px] text-primary font-medium">
                        {p.key}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            {!viewRole?.permissions.length && (
              <div className="text-xs text-muted-foreground italic text-center p-6 border border-dashed border-border rounded-xl">
                No permissions currently assigned to this role.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ASSIGN PERMISSIONS MATRIX MODAL */}
      <Dialog open={!!permRole} onOpenChange={(o) => !o && setPermRole(null)}>
        <DialogContent className="card-elevated max-w-2xl max-h-[90vh] flex flex-col p-0 rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-border/60 px-6 py-4.5 bg-card/60">
            <DialogTitle className="text-base font-bold text-foreground">
              Permissions Matrix — {permRole?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Toggle specific API and console privileges for users assigned to this role.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {permCatalog.map((g) => {
              const groupKeys = g.items.map((i) => i.key);
              const allGroupSelected = groupKeys.every((k) => selectedPerms.includes(k));
              const someGroupSelected = groupKeys.some((k) => selectedPerms.includes(k));
              return (
                <div key={g.group} className="rounded-xl border border-border/60 bg-muted/15 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={allGroupSelected}
                        onCheckedChange={(v) => toggleGroup(g, !!v)}
                        className={someGroupSelected && !allGroupSelected ? "data-[state=unchecked]:border-primary" : ""}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">{g.group}</span>
                    </label>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {groupKeys.filter((k) => selectedPerms.includes(k)).length} / {groupKeys.length} enabled
                    </span>
                  </div>
                  <div className="space-y-2">
                    {g.items.map((p) => {
                      const checked = selectedPerms.includes(p.key);
                      return (
                        <label
                          key={p.key}
                          className="flex cursor-pointer items-center justify-between rounded-lg border border-border/60 bg-card p-3 hover:bg-muted/40 transition-colors"
                        >
                          <div className="min-w-0 pr-3">
                            <div className="text-xs font-semibold text-foreground">{p.description}</div>
                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.key}</div>
                          </div>
                          <Checkbox checked={checked} onCheckedChange={(v) => togglePerm(p.key, !!v)} />
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter className="border-t border-border/80 px-6 py-3.5 sm:justify-between bg-muted/20">
            <div className="text-xs font-semibold text-muted-foreground">
              <span className="text-foreground">{selectedPerms.length}</span> of {allPerms.length} permissions active
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPermRole(null)} className="text-xs">Cancel</Button>
              <Button size="sm" onClick={savePerms} disabled={saving} className="text-xs font-semibold shadow-xs">
                {saving ? "Saving…" : "Save Matrix"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteRole}
        onOpenChange={(o) => !o && setDeleteRole(null)}
        title="Delete Access Role?"
        description={deleteRole ? `The role "${deleteRole.name}" will be permanently removed.` : ""}
        onConfirm={handleDelete}
        confirmLabel="Delete Role"
        destructive
      />
    </div>
  );
}
