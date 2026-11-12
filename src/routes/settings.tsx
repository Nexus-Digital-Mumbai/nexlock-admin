import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import { Building2, CreditCard, Bell, Smartphone, Shield, ScrollText, Save, Apple, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Platform Settings — NexLock Admin" }] }),
  component: SettingsPage,
});

interface PlatformSettings {
  platformName: string;
  companyLogo: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  defaultLoanDuration: number;
  gracePeriod: number;
  defaultPenalty: number;
  allowPartialPayments: boolean;
  autoCloseCompletedLoan: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  heartbeatInterval: number;
  offlineTimeout: number;
  locationUpdateInterval: number;
  commandRetryCount: number;
  commandTimeout: number;
  passwordPolicy: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  auditLogRetention: number;
  reportRetention: number;
  dealerAppMinVersionCode: number;
  dealerAppLatestVersionCode: number;
  dealerAppLatestVersionName: string;
  dealerAppPlayStoreUrl: string;
  dealerAppUpdateMessage: string;
}

const DEFAULTS: PlatformSettings = {
  platformName: "NexLock", companyLogo: "", timezone: "Asia/Kolkata", currency: "INR", dateFormat: "DD-MM-YYYY",
  defaultLoanDuration: 12, gracePeriod: 3, defaultPenalty: 2, allowPartialPayments: true, autoCloseCompletedLoan: true,
  emailNotifications: true, smsNotifications: true, pushNotifications: true,
  heartbeatInterval: 15, offlineTimeout: 60, locationUpdateInterval: 30, commandRetryCount: 3, commandTimeout: 120,
  passwordPolicy: "medium", sessionTimeout: 30, maxLoginAttempts: 5,
  auditLogRetention: 365, reportRetention: 90,
  dealerAppMinVersionCode: 1, dealerAppLatestVersionCode: 1, dealerAppLatestVersionName: "1.0.0",
  dealerAppPlayStoreUrl: "", dealerAppUpdateMessage: "A new version of the NexLock Dealer app is available.",
};

const tabs = [
  { id: "general", label: "General", icon: Building2 },
  { id: "loan", label: "Loan Settings", icon: CreditCard },
  { id: "notification", label: "Notifications", icon: Bell },
  { id: "device", label: "Device Settings", icon: Smartphone },
  { id: "ios-mdm", label: "iOS MDM", icon: Apple },
  { id: "dealer-app", label: "Dealer App Update", icon: RefreshCw },
  { id: "security", label: "Security", icon: Shield },
  { id: "audit", label: "Audit & Retention", icon: ScrollText },
];

interface IosMdmStatus {
  nanomdm: { configured: boolean };
  scep: { configured: boolean };
  lockscreenApp: { configured: boolean };
  nanodep: { configured: boolean; profileDefined: boolean };
  vpp: { configured: boolean };
}

function StatusRow({ label, description, ok }: { label: string; description: string; ok: boolean }) {
  return (
    <div className="col-span-2 flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      {ok ? (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
          <CheckCircle2 className="h-4 w-4" />Configured
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <XCircle className="h-4 w-4" />Not configured
        </span>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="card-surface rounded-xl border border-border p-6">
      <div className="mb-5 border-b border-border pb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="col-span-2 flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("general");
  const [values, setValues] = useState<PlatformSettings>(DEFAULTS);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [iosMdmStatus, setIosMdmStatus] = useState<IosMdmStatus | null>(null);
  const [iosMdmLoading, setIosMdmLoading] = useState(false);

  const loadIosMdmStatus = useCallback(async () => {
    setIosMdmLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: IosMdmStatus }>("/mdm-ios/status");
      if (res.success) setIosMdmStatus(res.data);
    } catch {
      // Non-fatal — the tab just shows nothing rather than blocking the whole settings page.
    } finally {
      setIosMdmLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "ios-mdm" && !iosMdmStatus && !iosMdmLoading) loadIosMdmStatus();
  }, [tab, iosMdmStatus, iosMdmLoading, loadIosMdmStatus]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>("/settings");
      setValues({ ...DEFAULTS, ...res.data });
      setDirty(false);
    } catch { toast.error("Failed to load settings"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const patch = <K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.put("/settings", values);
      toast.success("Settings saved", { description: "Platform configuration has been updated." });
      setDirty(false);
    } catch (e: any) { toast.error(e.message || "Failed to save settings"); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex min-h-[400px] items-center justify-center text-sm text-muted-foreground">Loading settings…</div>
  );

  return (
    <div>
      <PageHeader
        title="Platform Settings"
        description="Configure NexLock for your device financing operations."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Platform Settings" }]}
        actions={
          <Button size="sm" className="gap-1.5" onClick={save} disabled={!dirty || saving}>
            <Save className="h-4 w-4" />{saving ? "Saving…" : "Save Changes"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Side nav */}
        <nav className="card-surface h-fit rounded-xl border border-border p-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                tab === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4 shrink-0" />{t.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {/* GENERAL */}
          {tab === "general" && (
            <SectionCard title="General" description="Platform name, branding, and locale settings.">
              <Field label="Platform Name" hint="Displayed in the top bar and email footers.">
                <Input value={values.platformName} onChange={(e) => patch("platformName", e.target.value)} />
              </Field>
              <Field label="Company Logo URL" hint="HTTPS URL to your logo image.">
                <Input value={values.companyLogo} onChange={(e) => patch("companyLogo", e.target.value)} placeholder="https://cdn.example.com/logo.png" />
              </Field>
              <Field label="Time Zone">
                <Select value={values.timezone} onValueChange={(v) => patch("timezone", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Asia/Kolkata", "Asia/Singapore", "Asia/Dubai", "Europe/London", "America/New_York"].map((z) => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Currency">
                <Select value={values.currency} onValueChange={(v) => patch("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                    <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                    <SelectItem value="SGD">SGD — Singapore Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date Format">
                <Select value={values.dateFormat} onValueChange={(v) => patch("dateFormat", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SectionCard>
          )}

          {/* LOAN SETTINGS */}
          {tab === "loan" && (
            <SectionCard title="Loan Settings" description="Default EMI and collection parameters.">
              <Field label="Default Loan Duration (months)" hint="Months for new loan schedules if not specified.">
                <Input type="number" min={1} max={360} value={values.defaultLoanDuration} onChange={(e) => patch("defaultLoanDuration", +e.target.value)} />
              </Field>
              <Field label="Grace Period (days)" hint="Days after due date before penalty applies.">
                <Input type="number" min={0} max={30} value={values.gracePeriod} onChange={(e) => patch("gracePeriod", +e.target.value)} />
              </Field>
              <Field label="Default Penalty Rate (%)" hint="Monthly penalty on overdue EMI amount.">
                <Input type="number" min={0} max={100} step={0.5} value={values.defaultPenalty} onChange={(e) => patch("defaultPenalty", +e.target.value)} />
              </Field>
              <div className="md:col-span-2 space-y-3">
                <ToggleRow
                  label="Allow Partial Payments"
                  description="Accept EMI payments less than the full instalment amount."
                  value={values.allowPartialPayments}
                  onChange={(v) => patch("allowPartialPayments", v)}
                />
                <ToggleRow
                  label="Auto-close Completed Loans"
                  description="Automatically mark loans as Completed when all EMIs are paid."
                  value={values.autoCloseCompletedLoan}
                  onChange={(v) => patch("autoCloseCompletedLoan", v)}
                />
              </div>
            </SectionCard>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notification" && (
            <SectionCard title="Notification Channels" description="Enable or disable global notification delivery channels.">
              <ToggleRow label="Email Notifications" description="Send notifications via email." value={values.emailNotifications} onChange={(v) => patch("emailNotifications", v)} />
              <ToggleRow label="SMS Notifications" description="Send notifications via SMS." value={values.smsNotifications} onChange={(v) => patch("smsNotifications", v)} />
              <ToggleRow label="Push Notifications" description="Send push notifications to mobile devices." value={values.pushNotifications} onChange={(v) => patch("pushNotifications", v)} />
            </SectionCard>
          )}

          {/* DEVICE SETTINGS */}
          {tab === "device" && (
            <SectionCard title="Device Settings" description="MDM heartbeat, location, and command parameters.">
              <Field label="Heartbeat Interval (minutes)" hint="How often devices check in with the server.">
                <Input type="number" min={1} max={1440} value={values.heartbeatInterval} onChange={(e) => patch("heartbeatInterval", +e.target.value)} />
              </Field>
              <Field label="Offline Timeout (minutes)" hint="Minutes before a device is marked as offline.">
                <Input type="number" min={1} max={10080} value={values.offlineTimeout} onChange={(e) => patch("offlineTimeout", +e.target.value)} />
              </Field>
              <Field label="Location Update Interval (minutes)" hint="Android only — how often the device reports its GPS location. Apple MDM has no equivalent for iOS devices.">
                <Input type="number" min={1} max={1440} value={values.locationUpdateInterval} onChange={(e) => patch("locationUpdateInterval", +e.target.value)} />
              </Field>
              <Field label="Command Retry Count" hint="Times to retry a failed MDM command.">
                <Input type="number" min={1} max={10} value={values.commandRetryCount} onChange={(e) => patch("commandRetryCount", +e.target.value)} />
              </Field>
              <Field label="Command Timeout (seconds)" hint="Maximum wait time for a device command to execute.">
                <Input type="number" min={10} max={3600} value={values.commandTimeout} onChange={(e) => patch("commandTimeout", +e.target.value)} />
              </Field>
            </SectionCard>
          )}

          {/* IOS MDM */}
          {tab === "ios-mdm" && (
            <SectionCard
              title="iOS MDM Configuration"
              description="Read-only status of NexLock's Apple device management setup. No secrets are shown — configure actual values via environment variables on the backend."
            >
              {iosMdmLoading && !iosMdmStatus ? (
                <div className="col-span-2 py-6 text-center text-sm text-muted-foreground">Checking configuration…</div>
              ) : iosMdmStatus ? (
                <>
                  <StatusRow
                    label="NanoMDM"
                    description="The MDM check-in/command server every enrolled iPhone talks to."
                    ok={iosMdmStatus.nanomdm.configured}
                  />
                  <StatusRow
                    label="SCEP"
                    description="Issues the device identity certificate every enrolling iPhone needs."
                    ok={iosMdmStatus.scep.configured}
                  />
                  <StatusRow
                    label="Lock-screen app bundle ID"
                    description="Required for LOCK to pin Single App Mode to the correct app."
                    ok={iosMdmStatus.lockscreenApp.configured}
                  />
                  <StatusRow
                    label="NanoDEP"
                    description="Talks to Apple Business Manager for zero-touch (DEP) enrollment."
                    ok={iosMdmStatus.nanodep.configured}
                  />
                  <StatusRow
                    label="DEP profile defined"
                    description="The one-time Apple Business Manager profile devices are assigned to."
                    ok={iosMdmStatus.nanodep.profileDefined}
                  />
                  <StatusRow
                    label="VPP auto-install"
                    description="Automatically installs the lock-screen app on enrollment — inert until this is configured (needs Apple Custom App approval first)."
                    ok={iosMdmStatus.vpp.configured}
                  />
                </>
              ) : (
                <div className="col-span-2 py-6 text-center text-sm text-muted-foreground">Couldn't load iOS MDM status.</div>
              )}
            </SectionCard>
          )}

          {/* DEALER APP UPDATE */}
          {tab === "dealer-app" && (
            <SectionCard
              title="Dealer App Update"
              description="Controls what the dealer app shows a dealer on launch, based on the version installed on their phone. Set the version code to the value in android/app/build.gradle (versionCode), not the version name (e.g. 1.0.7)."
            >
              <Field
                label="Minimum Supported Version Code"
                hint="Dealers on a build below this are blocked with a full-screen 'Update required' screen — nothing else in the app is reachable until they update. Leave equal to the latest release to force-update everyone immediately."
              >
                <Input
                  type="number"
                  min={1}
                  value={values.dealerAppMinVersionCode}
                  onChange={(e) => patch("dealerAppMinVersionCode", +e.target.value)}
                />
              </Field>
              <Field
                label="Latest Version Code"
                hint="Dealers on a build below this (but at or above the minimum) see a skippable 'update available' notice."
              >
                <Input
                  type="number"
                  min={1}
                  value={values.dealerAppLatestVersionCode}
                  onChange={(e) => patch("dealerAppLatestVersionCode", +e.target.value)}
                />
              </Field>
              <Field label="Latest Version Name" hint="Display only, e.g. 1.0.7 — shown in the update notice/screen.">
                <Input value={values.dealerAppLatestVersionName} onChange={(e) => patch("dealerAppLatestVersionName", e.target.value)} placeholder="1.0.7" />
              </Field>
              <Field label="Play Store Link" hint="Opened when a dealer taps Update.">
                <Input
                  value={values.dealerAppPlayStoreUrl}
                  onChange={(e) => patch("dealerAppPlayStoreUrl", e.target.value)}
                  placeholder="https://play.google.com/store/apps/details?id=com.nexlock.dealer"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Update Message" hint="Shown on both the force-update screen and the skippable notice.">
                  <Textarea
                    rows={3}
                    value={values.dealerAppUpdateMessage}
                    onChange={(e) => patch("dealerAppUpdateMessage", e.target.value)}
                  />
                </Field>
              </div>
            </SectionCard>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <SectionCard title="Security" description="Authentication policies and session controls.">
              <Field label="Password Policy" hint="Minimum strength required for admin passwords.">
                <Select value={values.passwordPolicy} onValueChange={(v) => patch("passwordPolicy", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low — min 6 characters</SelectItem>
                    <SelectItem value="medium">Medium — 8+ chars, mixed case</SelectItem>
                    <SelectItem value="high">High — 12+ chars, symbols required</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Session Timeout (minutes)" hint="Admin sessions expire after this period of inactivity.">
                <Input type="number" min={5} max={1440} value={values.sessionTimeout} onChange={(e) => patch("sessionTimeout", +e.target.value)} />
              </Field>
              <Field label="Maximum Login Attempts" hint="Account is locked after this many consecutive failures.">
                <Input type="number" min={3} max={20} value={values.maxLoginAttempts} onChange={(e) => patch("maxLoginAttempts", +e.target.value)} />
              </Field>
            </SectionCard>
          )}

          {/* AUDIT */}
          {tab === "audit" && (
            <SectionCard title="Audit & Retention" description="Control how long audit and report data is retained.">
              <Field label="Audit Log Retention (days)" hint="Audit logs older than this are purged automatically.">
                <Input type="number" min={30} max={3650} value={values.auditLogRetention} onChange={(e) => patch("auditLogRetention", +e.target.value)} />
              </Field>
              <Field label="Report Retention (days)" hint="Saved report history purged after this period.">
                <Input type="number" min={7} max={365} value={values.reportRetention} onChange={(e) => patch("reportRetention", +e.target.value)} />
              </Field>
            </SectionCard>
          )}

          {/* Floating save notice */}
          {dirty && (
            <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-5 py-3">
              <span className="text-sm text-primary font-medium">You have unsaved changes</span>
              <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
                <Save className="h-3.5 w-3.5" />{saving ? "Saving…" : "Save Now"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
