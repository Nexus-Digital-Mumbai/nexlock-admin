import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success/10 text-success ring-1 ring-inset ring-success/20",
  warning: "bg-warning/10 text-warning ring-1 ring-inset ring-warning/20",
  danger: "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20",
  info: "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
  neutral: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
};

const statusToTone: Record<string, Tone> = {
  active: "success",
  success: "success",
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
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", toneClass[t])}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        t === "success" && "bg-success",
        t === "warning" && "bg-warning",
        t === "danger" && "bg-destructive",
        t === "info" && "bg-primary",
        t === "neutral" && "bg-muted-foreground/60",
      )} />
      {status}
    </span>
  );
}
