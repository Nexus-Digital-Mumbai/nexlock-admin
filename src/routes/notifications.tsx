import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Trash2, Shield, Smartphone, CreditCard, User, AlertCircle, AlertTriangle, Info, Check, Send } from "lucide-react";
import { PageHeader } from "@/components/nexlock/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — NexLock Admin" }] }),
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
      toast.success("Notification sent", { description: `Delivered to ${count} dealer staff member${count === 1 ? "" : "s"}.` });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New app version available" maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Message</Label>
            <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} placeholder="What should dealers know?" maxLength={500} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INFO">Info</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Send to</Label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setTarget("ALL")}
                className={cn(
                  "flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  target === "ALL" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                All Dealers
              </button>
              <button
                type="button"
                onClick={() => setTarget("DEALERS")}
                className={cn(
                  "flex-1 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                  target === "DEALERS" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                Specific Dealers
              </button>
            </div>
          </div>

          {target === "DEALERS" && (
            <div className="space-y-2 rounded-lg border border-border p-3">
              <Input
                placeholder="Search dealers…"
                value={dealerSearch}
                onChange={(e) => setDealerSearch(e.target.value)}
                className="h-8"
              />
              {selectedDealers.length > 0 && (
                <p className="text-[11px] text-muted-foreground">{selectedDealers.length} selected</p>
              )}
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {(dealerResults?.data ?? []).map((d) => {
                  const checked = selectedDealers.some((x) => x.id === d.id);
                  return (
                    <label key={d.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted cursor-pointer">
                      <Checkbox checked={checked} onCheckedChange={() => toggleDealer(d)} />
                      <span className="flex-1 truncate">{d.name}</span>
                      <span className="text-muted-foreground">{d.code}</span>
                    </label>
                  );
                })}
                {dealerResults && dealerResults.data.length === 0 && (
                  <p className="py-3 text-center text-xs text-muted-foreground">No dealers match.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={() => sendMutation.mutate()} disabled={!canSend || sendMutation.isPending} className="gap-1.5">
            <Send className="h-3.5 w-3.5" />{sendMutation.isPending ? "Sending…" : "Send"}
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

  // Events list for preferences matrix
  const preferenceEvents = [
    { key: "loan.approved", label: "Loan Approvals" },
    { key: "emi.reminder", label: "EMI Due Reminders" },
    { key: "payment.received", label: "Payment Confirmation" },
    { key: "customer.registered", label: "Customer Onboarding" },
    { key: "dealer.added", label: "Dealer Updates" },
    { key: "device.assigned", label: "Device Assignments" },
    { key: "marketing", label: "Marketing Campaigns" }
  ];

  // 3. Mutation: Update Preference Matrix
  const updatePreferenceMutation = useMutation({
    mutationFn: (updatedList: any[]) =>
      apiClient.put("/notifications/preferences", { preferences: updatedList }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "preferences"] });
      toast.success("Notification preferences updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update preferences");
    }
  });

  // Helper to get checked state for preference grid
  const getPreferenceValue = (eventKey: string, channel: "email" | "sms" | "push" | "inApp"): boolean => {
    const existing = dbPreferences.find((p: any) => p.event === eventKey);
    if (existing) {
      return existing[channel];
    }
    // Default Fallbacks matching requirements
    if (eventKey === "marketing") {
      return false; // Disabled by default
    }
    if (channel === "sms") {
      return false; // SMS ✗ for Admin by default
    }
    return true; // email, push, inApp ✓ by default
  };

  // Toggle Preference
  const handleTogglePreference = (eventKey: string, channel: "email" | "sms" | "push" | "inApp", checked: boolean) => {
    const currentList = [...dbPreferences];
    let existingIndex = currentList.findIndex((p: any) => p.event === eventKey);

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
        [channel]: checked
      };
    }

    updatePreferenceMutation.mutate(currentList);
  };

  // Mutations for read status & deletions
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
        return "bg-red-500/10 border-red-500/20 text-red-500";
      case "WARNING":
        return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      case "SUCCESS":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
      default:
        return "bg-blue-500/10 border-blue-500/20 text-blue-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DEALER":
        return StoreIcon;
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

  const StoreIcon = StoreIconHelper;
  function StoreIconHelper(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="Monitor system events, alerts status, and configure communication channels preferences."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Notifications" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setSendDialogOpen(true)} className="gap-1.5 cursor-pointer">
              <Send className="h-4 w-4" />Send Notification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              className="gap-1.5 cursor-pointer"
            >
              <CheckCheck className="h-4 w-4" />Mark all read
            </Button>
          </div>
        }
      />

      <SendNotificationDialog open={sendDialogOpen} onOpenChange={setSendDialogOpen} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Inbox Section */}
        <div className="card-surface lg:col-span-2 flex flex-col min-h-[500px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border p-4 gap-4">
            <div className="relative w-full max-w-xs">
              <Input
                placeholder="Search inbox..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 bg-muted/40"
              />
            </div>
            <div className="flex gap-1 text-xs">
              {(["All", "Unread", "Read"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "rounded-md px-3 py-1 cursor-pointer transition-colors",
                    filter === t
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
              <Bell className="h-10 w-10 text-muted-foreground/60 mb-2 animate-pulse" />
              <h3 className="text-sm font-semibold text-foreground">Inbox is empty</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                No notifications match your current filter settings.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border overflow-y-auto max-h-[600px]">
              {notifications.map((n: any) => {
                const Icon = getCategoryIcon(n.category);
                const isUnread = !n.isRead;
                const styleClass = getPriorityStyle(n.priority);

                return (
                  <li
                    key={n.id}
                    className={cn(
                      "group flex gap-4 p-4 transition-colors hover:bg-muted/30 relative",
                      isUnread ? "bg-muted/10" : ""
                    )}
                  >
                    {isUnread && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}

                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md border", styleClass)}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className={cn("text-sm font-semibold", isUnread ? "text-foreground font-bold" : "text-foreground/80")}>
                          {n.title}
                        </h4>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{n.content}</p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNotificationClick(n)}
                          className="h-7 text-[10px] px-2.5 font-medium border-primary/20 hover:border-primary/45 hover:bg-primary/5 text-primary"
                        >
                          {n.metadata?.action || "View Details"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(n.id)}
                          className="h-7 w-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Preferences Matrix Side Card */}
        <div className="card-surface p-5 h-fit space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <h3 className="text-sm font-bold">Preferences Matrix</h3>
          </div>

          <div className="space-y-4">
            {preferenceEvents.map((ev) => (
              <div key={ev.key} className="space-y-2.5 p-3 rounded-lg border border-border/80 bg-muted/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{ev.label}</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-medium">In-App</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "inApp")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "inApp", !!checked)}
                    />
                  </label>
                  
                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-medium">Email</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "email")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "email", !!checked)}
                    />
                  </label>

                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-medium">SMS</span>
                    <Checkbox
                      checked={getPreferenceValue(ev.key, "sms")}
                      onCheckedChange={(checked) => handleTogglePreference(ev.key, "sms", !!checked)}
                    />
                  </label>

                  <label className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <span className="text-[9px] text-muted-foreground uppercase font-medium">Push</span>
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
