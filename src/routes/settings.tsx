import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  CreditCard,
  Bell,
  Smartphone,
  Shield,
  ScrollText,
  Save,
  Apple,
  CheckCircle2,
  XCircle,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Globe,
  Radio,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
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
  { id: "general", label: "General", desc: "Identity, locale & branding", icon: Building2 },
  { id: "loan", label: "Loan Settings", desc: "EMI, grace & penalties", icon: CreditCard },
  { id: "notification", label: "Notifications", desc: "Broadcast channels", icon: Bell },
  { id: "device", label: "Device Settings", desc: "MDM heartbeat & telemetry", icon: Smartphone },
  { id: "ios-mdm", label: "iOS MDM", desc: "Apple Business & NanoMDM", icon: Apple },
  { id: "dealer-app", label: "Dealer App Update", desc: "Version control & rollout", icon: RefreshCw },
  { id: "security", label: "Security", desc: "Password & session timeout", icon: Shield },
  { id: "audit", label: "Audit & Retention", desc: "Data lifecycle policies", icon: ScrollText },
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
    <div className={cn(
      "col-span-2 flex items-center justify-between rounded-xl border p-4.5 transition-all duration-200",
      ok
        ? "border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/30"
        : "border-border/70 bg-card/40 hover:border-border"
    )}>
      <div className="space-y-0.5 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">{label}</span>
          {ok && (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">{description}</div>
      </div>
      {ok ? (
        <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
          <CheckCircle2 className="h-4 w-4" />Configured
        </span>
      ) : (
        <span className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground shrink-0">
          <XCircle className="h-4 w-4 text-muted-foreground/60" />Not configured
        </span>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold tracking-tight text-foreground/90">{label}</Label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  badge,
  children
}: {
  title: string;
  description: string;
  icon?: any;
  badge?: string;
  children: React.ReactNode
}) {
  return (
    <div className="card-surface rounded-2xl border border-border/80 shadow-sm overflow-hidden transition-all duration-200">
      <div className="border-b border-border/60 bg-muted/15 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          {badge && (
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
      </div>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={cn(
      "col-span-2 flex items-center justify-between rounded-xl border p-4.5 transition-all duration-200 cursor-pointer select-none",
      value
        ? "border-primary/30 bg-primary/[0.03] shadow-xs"
        : "border-border/70 bg-card/40 hover:border-border"
    )}
    onClick={() => onChange(!value)}
    >
      <div className="pr-4 space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">{label}</span>
          {value && (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">{description}</div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Switch checked={value} onCheckedChange={onChange} />
      </div>
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
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>Loading platform configuration…</span>
    </div>
  );

  const activeTabMeta = tabs.find((t) => t.id === tab);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Platform Settings"
        description="Configure NexLock security policies, device telemetry, and financing operations."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Platform Settings" }]}
        actions={
          <div className="flex items-center gap-2.5">
            {dirty && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                <AlertTriangle className="h-3.5 w-3.5" /> Unsaved changes
              </span>
            )}
            <Button
              size="sm"
              className={cn(
                "gap-1.5 shadow-sm transition-all",
                dirty ? "shadow-primary/20 bg-primary hover:bg-primary/95 ring-2 ring-primary/20" : ""
              )}
              onClick={save}
              disabled={!dirty || saving}
            >
              <Save className="h-4 w-4" />{saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          <nav className="card-surface rounded-2xl border border-border/80 p-2 space-y-1 shadow-xs">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Configuration Modules
            </div>
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <t.icon className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:scale-105",
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div className="flex-1 truncate">
                    <div className="truncate text-xs font-semibold leading-tight">{t.label}</div>
                    <div className={cn(
                      "truncate text-[10px] leading-tight mt-0.5",
                      active ? "text-primary-foreground/80" : "text-muted-foreground/70"
                    )}>
                      {t.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick Engine Status Card */}
          <div className="card-surface rounded-2xl border border-border/80 p-4 space-y-3 hidden lg:block">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground/80">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Nexus Engine
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                v2.5 Live
              </span>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Active Region</span>
                <span className="font-mono text-foreground font-medium">{values.timezone.split("/")[1] || "Asia"}</span>
              </div>
              <div className="flex justify-between">
                <span>Heartbeat Cadence</span>
                <span className="font-mono text-foreground font-medium">{values.heartbeatInterval} min</span>
              </div>
              <div className="flex justify-between">
                <span>Lock Policy</span>
                <span className="font-mono text-foreground font-medium capitalize">{values.passwordPolicy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* GENERAL */}
          {tab === "general" && (
            <SectionCard
              title="General System Identity"
              description="Platform title, organizational branding, and regional localization standards."
              icon={Building2}
              badge="Core System"
            >
              <Field label="Platform Name" hint="Displayed in the top navigation bar, browser tabs, and notification footers.">
                <Input
                  value={values.platformName}
                  onChange={(e) => patch("platformName", e.target.value)}
                  className="bg-card/50 font-medium"
                />
              </Field>
              <Field label="Company Logo URL" hint="HTTPS link to SVG, PNG, or WebP logo icon asset.">
                <Input
                  value={values.companyLogo}
                  onChange={(e) => patch("companyLogo", e.target.value)}
                  placeholder="https://cdn.example.com/logo.png"
                  className="bg-card/50"
                />
              </Field>
              <Field label="Primary Time Zone" hint="Calculates EMI due dates, grace period expiry, and heartbeat windows.">
                <Select value={values.timezone} onValueChange={(v) => patch("timezone", v)}>
                  <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Asia/Kolkata", "Asia/Singapore", "Asia/Dubai", "Europe/London", "America/New_York"].map((z) => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Operational Currency" hint="Standard monetary symbol applied across all loan contracts and receipts.">
                <Select value={values.currency} onValueChange={(v) => patch("currency", v)}>
                  <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR — Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                    <SelectItem value="AED">AED — UAE Dirham (د.إ)</SelectItem>
                    <SelectItem value="SGD">SGD — Singapore Dollar (S$)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date Display Format" hint="Standard localized timestamp representation across all reports and tables.">
                <Select value={values.dateFormat} onValueChange={(v) => patch("dateFormat", v)}>
                  <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD-MM-YYYY">DD-MM-YYYY (e.g. 13-11-2026)</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (e.g. 11/13/2026)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </SectionCard>
          )}

          {/* LOAN SETTINGS */}
          {tab === "loan" && (
            <SectionCard
              title="Loan & EMI Configuration"
              description="Default financing terms, grace windows, penalty structures, and settlement rules."
              icon={CreditCard}
              badge="Financing Engine"
            >
              <Field label="Default Loan Duration (Months)" hint="Default term applied to newly initialized financing contracts.">
                <Input
                  type="number"
                  min={1}
                  max={360}
                  value={values.defaultLoanDuration}
                  onChange={(e) => patch("defaultLoanDuration", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Grace Period Window (Days)" hint="Days allowed past the due date before penalty accrual and auto-lock triggers.">
                <Input
                  type="number"
                  min={0}
                  max={30}
                  value={values.gracePeriod}
                  onChange={(e) => patch("gracePeriod", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Default Penalty Surcharge (%)" hint="Monthly compounding percentage applied to overdue instalment balances.">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={values.defaultPenalty}
                  onChange={(e) => patch("defaultPenalty", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <div className="md:col-span-2 space-y-3.5 pt-2">
                <ToggleRow
                  label="Allow Partial EMI Settlements"
                  description="Permit consumers to submit payments smaller than the scheduled monthly instalment."
                  value={values.allowPartialPayments}
                  onChange={(v) => patch("allowPartialPayments", v)}
                />
                <ToggleRow
                  label="Auto-close Completed Financing Contracts"
                  description="Automatically transition loan state to Completed when ledger balance reaches zero."
                  value={values.autoCloseCompletedLoan}
                  onChange={(v) => patch("autoCloseCompletedLoan", v)}
                />
              </div>
            </SectionCard>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notification" && (
            <SectionCard
              title="Global Notification Channels"
              description="Toggle multi-channel messaging routes for borrower reminders and dealer alerts."
              icon={Bell}
              badge="Broadcast Gateway"
            >
              <ToggleRow
                label="Email Notifications (SMTP Gateway)"
                description="Deliver payment receipts, delinquency notices, and statements via transactional email."
                value={values.emailNotifications}
                onChange={(v) => patch("emailNotifications", v)}
              />
              <ToggleRow
                label="SMS Notifications (Telecom Gateway)"
                description="Send mission-critical OTPs, due-date alerts, and lockout warnings via high-priority SMS."
                value={values.smsNotifications}
                onChange={(v) => patch("smsNotifications", v)}
              />
              <ToggleRow
                label="FCM Push Notifications"
                description="Send realtime MDM push notifications and silent triggers directly to enrolled mobile devices."
                value={values.pushNotifications}
                onChange={(v) => patch("pushNotifications", v)}
              />
            </SectionCard>
          )}

          {/* DEVICE SETTINGS */}
          {tab === "device" && (
            <SectionCard
              title="Device Telemetry & Command Protocol"
              description="Heartbeat cadence, offline detection thresholds, and remote command retry limits."
              icon={Smartphone}
              badge="MDM Protocol"
            >
              <Field label="Heartbeat Ping Interval (Minutes)" hint="Cadence at which enrolled handsets transmit telemetry and state to Nexus.">
                <Input
                  type="number"
                  min={1}
                  max={1440}
                  value={values.heartbeatInterval}
                  onChange={(e) => patch("heartbeatInterval", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Offline Timeout Threshold (Minutes)" hint="Duration of silence before an enrolled handset is flagged as Offline.">
                <Input
                  type="number"
                  min={1}
                  max={10080}
                  value={values.offlineTimeout}
                  onChange={(e) => patch("offlineTimeout", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="GPS Location Update Cadence (Minutes)" hint="Android only — GPS location reporting frequency. iOS MDM does not support GPS polling.">
                <Input
                  type="number"
                  min={1}
                  max={1440}
                  value={values.locationUpdateInterval}
                  onChange={(e) => patch("locationUpdateInterval", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Command Execution Retry Count" hint="Number of retry attempts executed when a remote command fails or drops.">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={values.commandRetryCount}
                  onChange={(e) => patch("commandRetryCount", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Command Wait Timeout (Seconds)" hint="Maximum duration allowed for an enrolled client to acknowledge command reception.">
                <Input
                  type="number"
                  min={10}
                  max={3600}
                  value={values.commandTimeout}
                  onChange={(e) => patch("commandTimeout", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
            </SectionCard>
          )}

          {/* IOS MDM */}
          {tab === "ios-mdm" && (
            <SectionCard
              title="Apple iOS MDM & Business Manager Infrastructure"
              description="Real-time telemetry and configuration status of Apple device enrollment and supervision services."
              icon={Apple}
              badge="Apple Supervised"
            >
              {iosMdmLoading && !iosMdmStatus ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-10 gap-3 text-sm text-muted-foreground">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Querying Apple MDM status and certificates…</span>
                </div>
              ) : iosMdmStatus ? (
                <>
                  <StatusRow
                    label="NanoMDM Server Engine"
                    description="The core MDM check-in, APNs push dispatcher, and command orchestration server every enrolled iPhone communicates with."
                    ok={iosMdmStatus.nanomdm.configured}
                  />
                  <StatusRow
                    label="SCEP PKI CA Authority"
                    description="Issues and signs the client identity x509 identity certificates required for secure mutual TLS iOS communication."
                    ok={iosMdmStatus.scep.configured}
                  />
                  <StatusRow
                    label="Lock-screen Kiosk App Bundle ID"
                    description="Required for remote device lockdown to pin Autonomous Single App Mode (ASAM) to the NexLock iOS client."
                    ok={iosMdmStatus.lockscreenApp.configured}
                  />
                  <StatusRow
                    label="NanoDEP Server (Apple Business Manager)"
                    description="Direct synchronization gateway with Apple Business Manager (ABM) for automated zero-touch enrollment."
                    ok={iosMdmStatus.nanodep.configured}
                  />
                  <StatusRow
                    label="DEP Enrollment Profile Defined"
                    description="The mandatory Apple Business Manager supervision profile assigned to hardware during factory unboxing."
                    ok={iosMdmStatus.nanodep.profileDefined}
                  />
                  <StatusRow
                    label="Apple VPP Volume Purchase Auto-Install"
                    description="Automates silent distribution of the lock-screen kiosk client upon activation (requires Apple Custom App approval)."
                    ok={iosMdmStatus.vpp.configured}
                  />
                </>
              ) : (
                <div className="col-span-2 rounded-xl border border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                  <Apple className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="font-medium text-foreground">Could not query iOS MDM status</p>
                  <p className="text-xs text-muted-foreground mt-1">Verify backend Apple APNs certificates and NanoMDM environment credentials.</p>
                </div>
              )}
            </SectionCard>
          )}

          {/* DEALER APP UPDATE */}
          {tab === "dealer-app" && (
            <SectionCard
              title="Dealer Mobile App Release Management"
              description="Controls version gating, minimum compatible build numbers, and play store rollout advisories."
              icon={RefreshCw}
              badge="Android Build"
            >
              <div className="col-span-2 mb-2 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Version Code Strategy: </span>
                  Input the numeric <code className="font-mono text-primary font-bold">versionCode</code> from <code className="font-mono">android/app/build.gradle</code>.
                  Devices with a build below the minimum version code will be immediately gated behind a mandatory full-screen update block.
                </div>
              </div>

              <Field
                label="Minimum Required Version Code"
                hint="Dealers below this build number cannot access any functions until upgraded."
              >
                <Input
                  type="number"
                  min={1}
                  value={values.dealerAppMinVersionCode}
                  onChange={(e) => patch("dealerAppMinVersionCode", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field
                label="Latest Available Version Code"
                hint="Dealers between minimum and latest will receive a dismissible update prompt."
              >
                <Input
                  type="number"
                  min={1}
                  value={values.dealerAppLatestVersionCode}
                  onChange={(e) => patch("dealerAppLatestVersionCode", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Display Version Name" hint="Public semver string shown to dealers (e.g. 1.2.4).">
                <Input
                  value={values.dealerAppLatestVersionName}
                  onChange={(e) => patch("dealerAppLatestVersionName", e.target.value)}
                  placeholder="1.0.7"
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Google Play Store Link" hint="Destination URL launched when dealer taps the Update action.">
                <Input
                  value={values.dealerAppPlayStoreUrl}
                  onChange={(e) => patch("dealerAppPlayStoreUrl", e.target.value)}
                  placeholder="https://play.google.com/store/apps/details?id=com.nexlock.dealer"
                  className="bg-card/50"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Release Advisory Message" hint="Advisory text rendered on both mandatory and optional update dialogs.">
                  <Textarea
                    rows={3}
                    value={values.dealerAppUpdateMessage}
                    onChange={(e) => patch("dealerAppUpdateMessage", e.target.value)}
                    className="bg-card/50 resize-y"
                  />
                </Field>
              </div>
            </SectionCard>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <SectionCard
              title="Identity & Authentication Security"
              description="Configure password entropy requirements, idle session expirations, and brute-force lockout rules."
              icon={Shield}
              badge="SOC 2 Standard"
            >
              <Field label="Password Complexity Tier" hint="Standard password strength enforced during administrator registration and reset.">
                <Select value={values.passwordPolicy} onValueChange={(v) => patch("passwordPolicy", v)}>
                  <SelectTrigger className="bg-card/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low — Minimum 6 characters</SelectItem>
                    <SelectItem value="medium">Medium — 8+ characters, uppercase and numbers</SelectItem>
                    <SelectItem value="high">High — 12+ characters, symbols and mixed case</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Idle Session Expiry (Minutes)" hint="Automatically invalidate administrative tokens after continuous period of inactivity.">
                <Input
                  type="number"
                  min={5}
                  max={1440}
                  value={values.sessionTimeout}
                  onChange={(e) => patch("sessionTimeout", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Max Failed Login Attempts" hint="Temporary IP/account lockout enforced after consecutive credential failures.">
                <Input
                  type="number"
                  min={3}
                  max={20}
                  value={values.maxLoginAttempts}
                  onChange={(e) => patch("maxLoginAttempts", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
            </SectionCard>
          )}

          {/* AUDIT */}
          {tab === "audit" && (
            <SectionCard
              title="Data Retention & Audit Lifecycle"
              description="Compliance retention windows for telemetry trails, audit logs, and scheduled report exports."
              icon={ScrollText}
              badge="Data Hygiene"
            >
              <Field label="Audit Log Archival Retention (Days)" hint="Automated purge threshold for administrative security audit trails.">
                <Input
                  type="number"
                  min={30}
                  max={3650}
                  value={values.auditLogRetention}
                  onChange={(e) => patch("auditLogRetention", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
              <Field label="Generated Report Retention (Days)" hint="Storage purge threshold for historical CSV/PDF report artifacts.">
                <Input
                  type="number"
                  min={7}
                  max={365}
                  value={values.reportRetention}
                  onChange={(e) => patch("reportRetention", +e.target.value)}
                  className="bg-card/50 font-mono font-medium"
                />
              </Field>
            </SectionCard>
          )}

          {/* Floating Unsaved Changes Bar */}
          {dirty && (
            <div className="sticky bottom-6 z-20 flex items-center justify-between rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-md px-6 py-4 shadow-xl shadow-primary/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/25">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">You have unsaved changes</div>
                  <div className="text-xs text-muted-foreground">Changes to <span className="font-medium text-foreground">{activeTabMeta?.label}</span> have not been committed.</div>
                </div>
              </div>
              <Button size="sm" onClick={save} disabled={saving} className="gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />{saving ? "Saving…" : "Save Now"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
