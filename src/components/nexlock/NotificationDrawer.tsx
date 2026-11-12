import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Trash2, Calendar, Shield, Smartphone, CreditCard, User, AlertCircle, AlertTriangle, Info, Store } from "lucide-react";
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
    refetchInterval: 15000, // Poll every 15s for live notifications
  });

  const unreadCount = unreadData?.data?.count || 0;

  // Fetch notifications list
  const { data: listData, refetch } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => apiClient.get("/notifications"),
    enabled: open, // Only fetch list when drawer is opened
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

  // Trigger refetch on open
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open]);

  // Group notifications helper
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

  // Format time relative or simple string
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

  // Get Priority Styling
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return {
          bg: "bg-red-500/10 border-red-500/20 text-red-500",
          indicator: "bg-red-500",
          icon: AlertCircle,
        };
      case "WARNING":
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
          indicator: "bg-amber-500",
          icon: AlertTriangle,
        };
      case "SUCCESS":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
          indicator: "bg-emerald-500",
          icon: Check,
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/20 text-blue-500",
          indicator: "bg-blue-500",
          icon: Info,
        };
    }
  };

  // Resolve Category Icon
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

  // Click handler resolving actions
  const handleItemClick = async (item: any) => {
    if (!item.isRead) {
      await markReadMutation.mutateAsync(item.id);
    }

    const meta = item.metadata;
    if (meta && meta.entityId) {
      const moduleName = String(meta.module).toLowerCase();
      // Safe navigation
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

  // Render Notification Item
  const renderItem = (item: any) => {
    const isUnread = !item.isRead;
    const style = getPriorityStyle(item.priority);
    const CatIcon = getCategoryIcon(item.category);
    const actionLabel = item.metadata?.action;

    return (
      <div
        key={item.id}
        className={cn(
          "group relative flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:bg-muted/40",
          isUnread ? "bg-muted/15 border-border/80 shadow-xs" : "bg-card/50 border-border/40"
        )}
      >
        {isUnread && (
          <span className={cn("absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full", style.indicator)} />
        )}

        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md border", style.bg)}>
          <CatIcon className="h-4 w-4" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn("text-xs font-semibold leading-none", isUnread ? "text-foreground" : "text-foreground/80")}>
              {item.title}
            </h4>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatTime(item.createdAt)}</span>
          </div>
          <p className="text-xs text-muted-foreground/90 leading-relaxed pr-6">{item.content}</p>

          {/* Action trigger wrapper */}
          <div className="mt-2.5 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleItemClick(item)}
              className="h-7 text-[10px] px-2.5 font-medium border-primary/20 hover:border-primary/45 hover:bg-primary/5 text-primary"
            >
              {actionLabel || "View Details"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(item.id)}
              className="h-7 w-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground ring-2 ring-card">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-bold">Notifications</SheetTitle>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllReadMutation.mutate()}
                className="h-8 text-xs text-muted-foreground hover:text-primary cursor-pointer hover:bg-transparent"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>

        {notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 animate-pulse">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">All caught up!</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              No new alerts or activity notifications. We will notify you here when anything happens.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {today.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Today</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-3">{today.map(renderItem)}</div>
              </div>
            )}

            {yesterday.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Yesterday</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-3">{yesterday.map(renderItem)}</div>
              </div>
            )}

            {earlier.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Earlier</span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-3">{earlier.map(renderItem)}</div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
