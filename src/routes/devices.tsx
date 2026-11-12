import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Smartphone, CheckCircle2, Lock, Unlock, ShieldOff, Eye,
  Search, Wifi, WifiOff, Bluetooth, BluetoothOff, Battery, History, Zap,
  CreditCard, Phone, MapPin, ExternalLink, Bell, User, Sparkles, AlarmClock,
  Pencil, Trash2, Bug,
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
  head: () => ({ meta: [{ title: "Devices — NexLock Admin" }] }),
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
    // Mirrors the dealer app's own warning: Wi-Fi is this device's only connectivity when there's
    // no SIM, so blocking it also blocks delivery of the WIFI_UNBLOCK meant to reverse it — the
    // device becomes unreachable until someone has physical access to it.
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
        toast.success(`${commandType.replace("_", " ")} command queued`, {
          description: `${target.deviceCode} will pick it up on its next poll and acknowledge the result.`,
        });
        if (selectedDevice?.id === target.id) await refreshSelectedDevice(target.id);
        fetchDevices(pagination.page);
      }
    } catch (err: any) {
      toast.error(`Failed to queue ${commandType.replace("_", " ")}`, { description: err.message });
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

  // Scoped to In Stock devices only — this is deliberately not exposed for assigned/loaned
  // devices (the backend rejects those anyway, see archiveDevice's guard, but hiding the action
  // up front avoids staff hitting that error on a device that was never meant to be deletable
  // this way). Same endpoint the dealer app's inventory list reads from, so a deleted device
  // disappears there automatically on next fetch — no dealer-app change needed.
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

  // Serial number is Super-Admin-only to edit, and only on iOS devices (see the backend's
  // DeviceService.updateDevice) — Android's serial isn't load-bearing for anything the
  // enrollment flow does, but iOS's wrong serial silently breaks DEP/ABM matching and was the
  // one field dealers kept mistyping, needing a direct backend fix every time.
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
          description: `Serial ${target.serialNumber} is now linked to NexLock's DEP profile — erase and power on the iPhone to self-enroll.`,
        });
      }
    } catch (err: any) {
      toast.error("Failed to assign DEP", { description: err.message });
    } finally {
      setAssigningDep(false);
    }
  };

  const cols: Column<DeviceData>[] = [
    { key: "deviceCode", header: "Device Code", render: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.deviceCode}</span> },
    {
      key: "platform",
      header: "Platform",
      render: (r) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
          r.platform === "IOS"
            ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        }`}>
          {r.platform === "IOS" ? "iOS" : "Android"}
        </span>
      ),
    },
    { key: "serialNumber", header: "Serial / IMEI 1", render: (r) => (
      <div>
        <div className="font-mono text-xs text-foreground font-medium">{r.serialNumber || "—"}</div>
        <div className="font-mono text-[10px] text-muted-foreground">{r.imei1}</div>
      </div>
    )},
    {
      key: "brandName",
      header: "Brand / Model",
      render: (r) => (r.brandName || r.modelName) ? (
        <div className="font-medium text-foreground">{r.brandName} {r.modelName}</div>
      ) : <span className="text-xs text-muted-foreground italic">Not recorded</span>,
    },
    { key: "dealer", header: "Dealer", render: (r) => <span className="text-sm text-muted-foreground">{r.dealer?.name}</span> },
    {
      key: "customer",
      header: "Customer",
      render: (r) => r.customer ? (
        <div className="font-semibold text-foreground">{r.customer.name}</div>
      ) : <span className="text-xs text-muted-foreground italic">None</span>,
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "enrolledAt",
      header: "Enrolled At",
      render: (r) => r.enrolledAt ? (
        <span className="text-xs text-muted-foreground">{new Date(r.enrolledAt).toLocaleString("en-IN")}</span>
      ) : <span className="text-xs text-muted-foreground italic">Not enrolled</span>,
    },
  ];

  const actions: RowAction<DeviceData>[] = [
    { label: "View Details", icon: Eye, onClick: fetchDeviceDetails },
    { label: "Lock Device", icon: Lock, onClick: (r) => handleDeviceCommand("LOCK", r), show: (r) => r.enrollmentStatus === "ENROLLED", separatorBefore: true },
    { label: "Unlock Device", icon: Unlock, onClick: (r) => handleDeviceCommand("UNLOCK", r), show: (r) => r.enrollmentStatus === "ENROLLED" },
    { label: "Edit Serial Number", icon: Pencil, onClick: (r) => openEditSerial(r), show: (r) => r.platform === "IOS", separatorBefore: true },
    { label: "Assign DEP (Zero-Touch)", icon: Zap, onClick: (r) => handleAssignDep(r), show: (r) => r.platform === "IOS" && !!r.serialNumber },
    { label: "Release Device", icon: ShieldOff, onClick: (r) => setReleaseRow(r), show: (r) => r.enrollmentStatus === "ENROLLED", destructive: true },
    { label: "Delete Device", icon: Trash2, onClick: (r) => setDeleteRow(r), show: (r) => r.status === "In Stock", destructive: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Devices"
        description="Devices enrolled by dealers — lock, unlock, and release remotely."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Devices" }]}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Devices Enrolled" value={stats.total.toLocaleString()} icon={Smartphone} />
        <KpiCard label="Locked" value={stats.locked.toLocaleString()} icon={Lock} tone="warning" />
        <KpiCard label="Unlocked" value={stats.unlocked.toLocaleString()} icon={Unlock} tone="success" />
        <KpiCard label="Released" value={stats.released.toLocaleString()} icon={ShieldOff} />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 bg-card p-4 rounded-xl border border-border">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IMEI, Serial, Brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/40 border-border text-foreground"
          />
        </div>

        <Select value={dealerFilter} onValueChange={setDealerFilter}>
          <SelectTrigger className="bg-muted/40 border border-border text-foreground">
            <SelectValue placeholder="Dealer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dealers</SelectItem>
            {dealers.map((d) => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={devices}
        columns={cols}
        rowKey={(r) => r.id}
        loading={loading}
        rowActions={actions}
        hideSearch
        emptyTitle="No devices enrolled yet"
        emptyDescription="Devices are enrolled from the dealer app."
      />

      {pagination.pages > 1 && (
        <div className="flex justify-between items-center bg-card px-4 py-3 rounded-xl border border-border">
          <span className="text-xs text-muted-foreground">
            Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total items)
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={pagination.page <= 1} onClick={() => fetchDevices(pagination.page - 1)} className="border-border text-foreground hover:bg-muted">
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={pagination.page >= pagination.pages} onClick={() => fetchDevices(pagination.page + 1)} className="border-border text-foreground hover:bg-muted">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* DEVICE DETAIL DIALOG */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col bg-card text-card-foreground border border-border p-0 overflow-hidden">
          <DialogHeader className="border-b border-border px-6 py-4 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              Device — {selectedDevice?.deviceCode}
              {selectedDevice && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                  selectedDevice.platform === "IOS"
                    ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                }`}>
                  {selectedDevice.platform === "IOS" ? "iOS" : "Android"}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>Handshake status, remote commands, and command history.</DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 flex-1 overflow-y-auto min-h-0 space-y-6">
            {selectedDevice && (
              <>
                {/* Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/10 p-4 border border-border rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">Status</span>
                        <div className="pt-0.5"><StatusBadge status={selectedDevice.status} /></div>
                        <div className="text-xs text-muted-foreground mt-3">
                          Dealer: <span className="font-medium text-foreground">{selectedDevice.dealer?.name}</span>
                        </div>
                        {selectedDevice.customer && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Customer: <span className="font-medium text-foreground">{selectedDevice.customer.name}</span>
                          </div>
                        )}
                      </div>
                      {selectedDevice.customer && (
                        selectedDevice.customer.photoUrl ? (
                          <img
                            src={selectedDevice.customer.photoUrl}
                            alt={selectedDevice.customer.name}
                            className="h-14 w-14 rounded-full object-cover border border-border flex-shrink-0"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border flex-shrink-0">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/10 p-4 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Handshake</span>
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Wifi className={`h-4 w-4 ${selectedDevice.lastSeen ? "text-green-500" : "text-muted-foreground"}`} />
                        {/* networkStatus (wifi/mobile-data) is Android-only — Apple MDM has no
                            equivalent, so an iOS row falls straight to the generic fallback. */}
                        {(selectedDevice.platform === "ANDROID" && selectedDevice.networkStatus) || (selectedDevice.lastSeen ? "Connected" : "No heartbeat yet")}
                      </div>
                      <span className="text-[10px] text-muted-foreground block mt-1">
                        Last seen: {selectedDevice.lastSeen ? new Date(selectedDevice.lastSeen).toLocaleString("en-IN") : "Never"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Battery</span>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                        <Battery className={`h-4 w-4 ${selectedDevice.batteryLevel != null ? "text-green-500" : "text-muted-foreground"}`} />
                        {selectedDevice.batteryLevel != null ? `${selectedDevice.batteryLevel}%` : "No data"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & SIM — Android only, same reasoning as the dealer app: iOS never
                    reports SIM/phone number (Apple removed ICCID/PhoneNumber access entirely as
                    of iOS 26), so this card would only ever show "No data" placeholders there. */}
                {selectedDevice.platform === "ANDROID" && (
                  <div className="bg-muted/10 p-4 border border-border rounded-xl">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Location & SIM</span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5" />SIM
                      </div>
                      <div className="text-right font-medium text-foreground">
                        {selectedDevice.simPresent === null ? "No data yet" : selectedDevice.simPresent ? "Present" : "Not detected"}
                      </div>
                      {selectedDevice.networkOperator && (
                        <>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Wifi className="h-3.5 w-3.5" />Carrier
                          </div>
                          <div className="text-right font-medium text-foreground">{selectedDevice.networkOperator}</div>
                        </>
                      )}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />Phone number
                      </div>
                      <div className="text-right font-medium text-foreground">{selectedDevice.phoneNumber || "Not available"}</div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />Last location
                      </div>
                      <div className="text-right font-medium text-foreground">
                        {selectedDevice.lastLocationAt ? new Date(selectedDevice.lastLocationAt).toLocaleString("en-IN") : "No data yet"}
                      </div>
                    </div>
                    {selectedDevice.lastLatitude != null && selectedDevice.lastLongitude != null && (
                      <a
                        href={`https://www.google.com/maps?q=${selectedDevice.lastLatitude},${selectedDevice.lastLongitude}`}
                        target="_blank" rel="noreferrer"
                        className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        View on map
                        {selectedDevice.lastLocationAccuracy != null ? ` (±${Math.round(selectedDevice.lastLocationAccuracy)}m)` : ""}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Remote commands */}
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Remote Commands</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                      disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => handleDeviceCommand("LOCK")}
                    >
                      <Lock className="mr-1 h-3.5 w-3.5" />{sendingCommand === "LOCK" ? "Queuing..." : "Lock Device"}
                    </Button>
                    <Button
                      size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                      disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => handleDeviceCommand("UNLOCK")}
                    >
                      <Unlock className="mr-1 h-3.5 w-3.5" />{sendingCommand === "UNLOCK" ? "Queuing..." : "Unlock Device"}
                    </Button>
                    {selectedDevice.platform === "ANDROID" && (
                      selectedDevice.wifiBlocked ? (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WIFI_UNBLOCK")}
                        >
                          <Wifi className="mr-1 h-3.5 w-3.5" />{sendingCommand === "WIFI_UNBLOCK" ? "Unblocking..." : "Unblock Wi-Fi"}
                        </Button>
                      ) : (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WIFI_BLOCK")}
                        >
                          <WifiOff className="mr-1 h-3.5 w-3.5" />{sendingCommand === "WIFI_BLOCK" ? "Blocking..." : "Block Wi-Fi"}
                        </Button>
                      )
                    )}
                    {selectedDevice.platform === "ANDROID" && (
                      selectedDevice.bluetoothBlocked ? (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("BLUETOOTH_UNBLOCK")}
                        >
                          <Bluetooth className="mr-1 h-3.5 w-3.5" />{sendingCommand === "BLUETOOTH_UNBLOCK" ? "Unblocking..." : "Unblock Bluetooth"}
                        </Button>
                      ) : (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("BLUETOOTH_BLOCK")}
                        >
                          <BluetoothOff className="mr-1 h-3.5 w-3.5" />{sendingCommand === "BLUETOOTH_BLOCK" ? "Blocking..." : "Block Bluetooth"}
                        </Button>
                      )
                    )}
                    {/* Opt-in, not available to every dealer by default — see Dealer.enabledFeatures.
                        The backend is the real enforcement point (CommandService.queueCommand);
                        this is just hiding buttons the device's dealer wouldn't be allowed to use. */}
                    {selectedDevice.platform === "ANDROID" && selectedDevice.dealer.enabledFeatures?.includes("WALLPAPER_OVERLAY") && (
                      selectedDevice.wallpaperOverlayActive ? (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WALLPAPER_OVERLAY_CLEAR")}
                        >
                          <Sparkles className="mr-1 h-3.5 w-3.5" />{sendingCommand === "WALLPAPER_OVERLAY_CLEAR" ? "Clearing..." : "Clear Overlay Message"}
                        </Button>
                      ) : (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("WALLPAPER_OVERLAY")}
                        >
                          <Sparkles className="mr-1 h-3.5 w-3.5" />{sendingCommand === "WALLPAPER_OVERLAY" ? "Sending..." : "Send Overlay Message"}
                        </Button>
                      )
                    )}
                    {selectedDevice.platform === "ANDROID" && selectedDevice.dealer.enabledFeatures?.includes("ALARM") && (
                      <>
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("ALARM")}
                        >
                          <AlarmClock className="mr-1 h-3.5 w-3.5" />{sendingCommand === "ALARM" ? "Sending..." : "Sound Alarm"}
                        </Button>
                        {/* ALARM has no persisted on/off state (it's fire-and-forget, auto-stops
                            itself after 90s — see AlarmPlaybackService) so this is always
                            available rather than conditionally shown like the overlay toggle. */}
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("ALARM_STOP")}
                        >
                          <AlarmClock className="mr-1 h-3.5 w-3.5" />{sendingCommand === "ALARM_STOP" ? "Sending..." : "Stop Alarm"}
                        </Button>
                      </>
                    )}
                    {/* Admin-only (device.dev_mode permission — see requireCommandPermission on the
                        backend). Dealers never see this button; it's a support override of a
                        security control (the post-enrollment Developer Options lockdown), not a
                        day-to-day device action. */}
                    {selectedDevice.platform === "ANDROID" && (
                      selectedDevice.devModeEnabled ? (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("DEV_MODE_DISABLE")}
                        >
                          <Bug className="mr-1 h-3.5 w-3.5" />{sendingCommand === "DEV_MODE_DISABLE" ? "Disabling..." : "Turn Off Developer Mode"}
                        </Button>
                      ) : (
                        <Button
                          size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                          disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                          onClick={() => handleDeviceCommand("DEV_MODE_ENABLE")}
                        >
                          <Bug className="mr-1 h-3.5 w-3.5" />{sendingCommand === "DEV_MODE_ENABLE" ? "Enabling..." : "Turn On Developer Mode"}
                        </Button>
                      )
                    )}
                    {/* Remediation for a device still carrying the old blanket allowAppRemoval:false
                        policy (blocked deleting every app, not just ours — fixed to be scoped to
                        just our app via per-app Attributes.Removable). Re-sends both the
                        Restrictions profile and the lock-screen app's InstallApplication command,
                        which Apple's own reference confirms updates an already-managed app rather
                        than no-opping — so this fixes an already-enrolled device, not just future
                        ones. See IosCommandService#deliverCommand. */}
                    {selectedDevice.platform === "IOS" && (
                      <Button
                        size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                        disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                        onClick={() => handleDeviceCommand("APPLY_RESTRICTIONS")}
                      >
                        <ShieldOff className="mr-1 h-3.5 w-3.5" />{sendingCommand === "APPLY_RESTRICTIONS" ? "Reapplying..." : "Reapply Restrictions"}
                      </Button>
                    )}
                    <Button
                      size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                      disabled={sendingReminder || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => handleSendReminder(selectedDevice)}
                    >
                      <Bell className="mr-1 h-3.5 w-3.5" />{sendingReminder ? "Sending..." : "Send Payment Reminder"}
                    </Button>
                    <Button
                      size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10"
                      disabled={sendingCommand !== null || selectedDevice.enrollmentStatus !== "ENROLLED"}
                      onClick={() => setReleaseConfirmOpen(true)}
                    >
                      <ShieldOff className="mr-1 h-3.5 w-3.5" />{sendingCommand === "RELEASE_DEVICE" ? "Releasing..." : "Release Device"}
                    </Button>
                    {selectedDevice.platform === "IOS" && (
                      <Button
                        size="sm" variant="outline" className="border-border text-foreground hover:bg-muted"
                        onClick={() => openEditSerial(selectedDevice)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />Edit Serial Number
                      </Button>
                    )}
                    {selectedDevice.platform === "IOS" && selectedDevice.serialNumber && (
                      <Button
                        size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10"
                        disabled={assigningDep}
                        onClick={() => handleAssignDep(selectedDevice)}
                      >
                        <Zap className="mr-1 h-3.5 w-3.5" />{assigningDep ? "Assigning..." : "Assign DEP (Zero-Touch)"}
                      </Button>
                    )}
                  </div>
                  {selectedDevice.enrollmentStatus !== "ENROLLED" && (
                    <p className="text-[11px] text-muted-foreground mt-2 italic">Commands require the device to be enrolled.</p>
                  )}
                </div>

                {/* Command history */}
                <div className="border-t border-border pt-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                    <History className="h-3 w-3" />Command History
                  </span>
                  <div className="border border-border rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                          <th className="p-3">Command</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Timestamp</th>
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
                              <tr key={cmd.id} className="border-b border-border last:border-0 hover:bg-muted/5">
                                <td className="p-3 font-semibold text-foreground">{cmd.commandType}</td>
                                <td className="p-3">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                    cmd.status === "SUCCESS"
                                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                                      : cmd.status === "FAILED"
                                      ? "bg-red-500/10 text-red-500 border-red-500/20"
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

          <DialogFooter className="border-t border-border px-6 py-3 flex-shrink-0 bg-card">
            <Button onClick={() => setViewOpen(false)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={releaseConfirmOpen}
        onOpenChange={setReleaseConfirmOpen}
        title="Release this device?"
        description={selectedDevice ? `This ends the EMI hold on ${selectedDevice.deviceCode}. The customer will be able to uninstall the agent and factory-reset the device. This cannot be undone.` : ""}
        confirmLabel="Release Device"
        onConfirm={() => { setReleaseConfirmOpen(false); handleDeviceCommand("RELEASE_DEVICE"); }}
      />

      <ConfirmDialog
        open={!!releaseRow}
        onOpenChange={(o) => !o && setReleaseRow(null)}
        title="Release this device?"
        description={releaseRow ? `This ends the EMI hold on ${releaseRow.deviceCode}. The customer will be able to uninstall the agent and factory-reset the device. This cannot be undone.` : ""}
        confirmLabel="Release Device"
        onConfirm={() => { const r = releaseRow!; setReleaseRow(null); handleDeviceCommand("RELEASE_DEVICE", r); }}
      />

      <ConfirmDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        title="Delete this device?"
        description={deleteRow ? `Permanently removes ${deleteRow.deviceCode} from inventory. It will also disappear from ${deleteRow.dealer?.name || "the dealer"}'s stock list in their app. This cannot be undone.` : ""}
        confirmLabel={deleting ? "Deleting..." : "Delete Device"}
        onConfirm={deleteDevice}
      />

      <ConfirmDialog
        open={wifiBlockConfirmOpen}
        onOpenChange={setWifiBlockConfirmOpen}
        title="This device has no SIM card"
        description="Wi-Fi is this device's only connectivity. Blocking it will cut off its internet entirely, and it will not be reachable again — not even to unblock it remotely. Recovering it will require physical access to the device."
        confirmLabel="Block Anyway"
        onConfirm={() => { setWifiBlockConfirmOpen(false); if (selectedDevice) queueCommand("WIFI_BLOCK", selectedDevice); }}
      />

      <Dialog open={!!editSerialRow} onOpenChange={(o) => !o && setEditSerialRow(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Serial Number</DialogTitle>
            <DialogDescription>
              {editSerialRow?.deviceCode} — a wrong serial breaks DEP/ABM matching and the enrollment profile's device lookup, so this is Super-Admin-only.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="serial-input" className="mb-1.5 block text-xs text-muted-foreground">Serial Number</Label>
            <Input
              id="serial-input"
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value.toUpperCase())}
              placeholder="e.g. C02XXXXXXX"
              className="font-mono"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditSerialRow(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveSerial} disabled={savingSerial}>
              {savingSerial ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
