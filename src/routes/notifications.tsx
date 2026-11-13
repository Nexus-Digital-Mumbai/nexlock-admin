import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell, CheckCheck, Trash2, Shield, Smartphone, CreditCard, User,
  AlertCircle, AlertTriangle, Info, Check, Send, Store, SlidersHorizontal, X, Search
} from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications & Alerts — Nexus Console" }] }),
  component: NotificationsPage,
});

interface DealerOption {
  id: string;
  name: string;
  code: string;
}

function SendNotificationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("INFO");
  const [target, setTarget] = useState<"ALL" | "DEALERS">("ALL");
  const [dealerSearch, setDealerSearch] = useState("");
  const [selectedDealers, setSelectedDealers] = useState<DealerOption[]>([]);

  const { data: dealerResults } = useQuery({
    queryKey: ["dealers", "picker", dealerSearch],
    queryFn: () => apiClient.get<{ data: DealerOption[] }>(`/dealers?search=${encodeURIComponent(dealerSearch)}&limit=20`),
    enabled: target === "DEALERS",
  });

  const reset = () => {
    setTitle("");
    setContent("");
    setPriority("INFO");
    setTarget("ALL");
    setDealerSearch("");
    setSelectedDealers([]);
  };

  const sendMutation = useMutation({
    mutationFn: () =>
      apiClient.post<{ data: { recipientCount: number } }>("/notifications/broadcast", {
        title,
        content,
        priority,
        target,
        dealerIds: target === "DEALERS" ? selectedDealers.map((d) => d.id) : undefined,
      }),
    onSuccess: (res) => {
      const count = res.data?.recipientCount ?? 0;
      toast.success("Broadcast dispatched", { description: `Delivered to ${count} dealer staff member${count === 1 ? "" : "s"}.` });
      reset();
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message || "Failed to send notification"),
  });

  const toggleDealer = (d: DealerOption) => {
    setSelectedDealers((cur) => (cur.some((x) => x.id === d.id) ? cur.filter((x) => x.id !== d.id) : [...cur, d]));
  };

  const canSend = title.trim().length > 0 && content.trim().length > 0 && (target === "ALL" || selectedDealers.length > 0);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg rounded-2xl border-border/80 shadow-2xl p-6 bg-card">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-foreground">Broadcast Platform Notification</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Push real-time alert messages to authorized dealer store personnel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Message Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Critical platform maintenance scheduled"
              maxLength={100}
              className="h-9 text-xs bg-muted/20 border-border/80"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Message Body *</Label>
            <Textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide complete operational guidance for store managers…"
              maxLength={500}
              className="text-xs bg-muted/20 border-border/80"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Alert Urgency / Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-9 text-xs bg-muted/20 border-border/80"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-xl">
                <SelectItem value="INFO" className="text-xs">Info (General updates)</SelectItem>
                <SelectItem value="SUCCESS" className="text-xs">Success (Confirmations)</SelectItem>
                <SelectItem value="WARNING" className="text-xs">Warning (Time sensitive)</SelectItem>
                <SelectItem value="CRITICAL" className="text-xs">Critical (Immediate action)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">Distribution Scope</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTarget("ALL")}
                className={cn(
                  "flex-1 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer text-center",
                  target === "ALL"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border/80 text-muted-foreground hover:bg-muted/40"
                )}
              >
                All Registered Dealers
              </button>
              <button
                type="button"
                onClick={() => setTarget("DEALERS")}
                className={cn(
                  "flex-1 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer text-center",
                  target === "DEALERS"
                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                    : "border-border/80 text-muted-foreground hover:bg-muted/40"
                )}
              >
                Selected Dealer Stores
              </button>
            </div>
          </div>

          {target === "DEALERS" && (
            <div className="space-y-2.5 rounded-xl border border-border/80 bg-muted/15 p-3.5">
              <Input
                placeholder="Search dealers by name or code…"
                value={dealerSearch}
                onChange={(e) => setDealerSearch(e.target.value)}
                className="h-8 text-xs bg-card border-border/80"
              />
              {selectedDealers.length > 0 && (
                <p className="text-[11px] font-semibold text-primary">{selectedDealers.length} stores chosen</p>
              )}
              <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
                {(dealerResults?.data ?? []).map((d) => {
                  const checked = selectedDealers.some((x) => x.id === d.id);
                  return (
                    <label key={d.id} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-card cursor-pointer border border-transparent hover:border-border/60 transition-colors">
                      <Checkbox checked={checked} onCheckedChange={() => toggleDealer(d)} />
                      <span className="flex-1 font-medium text-foreground truncate">{d.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{d.code}</span>
                    </label>
                  );
                })}
                {dealerResults && dealerResults.data.length === 0 && (
                  <p className="py-3 text-center text-xs text-muted-foreground">No dealers matched your search.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">Cancel</Button>
          <Button
            size="sm"
            onClick={() => sendMutation.mutate()}
            disabled={!canSend || sendMutation.isPending}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            {sendMutation.isPending ? "Broadcasting…" : "Send Broadcast"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All");
  const [search, setSearch] = useState("");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  // 1. Fetch Notifications List
  const { data: listData, refetch } = useQuery({
    queryKey: ["notifications", "list", filter, search],
    queryFn: () => {
      const isReadParam = filter === "Unread" ? "false" : filter === "Read" ? "true" : "";
      const path = `/notifications?isRead=${isReadParam}&search=${search}&limit=50`;
      return apiClient.get(path);
    },
  });

  const notifications = listData?.data?.items || [];

  // 2. Fetch User Preferences
  const { data: prefData } = useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: () => apiClient.get("/notifications/preferences"),
  });

  const dbPreferences = prefData?.data || [];

  const preferenceEvents = [
    { key: "loan.approved", label: "Loan Approvals & Onboarding" },
    { key: "emi.reminder", label: "EMI Repayment Reminders" },
    { key: "payment.received", label: "Payment Confirmations" },
    { key: "customer.registered", label: "Consumer KYC Registration" },
    { key: "dealer.added", label: "Dealership Network Events" },
    { key: "device.assigned", label: "Hardware Lock Assignments" },
    { key: "marketing", label: "System Announcements" },
  ];

  const updatePreferenceMutation = useMutation({
    mutationFn: (updatedList: any[]) =>
      apiClient.put("/notifications/preferences", { preferences: updatedList }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "preferences"] });
      toast.success("Notification preferences updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update preferences");
    },
  });

  const getPreferenceValue = (eventKey: string, channel: "email" | "sms" | "push" | "inApp"): boolean => {
    const existing = dbPreferences.find((p: any) => p.event === eventKey);
    if (existing) {
      return existing[channel];
    }
    if (eventKey === "marketing") return false;
    if (channel === "sms") return false;
    return true;
  };

  const handleTogglePreference = (eventKey: string, channel: "email" | "sms" | "push" | "inApp", checked: boolean) => {
    const currentList = [...dbPreferences];
    const existingIndex = currentList.findIndex((p: any) => p.event === eventKey);

    const defaultPref = {
      event: eventKey,
      email: getPreferenceValue(eventKey, "email"),
      sms: getPreferenceValue(eventKey, "sms"),
      push: getPreferenceValue(eventKey, "push"),
      inApp: getPreferenceValue(eventKey, "inApp"),
    };

    if (existingIndex === -1) {
      const newPref = { ...defaultPref, [channel]: checked };
      currentList.push(newPref);
    } else {
      currentList[existingIndex] = {
        ...currentList[existingIndex],
        [channel]: checked,
      };
    }

    updatePreferenceMutation.mutate(currentList);
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      refetch();
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiClient.patch("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      refetch();
      toast.success("All notifications marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      refetch();
    },
  });

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markReadMutation.mutateAsync(notif.id);
    }

    const meta = notif.metadata;
    if (meta && meta.entityId) {
      const moduleName = String(meta.module).toLowerCase();
      if (moduleName === "loan" || moduleName === "emi") {
        window.location.href = `/loans?search=${meta.entityId}`;
      } else if (moduleName === "device") {
        window.location.href = `/devices?search=${meta.entityId}`;
      } else if (moduleName === "customer") {
        window.location.href = `/customers?search=${meta.entityId}`;
      } else if (moduleName === "dealer") {
        window.location.href = `/dealers?search=${meta.entityId}`;
      }
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-destructive/10 border-destructive/25 text-destructive";
      case "WARNING":
        return "bg-amber-500/10 border-amber-500/25 text-amber-500";
      case "SUCCESS":
        return "bg-emerald-500/10 border-emerald-500/25 text-emerald-500";
      default:
        return "bg-primary/10 border-primary/20 text-primary";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DEALER":
        return Store;
      case "CUSTOMER":
        return User;
      case "LOAN":
      case "EMI":
        return CreditCard;
      case "DEVICE":
      case "ANDROID":
        return Smartphone;
      default:
        return Bell;
    }
  };

  return (
    <div className="space-y-7 animate-fade-up">
      <PageHeader
        title="Notification Center"
        description="Monitor system events, broadcast alert messages to store managers, and configure delivery preferences."
        breadcrumbs={[{ label: "Nexus", to: "/" }, { label: "Notifications" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setSendDialogOpen(true)} className="h-9 gap-1.5 text-xs font-semibold shadow-xs">
              <Send className="h-4 w-4" />Broadcast Message
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              className="h-9 gap-1.5 text-xs font-semibold border-border/80"
            >
              <CheckCheck className="h-4 w-4" />Mark All as Read
            </Button>
          </div>
        }
      />

      <SendNotificationDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Inbox List Section */}
        <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs lg:col-span-2 flex flex-col min-h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 p-4 gap-3 bg-card/60">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search alerts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8.5 pl-9 text-xs bg-muted/30 border-border/80"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-muted/20 p-1 text-xs">
              {(["All", "Unread", "Read"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "rounded-md px-3 py-1 font-semibold transition-all cursor-pointer",
                    filter === t
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
                <Bell className="h-6 w-6 text-primary/70 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-foreground">All alerts clear</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                No notification items matching your filter settings.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 overflow-y-auto max-h-[620px]">
              {notifications.map((n: any) => {
                const Icon = getCategoryIcon(n.category);
                const isUnread = !n.isRead;
                const styleClass = getPriorityStyle(n.priority);

                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group flex gap-4 p-4.5 transition-colors hover:bg-muted/30 relative",
                      isUnread ? "bg-primary/4" : ""
                    )}
                  >
                    {isUnread && (
                      <span className="absolute left-1.5 top-5 h-2 w-2 rounded-full bg-primary ring-2 ring-primary/20" />
                    )}

                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", styleClass)}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className={cn("text-xs md:text-sm font-semibold truncate", isUnread ? "text-foreground font-bold" : "text-foreground/80")}>
                          {n.title}
                        </h4>
                        <span className="shrink-0 text-[10px] text-muted-foreground font-medium">
                          {new Date(n.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed pr-6">{n.content}</p>

                      <div className="mt-3 flex items-center justify-between pt-0.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotificationClick(n)}
                          className="h-6.5 text-[11px] px-2.5 font-medium border-border/80 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                          {n.metadata?.action || "View Target Record"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(n.id)}
                          className="h-6 w-6 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete notification"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Preferences Matrix Card */}
        <div className="overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs h-fit space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border/80">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Delivery Preferences</h3>
          </div>

          <div className="space-y-3.5">
            {preferenceEvents.map((ev) => (
              <div key={ev.key} className="space-y-2 p-3 rounded-xl border border-border/60 bg-muted/15">
                <span className="text-xs font-semibold text-foreground">{ev.label}</span>
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">In-App</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "inApp")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "inApp", !!checked)}
                    />
                  </label>
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Email</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "email")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "email", !!checked)}
                    />
                  </label>
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">SMS</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "sms")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "sms", !!checked)}
                    />
                  </label>
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Push</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "push")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "push", !!checked)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
