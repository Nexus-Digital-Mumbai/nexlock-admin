import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Trash2, Calendar, Shield, Smartphone, CreditCard, User, AlertCircle, AlertTriangle, Info, Store, CheckCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export function NotificationDrawer() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => apiClient.get("/notifications/unread-count"),
    refetchInterval: 15000,
  });

  const unreadCount = unreadData?.data?.count || 0;

  // Fetch notifications list
  const { data: listData, refetch } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => apiClient.get("/notifications"),
    enabled: open,
  });

  const notifications = listData?.data?.items || [];

  // Mutation to mark single as read
  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      refetch();
    },
  });

  // Mutation to mark all as read
  const markAllReadMutation = useMutation({
    mutationFn: () => apiClient.patch("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      refetch();
    },
  });

  // Mutation to delete notification
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      refetch();
    },
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const groupNotifications = (items: any[]) => {
    const today: any[] = [];
    const yesterday: any[] = [];
    const earlier: any[] = [];

    const now = new Date();
    const todayStr = now.toDateString();
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toDateString();

    items.forEach((item) => {
      const d = new Date(item.createdAt);
      const dStr = d.toDateString();

      if (dStr === todayStr) {
        today.push(item);
      } else if (dStr === yesterdayStr) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { today, yesterday, earlier };
  };

  const { today, yesterday, earlier } = groupNotifications(notifications);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return {
          bg: "bg-destructive/10 border-destructive/25 text-destructive",
          indicator: "bg-destructive",
          icon: AlertCircle,
        };
      case "WARNING":
        return {
          bg: "bg-warning/15 border-warning/30 text-warning-foreground",
          indicator: "bg-warning",
          icon: AlertTriangle,
        };
      case "SUCCESS":
        return {
          bg: "bg-success/15 border-success/30 text-success-foreground",
          indicator: "bg-success",
          icon: Check,
        };
      default:
        return {
          bg: "bg-primary/10 border-primary/20 text-primary",
          indicator: "bg-primary",
          icon: Info,
        };
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

  const handleItemClick = async (item: any) => {
    if (!item.isRead) {
      await markReadMutation.mutateAsync(item.id);
    }

    const meta = item.metadata;
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

  const renderItem = (item: any) => {
    const isUnread = !item.isRead;
    const style = getPriorityStyle(item.priority);
    const CatIcon = getCategoryIcon(item.category);
    const actionLabel = item.metadata?.action;

    return (
      <div
        key={item.id}
        className={cn(
          "group relative flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:shadow-xs",
          isUnread
            ? "bg-card border-primary/30 shadow-xs"
            : "bg-card/60 border-border/60 hover:bg-card/90"
        )}
      >
        {isUnread && (
          <span className={cn("absolute left-1.5 top-4 h-2 w-2 rounded-full", style.indicator)} />
        )}

        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", style.bg)}>
          <CatIcon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn("text-xs font-semibold leading-tight truncate", isUnread ? "text-foreground font-bold" : "text-foreground/80")}>
              {item.title}
            </h4>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{formatTime(item.createdAt)}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pr-2 line-clamp-2">{item.content}</p>

          <div className="mt-2 flex items-center justify-between pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleItemClick(item)}
              className="h-6.5 text-[10px] px-2.5 font-medium border-border/80 hover:border-primary/40 hover:text-primary transition-colors"
            >
              {actionLabel || "View Details"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(item.id)}
              className="h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete notification"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/90 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xs text-foreground/80 hover:bg-white hover:text-foreground hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          aria-label="Open notifications"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-white/80 dark:border-white/15 shadow-2xl">
        <SheetHeader className="p-5 pb-4 border-b border-border/80 bg-card/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <SheetTitle className="text-sm font-bold tracking-tight text-foreground">Activity & Alerts</SheetTitle>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllReadMutation.mutate()}
                className="h-7 text-xs text-muted-foreground hover:text-primary gap-1 px-2 font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        {notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground mb-4">
              <Bell className="h-6 w-6 text-primary/70" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Everything is up to date</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              No unread security events, device triggers, or system alerts at this moment.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {today.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Today</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-2.5">{today.map(renderItem)}</div>
              </div>
            )}

            {yesterday.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Yesterday</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-2.5">{yesterday.map(renderItem)}</div>
              </div>
            )}

            {earlier.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Earlier</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-2.5">{earlier.map(renderItem)}</div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
