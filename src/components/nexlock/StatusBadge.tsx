import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25",
  danger: "bg-destructive/10 text-destructive border border-destructive/25",
  info: "bg-primary/10 text-primary border border-primary/25",
  neutral: "bg-muted/70 text-muted-foreground border border-border/80",
};

const statusToTone: Record<string, Tone> = {
  active: "success",
  online: "success",
  success: "success",
  completed: "success",
  closed: "neutral",
  pending: "warning",
  overdue: "warning",
  warning: "warning",
  locked: "warning",
  offline: "neutral",
  failed: "danger",
  defaulted: "danger",
  suspended: "danger",
  wiped: "danger",
  danger: "danger",
  info: "info",
};

export function StatusBadge({ status, tone }: { status: string; tone?: Tone }) {
  const t = tone ?? statusToTone[status.toLowerCase()] ?? "neutral";
  const isPulse = t === "success" || t === "danger" || status.toLowerCase() === "locked";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide transition-colors",
        toneClass[t]
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isPulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              t === "success" && "bg-emerald-400",
              t === "warning" && "bg-amber-400",
              t === "danger" && "bg-rose-400",
              t === "info" && "bg-primary",
              t === "neutral" && "bg-muted-foreground"
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            t === "success" && "bg-emerald-500",
            t === "warning" && "bg-amber-500",
            t === "danger" && "bg-destructive",
            t === "info" && "bg-primary",
            t === "neutral" && "bg-muted-foreground/70"
          )}
        />
      </span>
      {status}
    </span>
  );
}
