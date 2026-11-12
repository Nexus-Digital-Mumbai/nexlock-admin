import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { Plus, ShieldCheck, Eye, Pencil, Trash2, KeyRound, Copy, RefreshCw } from "lucide-react";
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
  head: () => ({ meta: [{ title: "Roles & Permissions — NexLock Admin" }] }),
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
      <Label className="text-xs font-medium">{label}</Label>
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
    } catch { toast.error("Failed to load roles"); }
    finally { setLoading(false); }
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
    } catch (e: any) { toast.error(e.message || "Failed to update permissions"); }
    finally { setSaving(false); }
  };

  const handleCreate = async () => {
    if (!form.name) { toast.error("Role name is required"); return; }
    setSaving(true);
    try {
      await apiClient.post("/roles", form);
      toast.success("Role created");
      setCreateOpen(false);
      setForm({ name: "", description: "" });
      load();
    } catch (e: any) { toast.error(e.message || "Failed to create role"); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editRole) return;
    setSaving(true);
    try {
      await apiClient.put(`/roles/${editRole.id}`, form);
      toast.success("Role updated");
      setEditRole(null);
      load();
    } catch (e: any) { toast.error(e.message || "Failed to update role"); }
    finally { setSaving(false); }
  };

  const handleClone = async (role: Role) => {
    try {
      await apiClient.post(`/roles/${role.id}/clone`);
      toast.success("Role cloned", { description: `${role.name} (Copy) created.` });
      load();
    } catch (e: any) { toast.error(e.message || "Failed to clone role"); }
  };

  const handleDelete = async () => {
    if (!deleteRole) return;
    try {
      await apiClient.delete(`/roles/${deleteRole.id}`);
      toast.success("Role deleted");
      setDeleteRole(null);
      load();
    } catch (e: any) { toast.error(e.message || "Failed to delete role"); }
  };

  const togglePerm = (key: string, checked: boolean) => {
    setSelectedPerms((prev) => checked ? [...prev, key] : prev.filter((x) => x !== key));
  };

  const toggleGroup = (group: PermGroup, checked: boolean) => {
    const keys = group.items.map((i) => i.key);
    setSelectedPerms((prev) =>
      checked ? [...new Set([...prev, ...keys])] : prev.filter((k) => !keys.includes(k))
    );
  };

  const cols: Column<Role>[] = [
    {
      key: "name", header: "Role", sortable: true, render: (r) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-md ${r.isSystem ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{r.name}</span>
              {r.isSystem && <Badge variant="secondary" className="text-[10px] py-0">System</Badge>}
            </div>
            <div className="text-xs text-muted-foreground">{r.description || "No description"}</div>
          </div>
        </div>
      )
    },
    { key: "userCount", header: "Users", sortable: true, className: "text-right", render: (r) => <span className="font-medium">{r.userCount}</span> },
    {
      key: "permissions", header: "Permissions", render: (r) => (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{r.permissions.length} of {allPerms.length}</span>
      )
    },
  ];

  const actions: RowAction<Role>[] = [
    { label: "View", icon: Eye, onClick: (r) => setViewRole(r) },
    { label: "Edit", icon: Pencil, onClick: (r) => { setForm({ name: r.name, description: r.description || "" }); setEditRole(r); } },
    { label: "Assign Permissions", icon: KeyRound, onClick: openPerms },
    { label: "Clone", icon: Copy, onClick: handleClone },
    { label: "Delete", icon: Trash2, onClick: (r) => setDeleteRole(r), destructive: true, separatorBefore: true, show: (r) => !r.isSystem && r.userCount === 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Define granular access controls for every admin function."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Roles & Permissions" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />Refresh
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => { setForm({ name: "", description: "" }); setCreateOpen(true); }}>
              <Plus className="h-4 w-4" />Create Role
            </Button>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Total Roles" value={total.toString()} icon={ShieldCheck} />
        <KpiCard label="Permissions" value={allPerms.length.toString()} icon={KeyRound} />
        <KpiCard label="Assigned Users" value={items.reduce((s, r) => s + r.userCount, 0).toString()} icon={ShieldCheck} tone="success" />
        <KpiCard label="System Roles" value={items.filter((r) => r.isSystem).length.toString()} icon={ShieldCheck} />
      </div>

      <DataTable
        data={items}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        searchPlaceholder="Search roles…"
        searchKeys={["name", "description"]}
        rowActions={actions}
        emptyTitle="No roles defined"
        emptyDescription="Create a role to control what admins can access."
      />

      {/* Create Role Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
            <DialogDescription>Define a new access role for admin users.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Role Name *">
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Collections Manager" />
            </FormField>
            <FormField label="Description">
              <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description of this role" />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Creating…" : "Create Role"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={!!editRole} onOpenChange={(o) => !o && setEditRole(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>{editRole?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Role Name">
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </FormField>
            <FormField label="Description">
              <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRole(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Role Modal */}
      <Dialog open={!!viewRole} onOpenChange={(o) => !o && setViewRole(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>{viewRole?.name}</DialogTitle>
            <DialogDescription>{viewRole?.description || "No description"}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Permissions ({viewRole?.permissions.length ?? 0})
            </div>
            {permCatalog.map((g) => {
              const grantedInGroup = g.items.filter((i) => viewRole?.permissions.includes(i.key));
              if (!grantedInGroup.length) return null;
              return (
                <div key={g.group} className="mb-4">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {grantedInGroup.map((p) => (
                      <span key={p.key} className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">{p.key}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            {!viewRole?.permissions.length && (
              <div className="text-sm text-muted-foreground">No permissions assigned.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Permissions Modal */}
      <Dialog open={!!permRole} onOpenChange={(o) => !o && setPermRole(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle>Permissions — {permRole?.name}</DialogTitle>
            <DialogDescription>Toggle capabilities available to users with this role.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {permCatalog.map((g) => {
              const groupKeys = g.items.map((i) => i.key);
              const allGroupSelected = groupKeys.every((k) => selectedPerms.includes(k));
              const someGroupSelected = groupKeys.some((k) => selectedPerms.includes(k));
              return (
                <div key={g.group}>
                  <div className="mb-2 flex items-center gap-2">
                    <Checkbox
                      checked={allGroupSelected}
                      onCheckedChange={(v) => toggleGroup(g, !!v)}
                      className={someGroupSelected && !allGroupSelected ? "data-[state=unchecked]:border-primary" : ""}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</span>
                    <span className="text-[10px] text-muted-foreground">({groupKeys.filter((k) => selectedPerms.includes(k)).length}/{groupKeys.length})</span>
                  </div>
                  <div className="ml-6 space-y-2">
                    {g.items.map((p) => {
                      const checked = selectedPerms.includes(p.key);
                      return (
                        <label key={p.key} className="flex cursor-pointer items-center justify-between rounded-md border border-border p-3 hover:bg-muted/40">
                          <div>
                            <div className="text-sm font-medium">{p.description}</div>
                            <div className="text-xs text-muted-foreground font-mono">{p.key}</div>
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
          <DialogFooter className="border-t border-border px-6 py-3 sm:justify-between">
            <div className="text-xs text-muted-foreground">{selectedPerms.length} of {allPerms.length} permissions selected</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPermRole(null)}>Cancel</Button>
              <Button onClick={savePerms} disabled={saving}>{saving ? "Saving…" : "Save Permissions"}</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteRole}
        onOpenChange={(o) => !o && setDeleteRole(null)}
        title="Delete this role?"
        description={deleteRole ? `"${deleteRole.name}" will be permanently removed.` : ""}
        onConfirm={handleDelete}
        confirmLabel="Delete Role"
        destructive
      />
    </div>
  );
}
