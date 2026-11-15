import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  const toneConfig: Record<string, { iconBg: string; sparkColor: string }> = {
    primary: {
      iconBg: "bg-[#EDE9FE] dark:bg-blue-950/40 text-[#1265D8] dark:text-blue-400 border border-white/80 dark:border-white/10",
      sparkColor: "#1265D8",
    },
    success: {
      iconBg: "bg-[#DCFCE7] dark:bg-emerald-950/50 text-[#16A34A] dark:text-emerald-400 border border-white/80 dark:border-white/10",
      sparkColor: "#10B981",
    },
    warning: {
      iconBg: "bg-[#FEF3C7] dark:bg-amber-950/50 text-[#D97706] dark:text-amber-400 border border-white/80 dark:border-white/10",
      sparkColor: "#F59E0B",
    },
    danger: {
      iconBg: "bg-[#FFE4E6] dark:bg-rose-950/50 text-[#E11D48] dark:text-rose-400 border border-white/80 dark:border-white/10",
      sparkColor: "#E11D48",
    },
  };

  const config = toneConfig[tone] || toneConfig.primary;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/80 dark:border-white/10 bg-white/55 dark:bg-slate-900/50 p-5 shadow-[0_10px_30px_rgba(80,85,120,0.06)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white/70 dark:hover:bg-slate-900/70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs transition-transform duration-200 group-hover:scale-105",
              config.iconBg
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-[#14172C] dark:text-white md:text-[28px] leading-tight font-sans">
              {value}
            </div>
            <div className="text-xs font-medium text-[#64748B] dark:text-slate-400 mt-0.5">
              {label}
            </div>
          </div>
        </div>

        {/* Mini sparkline + Trend tag from reference */}
        <div className="flex flex-col items-end justify-between self-stretch">
          <svg className="w-16 h-7 overflow-visible opacity-80" viewBox="0 0 64 24" fill="none">
            <path
              d="M2 18 C 14 18, 18 6, 32 10 C 46 14, 50 4, 62 4"
              stroke={config.sparkColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="62" cy="4" r="3" fill={config.sparkColor} />
          </svg>

          {trend ? (
            <div
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              <span>{trend.up ? "↑" : "↓"}</span>
              <span>{trend.value}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>↑</span>
              <span>8%</span>
            </div>
          )}
        </div>
      </div>

      {sub && (
        <div className="mt-3 border-t border-black/5 dark:border-white/10 pt-2 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}
