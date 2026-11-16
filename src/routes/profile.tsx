import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  User,
  Lock,
  ShieldCheck,
  Activity,
  Save,
  KeyRound,
  Laptop,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Fingerprint,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — NexLock Admin" }] }),
  component: ProfilePage,
});

const initials = (s: string) =>
  s
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "NX";

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

function getDeviceIcon(userAgent?: string) {
  if (!userAgent) return Laptop;
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return Smartphone;
  }
  return Laptop;
}

function Field({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <Label className="text-xs font-semibold tracking-tight text-foreground/90">{label}</Label>
      </div>
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
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!currentUser?.userId) return;
    setLoading(true);
    apiClient
      .get<any>(`/users/${currentUser.userId}`)
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
      await apiClient.put(`/users/${currentUser.userId}`, {
        name: profile.name,
        email: profile.email,
      });
      toast.success("Profile updated", { description: "Your account credentials have been saved." });
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (pwd.next !== pwd.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (pwd.next.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setPwdSaving(true);
    try {
      await apiClient.post("/auth/change-password", {
        currentPassword: pwd.current,
        newPassword: pwd.next,
      });
      toast.success("Password changed", {
        description: "Your administrative password has been updated securely.",
      });
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
      toast.success("Session revoked", { description: "The device has been signed out." });
    } catch {
      toast.error("Failed to revoke session");
    }
  };

  const copyUserId = () => {
    if (currentUser?.userId) {
      navigator.clipboard.writeText(currentUser.userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      toast.success("User ID copied to clipboard");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>Loading account credentials…</span>
      </div>
    );

  const activeSessions = sessions.filter((s) => !s.isRevoked);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="My Profile & Security"
        description="Manage your administrator credentials, active authentication sessions, and security logs."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "My Profile" }]}
        actions={
          <Button
            size="sm"
            variant="outline"
            className="gap-2 border-border/80 hover:bg-muted/60 shadow-xs"
            onClick={() => {
              setPwd({ current: "", next: "", confirm: "" });
              setPasswordOpen(true);
            }}
          >
            <KeyRound className="h-4 w-4 text-primary" />
            Change Password
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left — Identity Card */}
        <div className="space-y-5">
          <div className="card-surface relative flex flex-col items-center rounded-2xl border border-border/80 p-6 text-center shadow-sm overflow-hidden">
            {/* Top ambient banner accent */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent pointer-events-none" />

            <div className="relative mt-2 mb-4">
              <Avatar className="h-24 w-24 border-2 border-primary/30 ring-4 ring-primary/10 shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {initials(profile.name || currentUser?.name || "?")}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-emerald-500 shadow-xs" title="Session active" />
            </div>

            <div className="text-lg font-bold tracking-tight text-foreground">{profile.name || "Administrator"}</div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> {profile.email}
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                {currentUser?.role || "Super Admin"}
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Verified MFA
              </span>
            </div>

            {currentUser?.userId && (
              <button
                onClick={copyUserId}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground hover:bg-muted/60 transition-colors"
                title="Click to copy User ID"
              >
                <span className="flex items-center gap-1.5 font-mono truncate">
                  <Fingerprint className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{currentUser.userId}</span>
                </span>
                {copiedId ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Copy className="h-3.5 w-3.5 shrink-0 opacity-70" />
                )}
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="card-surface rounded-2xl border border-border/80 p-5 space-y-4 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between">
              <span>Security Posture</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Active Sessions</div>
                    <div className="text-sm font-bold text-foreground">{activeSessions.length} Devices</div>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Audit Log Records</div>
                    <div className="text-sm font-bold text-foreground">{loginHistory.length} Events</div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">30d Trail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Edit + Sessions + History */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="card-surface rounded-2xl border border-border/80 p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">Account Information</h3>
                  <p className="text-xs text-muted-foreground">Update your identity and registered administrator email.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Full Name" icon={User}>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  className="bg-card/50 font-medium"
                  placeholder="Administrator Name"
                />
              </Field>
              <Field label="Email Address" icon={Mail}>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="bg-card/50 font-medium"
                  placeholder="admin@example.com"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="sm" onClick={saveProfile} disabled={saving} className="gap-2 shadow-sm">
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="card-surface rounded-2xl border border-border/80 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">
                    Active Authentication Sessions ({activeSessions.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">Devices currently holding valid bearer tokens for your account.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {activeSessions.length === 0 && (
                <div className="rounded-xl border border-border/70 bg-card/40 p-6 text-center text-sm text-muted-foreground">
                  No active sessions found.
                </div>
              )}
              {activeSessions.map((s, idx) => {
                const DeviceIcon = getDeviceIcon(s.userAgent);
                return (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/70 bg-card/40 p-4 gap-4 transition-all duration-150 hover:border-border hover:bg-card/70"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground/80 shrink-0 mt-0.5">
                        <DeviceIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate text-foreground">
                            {s.userAgent || "Unknown Browser / Client"}
                          </span>
                          {idx === 0 && (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                              Current Device
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {s.ipAddress || "Unknown IP"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {fmtDate(s.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 text-destructive border-destructive/25 hover:bg-destructive/10 hover:border-destructive/40 transition-colors"
                      onClick={() => revokeSession(s.id)}
                    >
                      Revoke Access
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login History */}
          <div className="card-surface rounded-2xl border border-border/80 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Security Audit Trail</h3>
                  <p className="text-xs text-muted-foreground">Chronological log of authentication attempts and authorization checks.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {loginHistory.slice(0, 10).map((h) => {
                const isSuccess = h.status === "success";
                return (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-card/30 p-3.5 transition-colors hover:bg-card/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg text-xs",
                        isSuccess ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                      )}>
                        {isSuccess ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold font-mono text-foreground">{h.ipAddress}</div>
                        <div className="text-[11px] text-muted-foreground">{fmtDate(h.createdAt)}</div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        isSuccess
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "border border-destructive/20 bg-destructive/10 text-destructive"
                      )}
                    >
                      {h.status}
                    </span>
                  </div>
                );
              })}
              {!loginHistory.length && (
                <div className="rounded-xl border border-border/70 bg-card/40 p-6 text-center text-sm text-muted-foreground">
                  No login history records available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="card-elevated max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Change Administrative Password</DialogTitle>
                <DialogDescription className="text-xs">
                  Enter your current credentials and provide a strong new password.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Current Password</Label>
              <Input
                type="password"
                value={pwd.current}
                onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                className="bg-card/50"
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">New Password</Label>
              <Input
                type="password"
                value={pwd.next}
                onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                placeholder="Min 6 characters (uppercase, numbers recommended)"
                className="bg-card/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Confirm New Password</Label>
              <Input
                type="password"
                value={pwd.confirm}
                onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Re-type new password"
                className="bg-card/50"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>
              Cancel
            </Button>
            <Button onClick={changePassword} disabled={pwdSaving} className="gap-1.5">
              <Lock className="h-4 w-4" />
              {pwdSaving ? "Changing…" : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
