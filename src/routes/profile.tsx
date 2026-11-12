import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User, Lock, ShieldCheck, Activity, Save, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — NexLock Admin" }] }),
  component: ProfilePage,
});

const initials = (s: string) => s.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

function ProfilePage() {
  const currentUser = session.getUser();

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [sessions, setSessions] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) return;
    setLoading(true);
    apiClient.get<any>(`/users/${currentUser.userId}`)
      .then((res) => {
        setProfile({ name: res.data.name, email: res.data.email });
        setSessions(res.data.sessions || []);
        setLoginHistory(res.data.loginHistories || []);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [currentUser?.userId]);

  const saveProfile = async () => {
    if (!currentUser?.userId) return;
    setSaving(true);
    try {
      await apiClient.put(`/users/${currentUser.userId}`, { name: profile.name, email: profile.email });
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (pwd.next !== pwd.confirm) { toast.error("Passwords do not match"); return; }
    if (pwd.next.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    setPwdSaving(true);
    try {
      await apiClient.post("/auth/change-password", { currentPassword: pwd.current, newPassword: pwd.next });
      toast.success("Password changed", { description: "Your password has been updated." });
      setPasswordOpen(false);
      setPwd({ current: "", next: "", confirm: "" });
    } catch (e: any) {
      toast.error(e.message || "Failed to change password");
    } finally {
      setPwdSaving(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Session revoked");
    } catch { toast.error("Failed to revoke session"); }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center text-sm text-muted-foreground">Loading profile…</div>
  );

  const activeSessions = sessions.filter((s) => !s.isRevoked);

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your account information and active sessions."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Profile" }]}
        actions={
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setPwd({ current: "", next: "", confirm: "" }); setPasswordOpen(true); }}>
            <Lock className="h-4 w-4" />Change Password
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left — Avatar card */}
        <div className="space-y-4">
          <div className="card-surface flex flex-col items-center rounded-xl border border-border p-6">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">{initials(profile.name || "?")}</AvatarFallback>
            </Avatar>
            <div className="text-base font-semibold">{profile.name}</div>
            <div className="text-sm text-muted-foreground">{profile.email}</div>
            <div className="mt-3 rounded-md bg-muted px-3 py-1 text-xs font-medium">{currentUser?.role || "Admin"}</div>
          </div>

          <div className="card-surface rounded-xl border border-border p-4 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Stats</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Sessions</span>
              <span className="font-medium">{activeSessions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Login History</span>
              <span className="font-medium">{loginHistory.length} events</span>
            </div>
          </div>
        </div>

        {/* Right — Edit + Sessions */}
        <div className="space-y-6">
          <div className="card-surface rounded-xl border border-border p-6">
            <div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Account Information</span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full Name">
                <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              <Button size="sm" onClick={saveProfile} disabled={saving} className="gap-1.5">
                <Save className="h-4 w-4" />{saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="card-surface rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Active Sessions ({activeSessions.length})</span>
            </div>
            <div className="space-y-3">
              {activeSessions.length === 0 && (
                <div className="text-sm text-muted-foreground">No active sessions found.</div>
              )}
              {activeSessions.map((s) => (
                <div key={s.id} className="flex items-start justify-between rounded-lg border border-border p-4 gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{s.userAgent || "Unknown device"}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.ipAddress} · {fmtDate(s.createdAt)}</div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => revokeSession(s.id)}>
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-xl border border-border p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Recent Login History</span>
            </div>
            <div className="space-y-2">
              {loginHistory.slice(0, 10).map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">{h.ipAddress}</div>
                    <div className="text-xs text-muted-foreground">{fmtDate(h.createdAt)}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${h.status === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
                    {h.status}
                  </span>
                </div>
              ))}
              {!loginHistory.length && <div className="text-sm text-muted-foreground">No login history available.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4" />Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Current Password</Label>
              <Input type="password" value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">New Password</Label>
              <Input type="password" value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} placeholder="Min 6 characters" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Confirm New Password</Label>
              <Input type="password" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} placeholder="Repeat new password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button>
            <Button onClick={changePassword} disabled={pwdSaving}>{pwdSaving ? "Changing…" : "Change Password"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
