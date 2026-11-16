import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

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
  const { isDark } = useTheme();

  const toneConfig: Record<string, { iconBg: string; sparkColor: string }> = {
    primary: {
      iconBg: "bg-primary/10 text-primary border border-primary/20 dark:bg-[#006BFF]/15 dark:text-[#00D4FF] dark:border-[#006BFF]/30",
      sparkColor: isDark ? "#00D4FF" : "#0755D8",
    },
    success: {
      iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30",
      sparkColor: "#10B981",
    },
    warning: {
      iconBg: "bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30",
      sparkColor: "#F59E0B",
    },
    danger: {
      iconBg: "bg-rose-500/15 text-rose-500 dark:text-rose-400 border border-rose-500/30",
      sparkColor: "#E11D48",
    },
  };

  const config = toneConfig[tone] || toneConfig.primary;

  return (
    <div
      className={cn(
        "group relative overflow-hidden card-interactive p-5"
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
            <div className="text-2xl font-extrabold tracking-tight text-foreground dark:text-[#FFFFFF] md:text-[28px] leading-tight font-sans">
              {value}
            </div>
            <div className="text-xs font-medium text-muted-foreground dark:text-[#8CA5C8] mt-0.5">
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
        <div className="mt-3 border-t border-[#164675]/60 pt-2 text-[11px] text-[#8CA5C8] flex items-center justify-between">
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}
