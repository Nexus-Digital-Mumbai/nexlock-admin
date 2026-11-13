import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Smartphone, CheckCircle2, Lock, Unlock, ShieldOff, Eye,
  Search, Wifi, WifiOff, Bluetooth, BluetoothOff, Battery, History, Zap,
  CreditCard, Phone, MapPin, ExternalLink, Bell, User, Sparkles, AlarmClock,
  Pencil, Trash2, Bug, Apple, RefreshCw, X
} from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { KpiCard } from "@/components/nexlock/KpiCard";
import { DataTable, type Column, type RowAction } from "@/components/nexlock/DataTable";
import { StatusBadge } from "@/components/nexlock/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/nexlock/ConfirmDialog";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [{ title: "Devices — Nexus Console" }] }),
  component: DevicesPage,
});

interface DealerOption {
  id: string;
  name: string;
}

type DevicePlatform = "ANDROID" | "IOS";

interface DeviceData {
  id: string;
  deviceCode: string;
  platform: DevicePlatform;
  udid: string | null;
  imei1: string;
  imei2: string | null;
  serialNumber: string | null;
  status: string;
  dealerId: string;
  dealer: { name: string; enabledFeatures?: string[] };
  customer: { name: string; customerCode: string; photoUrl: string | null } | null;
  brandName: string | null;
  modelName: string | null;
  commands: any[];
  lastSeen: string | null;
  batteryLevel: number | null;
  networkStatus: string | null;
  networkOperator: string | null;
  simPresent: boolean | null;
  phoneNumber: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  lastLocationAccuracy: number | null;
  lastLocationAt: string | null;
  wifiBlocked: boolean;
  bluetoothBlocked: boolean;
  wallpaperOverlayActive: boolean;
  devModeEnabled: boolean;
  enrollmentStatus: string | null;
  enrolledAt: string | null;
}

type CommandType =
  | "LOCK"
  | "UNLOCK"
  | "RELEASE_DEVICE"
  | "WIFI_BLOCK"
  | "WIFI_UNBLOCK"
  | "BLUETOOTH_BLOCK"
  | "BLUETOOTH_UNBLOCK"
  | "WALLPAPER_OVERLAY"
  | "WALLPAPER_OVERLAY_CLEAR"
  | "ALARM"
  | "ALARM_STOP"
  | "DEV_MODE_ENABLE"
  | "DEV_MODE_DISABLE"
  | "APPLY_RESTRICTIONS";

function DevicesPage() {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [dealers, setDealers] = useState<DealerOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const [search, setSearch] = useState("");
  const [dealerFilter, setDealerFilter] = useState("all");

  const [stats, setStats] = useState({ total: 0, locked: 0, unlocked: 0, released: 0 });

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const [sendingCommand, setSendingCommand] = useState<CommandType | null>(null);
  const [releaseConfirmOpen, setReleaseConfirmOpen] = useState(false);
  const [wifiBlockConfirmOpen, setWifiBlockConfirmOpen] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    apiClient.get("/dealers?limit=1000").then((res) => { if (res.success) setDealers(res.data); });
  }, []);

  const fetchDevices = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...(search ? { search } : {}),
        ...(dealerFilter && dealerFilter !== "all" ? { dealerId: dealerFilter } : {}),
      }).toString();

      const res = await apiClient.get(`/devices?${query}`);
      if (res.success) {
        setDevices(res.data);
        if (res.meta?.pagination) {
          const pg = res.meta.pagination;
          setPagination({ page: pg.page, limit: pg.limit, total: pg.total, pages: pg.pages });
        }
      }

      const summaryRes = await apiClient.get("/bi/summary");
      if (summaryRes.success) {
        setStats({
          total: summaryRes.data.totalDevicesEnrolled,
          locked: summaryRes.data.devicesLocked,
          unlocked: summaryRes.data.devicesUnlocked,
          released: summaryRes.data.devicesReleased,
        });
      }
    } catch (err: any) {
      toast.error("Failed to load devices list", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices(1);
  }, [search, dealerFilter]);

  const fetchDeviceDetails = async (device: DeviceData) => {
    setSelectedDevice(device);
    setViewOpen(true);
    try {
      const res = await apiClient.get(`/devices/${device.id}`);
      if (res.success) setSelectedDevice(res.data);
    } catch (err: any) {
      toast.error("Failed to load device details", { description: err.message });
    }
  };

  const refreshSelectedDevice = async (deviceId: string) => {
    const res = await apiClient.get(`/devices/${deviceId}`);
    if (res.success) setSelectedDevice(res.data);
  };

  const handleDeviceCommand = async (commandType: CommandType, device?: DeviceData) => {
    const target = device ?? selectedDevice;
    if (!target) return;
    if (commandType === "WIFI_BLOCK" && target.simPresent === false) {
      setWifiBlockConfirmOpen(true);
      return;
    }
    await queueCommand(commandType, target);
  };

  const queueCommand = async (commandType: CommandType, target: DeviceData) => {
    setSendingCommand(commandType);
    try {
      const res = await apiClient.post("/mdm/commands", {
        deviceId: target.id,
        commandType,
      });
      if (res.success) {
        toast.success(`${commandType.replace(/_/g, " ")} command queued`, {
          description: `${target.deviceCode} will pick it up on its next poll and acknowledge the result.`,
        });
        if (selectedDevice?.id === target.id) await refreshSelectedDevice(target.id);
        fetchDevices(pagination.page);
      }
    } catch (err: any) {
      toast.error(`Failed to queue ${commandType.replace(/_/g, " ")}`, { description: err.message });
    } finally {
      setSendingCommand(null);
    }
  };

  const handleSendReminder = async (device?: DeviceData) => {
    const target = device ?? selectedDevice;
    if (!target) return;
    setSendingReminder(true);
    try {
      const res = await apiClient.post(`/devices/${target.id}/send-reminder`);
      if (res.success) {
        toast.success("Payment reminder sent", { description: `Pushed to ${target.deviceCode}.` });
      }
    } catch (err: any) {
      toast.error("Failed to send reminder", { description: err.message });
    } finally {
      setSendingReminder(false);
    }
  };

  const [releaseRow, setReleaseRow] = useState<DeviceData | null>(null);
  const [deleteRow, setDeleteRow] = useState<DeviceData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [assigningDep, setAssigningDep] = useState(false);

  const deleteDevice = async () => {
    if (!deleteRow) return;
    setDeleting(true);
    try {
      const res = await apiClient.delete(`/devices/${deleteRow.id}`);
      if (res.success) {
        toast.success(`${deleteRow.deviceCode} deleted`);
        setDeleteRow(null);
        fetchDevices(pagination.page);
      }
    } catch (err: any) {
      toast.error("Failed to delete device", { description: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const [editSerialRow, setEditSerialRow] = useState<DeviceData | null>(null);
  const [serialInput, setSerialInput] = useState("");
  const [savingSerial, setSavingSerial] = useState(false);

  const openEditSerial = (device: DeviceData) => {
    setEditSerialRow(device);
    setSerialInput(device.serialNumber ?? "");
  };

  const handleSaveSerial = async () => {
    if (!editSerialRow) return;
    const trimmed = serialInput.trim();
    if (!trimmed) {
      toast.error("Serial number can't be empty");
      return;
    }
    setSavingSerial(true);
    try {
      const res = await apiClient.put(`/devices/${editSerialRow.id}`, { serialNumber: trimmed });
      if (res.success) {
        toast.success("Serial number updated", { description: `${editSerialRow.deviceCode} → ${trimmed}` });
        setEditSerialRow(null);
        if (selectedDevice?.id === editSerialRow.id) setSelectedDevice({ ...selectedDevice, serialNumber: trimmed });
        fetchDevices(pagination.page);
      }
    } catch (err: any) {
      toast.error("Failed to update serial number", { description: err.message });
    } finally {
      setSavingSerial(false);
    }
  };

  const handleAssignDep = async (device?: DeviceData) => {
    const target = device ?? selectedDevice;
    if (!target) return;
    setAssigningDep(true);
    try {
      const res = await apiClient.post(`/mdm-ios/devices/${target.id}/assign-dep`);
      if (res.success) {
        toast.success("Zero-touch enrollment enabled", {
          description: `Serial ${target.serialNumber} is now linked to Nexus DEP profile — erase and power on the iPhone to self-enroll.`,
        });
      }
    } catch (err: any) {
      toast.error("Failed to assign DEP", { description: err.message });
    } finally {
      setAssigningDep(false);
    }
  };

  const cols: Column<DeviceData>[] = [
    {
      key: "deviceCode",
      header: "Device Code",
      render: (r) => (
        <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
          {r.deviceCode}
        </span>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      render: (r) => (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
            r.platform === "IOS"
              ? "bg-slate-500/10 text-slate-300 border-slate-500/30"
              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
          }`}
        >
          {r.platform === "IOS" ? <Apple className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
          {r.platform === "IOS" ? "iOS" : "Android"}
        </span>
      ),
    },
    {
      key: "serialNumber",
      header: "Serial / IMEI 1",
      render: (r) => (
        <div className="space-y-0.5">
          <div className="font-mono text-xs text-foreground font-semibold">{r.serialNumber || "—"}</div>
          <div className="font-mono text-[10px] text-muted-foreground">{r.imei1}</div>
        </div>
      ),
    },
    {
      key: "brandName",
      header: "Hardware Model",
      render: (r) =>
        r.brandName || r.modelName ? (
          <div className="font-semibold text-foreground text-xs md:text-sm">
            {r.brandName} <span className="font-normal text-muted-foreground">{r.modelName}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/60 italic">Hardware Unrecorded</span>
        ),
    },
    {
      key: "dealer",
      header: "Assigned Dealer",
      render: (r) => <span className="text-xs font-medium text-foreground">{r.dealer?.name}</span>,
    },
    {
      key: "customer",
      header: "Consumer",
      render: (r) =>
        r.customer ? (
          <div className="flex items-center gap-2">
            {r.customer.photoUrl ? (
              <img src={r.customer.photoUrl} alt="" className="h-6 w-6 rounded-full object-cover border border-border" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                {r.customer.name.slice(0, 1)}
              </div>
            )}
            <span className="font-semibold text-foreground text-xs">{r.customer.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground/60 italic">In Inventory</span>
        ),
    },
    { key: "status", header: "Lock Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "enrolledAt",
      header: "Enrolled Date",
      render: (r) =>
        r.enrolledAt ? (
          <span className="text-xs text-muted-foreground font-medium">
            {new Date(r.enrolledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60 italic">Pending</span>
        ),
    },
  ];

  const actions: RowAction<DeviceData>[] = [
    { label: "View Details & Telemetry", icon: Eye, onClick: fetchDeviceDetails },
    { label: "Lock Device", icon: Lock, onClick: (r) => handleDeviceCommand("LOCK", r), show: (r) => r.enrollmentStatus === "ENROLLED", separatorBefore: true },
    { label: "Unlock Device", icon: Unlock, onClick: (r) => handleDeviceCommand("UNLOCK", r), show: (r) => r.enrollmentStatus === "ENROLLED" },
    { label: "Edit Serial Number", icon: Pencil, onClick: (r) => openEditSerial(r), show: (r) => r.platform === "IOS", separatorBefore: true },
    { label: "Assign DEP (Zero-Touch)", icon: Zap, onClick: (r) => handleAssignDep(r), show: (r) => r.platform === "IOS" && !!r.serialNumber },
    { label: "Release Device", icon: ShieldOff, onClick: (r) => setReleaseRow(r), show: (r) => r.enrollmentStatus === "ENROLLED", destructive: true },
    { label: "Delete Device", icon: Trash2, onClick: (r) => setDeleteRow(r), show: (r) => r.status === "In Stock", destructive: true },
  ];

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Financed Device Fleet"
        description="Active hardware fleet management, live telemetry tracking, and remote policy enforcement."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "Devices" }]}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Fleet Enrolled" value={stats.total.toLocaleString()} icon={Smartphone} tone="primary" />
        <KpiCard label="Locked (Policy Hold)" value={stats.locked.toLocaleString()} icon={Lock} tone="warning" />
        <KpiCard label="Active & Unlocked" value={stats.unlocked.toLocaleString()} icon={Unlock} tone="success" />
        <KpiCard label="Released (Settled)" value={stats.released.toLocaleString()} icon={ShieldOff} tone="primary" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" />
          <Input
            placeholder="Search by IMEI, Serial number, Device code, Brand or Model…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-11 pr-8 bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 rounded-full text-xs md:text-sm text-foreground focus-visible:bg-white shadow-xs"
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

        <div className="w-full md:w-64">
          <Select value={dealerFilter} onValueChange={setDealerFilter}>
            <SelectTrigger className="h-10 bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 rounded-full text-xs shadow-xs">
              <SelectValue placeholder="All Dealers" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl">
              <SelectItem value="all" className="text-xs font-semibold rounded-xl">All Authorized Dealers</SelectItem>
              {dealers.map((d) => (
                <SelectItem key={d.id} value={d.id} className="text-xs rounded-xl">{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        data={devices}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        rowActions={actions}
        hideSearch
        emptyTitle="No devices enrolled yet"
        emptyDescription="Devices will appear here once enrolled through authorized dealer store applications."
      />

      {pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-card px-5 py-3 rounded-xl border border-border/80 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">
            Page <span className="font-bold text-foreground">{pagination.page}</span> of <span className="font-bold text-foreground">{pagination.pages}</span> ({pagination.total} total devices)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => fetchDevices(pagination.page - 1)}
              className="h-8 text-xs font-semibold border-border/80"
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchDevices(pagination.page + 1)}
              className="h-8 text-xs font-semibold border-border/80"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* DEVICE DETAIL DIALOG */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col bg-card text-card-foreground border border-border/80 p-0 overflow-hidden rounded-2xl shadow-2xl">
          <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
              <span>Device Overview — {selectedDevice?.deviceCode}</span>
              {selectedDevice && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    selectedDevice.platform === "IOS"
                      ? "bg-slate-500/10 text-slate-300 border-slate-500/30"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  }`}
                >
                  {selectedDevice.platform === "IOS" ? <Apple className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                  {selectedDevice.platform === "IOS" ? "iOS" : "Android"}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Real-time hardware handshake telemetry, remote command dispatch, and audit trail.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 flex-1 overflow-y-auto min-h-0 space-y-6">
            {selectedDevice && (
              <>
                {/* Telemetry Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/20 p-4 border border-border/60 rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Current Status</span>
                        <div><StatusBadge status={selectedDevice.status} /></div>
                        <div className="text-xs text-muted-foreground mt-3">
                          Dealer: <span className="font-semibold text-foreground">{selectedDevice.dealer?.name}</span>
                        </div>
                        {selectedDevice.customer && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Customer: <span className="font-semibold text-foreground">{selectedDevice.customer.name}</span>
                          </div>
                        )}
                      </div>
                      {selectedDevice.customer && (
                        selectedDevice.customer.photoUrl ? (
                          <img
                            src={selectedDevice.customer.photoUrl}
                            alt={selectedDevice.customer.name}
                            className="h-12 w-12 rounded-full object-cover border border-border shrink-0 ring-2 ring-primary/20"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/20 p-4 border border-border/60 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Network Connectivity</span>
                      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Wifi className={`h-4 w-4 ${selectedDevice.lastSeen ? "text-emerald-500" : "text-muted-foreground"}`} />
                        {(selectedDevice.platform === "ANDROID" && selectedDevice.networkStatus) || (selectedDevice.lastSeen ? "Connected" : "No heartbeat")}
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-1.5">
                        Heartbeat: {selectedDevice.lastSeen ? new Date(selectedDevice.lastSeen).toLocaleString("en-IN") : "Never"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Battery</span>
                      <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-foreground">
                        <Battery className={`h-4 w-4 ${selectedDevice.batteryLevel != null ? "text-emerald-500" : "text-muted-foreground"}`} />
                        {selectedDevice.batteryLevel != null ? `${selectedDevice.batteryLevel}%` : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & SIM — Android only */}
                {selectedDevice.platform === "ANDROID" && (
                  <div className="bg-muted/20 p-4 border border-border/60 rounded-xl">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Hardware Telemetry & Location</span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5" />SIM State
                      </div>
                      <div className="text-right font-semibold text-foreground">
                        {selectedDevice.simPresent === null ? "No data" : selectedDevice.simPresent ? "Detected" : "Missing / Removed"}
                      </div>
                      {selectedDevice.networkOperator && (
                        <>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Wifi className="h-3.5 w-3.5" />Cellular Carrier
                          </div>
                          <div className="text-right font-semibold text-foreground">{selectedDevice.networkOperator}</div>
                        </>
                      )}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />SIM Phone Number
                      </div>
                      <div className="text-right font-mono font-semibold text-foreground">{selectedDevice.phoneNumber || "Not reported"}</div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />Last Geolocation
                      </div>
                      <div className="text-right font-medium text-foreground">
                        {selectedDevice.lastLocationAt ? new Date(selectedDevice.lastLocationAt).toLocaleString("en-IN") : "No fix yet"}
                      </div>
                    </div>
                    {selectedDevice.lastLatitude != null && selectedDevice.lastLongitude != null && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedDevice.lastLatitude},${selectedDevice.lastLongitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/5 py-1.5 rounded-lg border border-primary/20"
                      >
                        Inspect Coordinates on Google Maps
                        {selectedDevice.lastLocationAccuracy != null ? ` (±${Math.round(selectedDevice.lastLocationAccuracy)}m)` : ""}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}

                {/* Remote commands panel */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Remote Dispatch Console</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                      disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => handleDeviceCommand("LOCK")}
                    >
                      <Lock className="mr-1.5 h-3.5 w-3.5 text-warning" />
                      {sendingCommand === "LOCK" ? "Queuing…" : "Lock Device"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                      disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => handleDeviceCommand("UNLOCK")}
                    >
                      <Unlock className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                      {sendingCommand === "UNLOCK" ? "Queuing…" : "Unlock Device"}
                    </Button>

                    {selectedDevice.platform === "ANDROID" && (
                      selectedDevice.wifiBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WIFI_UNBLOCK")}
                        >
                          <Wifi className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                          {sendingCommand === "WIFI_UNBLOCK" ? "Unblocking…" : "Unblock Wi-Fi"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WIFI_BLOCK")}
                        >
                          <WifiOff className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                          {sendingCommand === "WIFI_BLOCK" ? "Blocking…" : "Block Wi-Fi"}
                        </Button>
                      )
                    )}

                    {selectedDevice.platform === "ANDROID" && (
                      selectedDevice.bluetoothBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("BLUETOOTH_UNBLOCK")}
                        >
                          <Bluetooth className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                          {sendingCommand === "BLUETOOTH_UNBLOCK" ? "Unblocking…" : "Unblock Bluetooth"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("BLUETOOTH_BLOCK")}
                        >
                          <BluetoothOff className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                          {sendingCommand === "BLUETOOTH_BLOCK" ? "Blocking…" : "Block Bluetooth"}
                        </Button>
                      )
                    )}

                    {selectedDevice.platform === "ANDROID" && selectedDevice.dealer.enabledFeatures?.includes("WALLPAPER_OVERLAY") && (
                      selectedDevice.wallpaperOverlayActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WALLPAPER_OVERLAY_CLEAR")}
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          {sendingCommand === "WALLPAPER_OVERLAY_CLEAR" ? "Clearing…" : "Clear Overlay Message"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WALLPAPER_OVERLAY")}
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          {sendingCommand === "WALLPAPER_OVERLAY" ? "Sending…" : "Send Overlay Message"}
                        </Button>
                      )
                    )}

                    {selectedDevice.platform === "ANDROID" && selectedDevice.dealer.enabledFeatures?.includes("ALARM") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("ALARM")}
                        >
                          <AlarmClock className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                          {sendingCommand === "ALARM" ? "Sending…" : "Sound Alarm"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("ALARM_STOP")}
                        >
                          <AlarmClock className="mr-1.5 h-3.5 w-3.5" />
                          {sendingCommand === "ALARM_STOP" ? "Stopping…" : "Stop Alarm"}
                        </Button>
                      </>
                    )}

                    {selectedDevice.platform === "ANDROID" && (
                      selectedDevice.devModeEnabled ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("DEV_MODE_DISABLE")}
                        >
                          <Bug className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                          {sendingCommand === "DEV_MODE_DISABLE" ? "Disabling…" : "Turn Off Developer Mode"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("DEV_MODE_ENABLE")}
                        >
                          <Bug className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                          {sendingCommand === "DEV_MODE_ENABLE" ? "Enabling…" : "Turn On Developer Mode"}
                        </Button>
                      )
                    )}

                    {selectedDevice.platform === "IOS" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                        disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                        onClick={() => handleDeviceCommand("APPLY_RESTRICTIONS")}
                      >
                        <ShieldOff className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                        {sendingCommand === "APPLY_RESTRICTIONS" ? "Reapplying…" : "Reapply Restrictions"}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                      disabled={sendingReminder || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => handleSendReminder(selectedDevice)}
                    >
                      <Bell className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {sendingReminder ? "Sending…" : "Send Payment Reminder"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive/10"
                      disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => setReleaseConfirmOpen(true)}
                    >
                      <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                      {sendingCommand === "RELEASE_DEVICE" ? "Releasing…" : "Release Device"}
                    </Button>

                    {selectedDevice.platform === "IOS" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-semibold border-border/80 hover:bg-muted"
                        onClick={() => openEditSerial(selectedDevice)}
                      >
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />Edit Serial Number
                      </Button>
                    )}

                    {selectedDevice.platform === "IOS" && selectedDevice.serialNumber && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10"
                        disabled={assigningDep}
                        onClick={() => handleAssignDep(selectedDevice)}
                      >
                        <Zap className="mr-1.5 h-3.5 w-3.5" />
                        {assigningDep ? "Assigning…" : "Assign DEP (Zero-Touch)"}
                      </Button>
                    )}
                  </div>
                  {selectedDevice.enrollmentStatus !== "ENROLLED" && (
                    <p className="text-[11px] text-muted-foreground mt-2 italic">Commands require device enrollment.</p>
                  )}
                </div>

                {/* Command history table */}
                <div className="border-t border-border/80 pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                    <History className="h-3 w-3" />Audit & Command History
                  </span>
                  <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border/80 text-muted-foreground font-semibold">
                          <th className="p-3">Command Type</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Dispatched Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!selectedDevice.commands || selectedDevice.commands.length === 0) ? (
                          <tr>
                            <td colSpan={3} className="p-4 text-center text-muted-foreground italic">No commands queued for this device yet.</td>
                          </tr>
                        ) : (
                          [...selectedDevice.commands]
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((cmd: any) => (
                              <tr key={cmd.id} className="border-b border-border/60 last:border-0 hover:bg-muted/10 transition-colors">
                                <td className="p-3 font-semibold text-foreground">{cmd.commandType}</td>
                                <td className="p-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    cmd.status === "SUCCESS"
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                      : cmd.status === "FAILED"
                                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  }`}>
                                    {cmd.status}
                                  </span>
                                </td>
                                <td className="p-3 text-muted-foreground">{new Date(cmd.createdAt).toLocaleString("en-IN")}</td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="border-t border-border/80 px-6 py-3.5 flex-shrink-0 bg-muted/20">
            <Button size="sm" onClick={() => setViewOpen(false)} className="text-xs font-semibold">
              Close Overview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={releaseConfirmOpen}
        onOpenChange={setReleaseConfirmOpen}
        title="Release Device from Financing Hold?"
        description={selectedDevice ? `This permanently settles the EMI hold on ${selectedDevice.deviceCode}. The consumer will be permitted to factory-reset the hardware.` : ""}
        confirmLabel="Release Device"
        onConfirm={() => { setReleaseConfirmOpen(false); handleDeviceCommand("RELEASE_DEVICE"); }}
      />

      <ConfirmDialog
        open={!!releaseRow}
        onOpenChange={(o) => !o && setReleaseRow(null)}
        title="Release Device from Financing Hold?"
        description={releaseRow ? `This permanently settles the EMI hold on ${releaseRow.deviceCode}. The consumer will be permitted to factory-reset the hardware.` : ""}
        confirmLabel="Release Device"
        onConfirm={() => { const r = releaseRow!; setReleaseRow(null); handleDeviceCommand("RELEASE_DEVICE", r); }}
      />

      <ConfirmDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        title="Delete Device from Inventory?"
        description={deleteRow ? `Permanently removes ${deleteRow.deviceCode} from stock. It will immediately disappear from ${deleteRow.dealer?.name || "the dealer"}'s app.` : ""}
        confirmLabel={deleting ? "Deleting…" : "Delete Device"}
        onConfirm={deleteDevice}
      />

      <ConfirmDialog
        open={wifiBlockConfirmOpen}
        onOpenChange={setWifiBlockConfirmOpen}
        title="Warning: Hardware Has No Active SIM"
        description="Wi-Fi is this unit's sole connectivity channel. Blocking it will isolate the device from all over-the-air signals, and it cannot be reached remotely until physically reconnected."
        confirmLabel="Proceed with Wi-Fi Block"
        onConfirm={() => { setWifiBlockConfirmOpen(false); if (selectedDevice) queueCommand("WIFI_BLOCK", selectedDevice); }}
      />

      <Dialog open={!!editSerialRow} onOpenChange={(o) => !o && setEditSerialRow(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-border/80 shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Edit Serial Number</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editSerialRow?.deviceCode} — correct serial is required for Apple DEP and supervised profile alignment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-1.5">
            <Label htmlFor="serial-input" className="text-xs font-semibold text-foreground">Hardware Serial Number</Label>
            <Input
              id="serial-input"
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value.toUpperCase())}
              placeholder="e.g. C02XXXXXXX"
              className="font-mono text-xs bg-muted/20 border-border/80"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditSerialRow(null)} className="text-xs">Cancel</Button>
            <Button size="sm" onClick={handleSaveSerial} disabled={savingSerial} className="text-xs font-semibold">
              {savingSerial ? "Saving…" : "Save Serial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
