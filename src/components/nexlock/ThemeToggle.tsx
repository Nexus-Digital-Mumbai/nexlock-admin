import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "circular" | "pill";
}

export function ThemeToggle({ className, variant = "circular" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Dark theme active (Click to switch to light)" : "Light theme active (Click to switch to dark)"}
        className={cn(
          "glass-pill relative inline-flex h-9 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer select-none",
          "text-[#071B5E] dark:text-[#F5F8FF]",
          "hover:border-[#0755D8]/50 dark:hover:border-[#00D4FF]/50",
          "hover:shadow-[0_0_15px_rgba(7,85,216,0.15)] dark:hover:shadow-[0_0_15px_rgba(0,212,255,0.25)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          className
        )}
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-[#00D4FF] transition-transform duration-300 rotate-0" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500 transition-transform duration-300 rotate-0" />
          )}
        </span>
        <span className="text-[11px] font-medium tracking-tight">
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Dark theme active (Click for Light Mode)" : "Light theme active (Click for Dark Mode)"}
      className={cn(
        "glass-pill relative flex h-11 w-11 items-center justify-center rounded-full cursor-pointer select-none group",
        "text-[#071B5E] dark:text-[#F5F8FF]",
        "hover:border-[#0755D8]/50 dark:hover:border-[#00D4FF]/50",
        "hover:bg-white/90 dark:hover:bg-[#0B1D38]/95",
        "hover:text-[#0755D8] dark:hover:text-[#00D4FF]",
        "hover:shadow-[0_0_16px_rgba(7,85,216,0.18)] dark:hover:shadow-[0_0_18px_rgba(0,212,255,0.28)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        {isDark ? (
          <Moon className="h-4.5 w-4.5 text-[#00D4FF] transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]" />
        ) : (
          <Sun className="h-4.5 w-4.5 text-amber-500 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

