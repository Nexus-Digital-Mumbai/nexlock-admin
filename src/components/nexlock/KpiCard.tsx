import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label, value, sub, icon: Icon, trend, tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
  };
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", tones[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend && (
          <span className={cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
            trend.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
            {trend.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
        {sub && <span className="text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}
