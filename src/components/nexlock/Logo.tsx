import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withPulse?: boolean;
  // Legacy props maintained for backwards compatibility
  showWordmark?: boolean;
  variant?: "brand" | "icon" | "full";
}

export function Logo({
  className,
  size = "md",
  withPulse = false,
  showWordmark,
  variant,
}: LogoProps) {
  // Sizing matrix for standalone N brand icon
  const sizeMap = {
    sm: {
      tile: "h-9 w-9 rounded-xl p-1.5",
      icon: "h-full w-full",
    },
    md: {
      tile: "h-11 w-11 rounded-2xl p-2",
      icon: "h-full w-full",
    },
    lg: {
      tile: "h-14 w-14 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3",
      icon: "h-full w-full",
    },
    xl: {
      tile: "h-18 w-18 sm:h-20 sm:w-20 rounded-3xl p-3 sm:p-3.5",
      icon: "h-full w-full",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isPulseActive = withPulse || (!showWordmark && variant === "icon");

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center border border-white/80 dark:border-[#164675] bg-white/80 dark:bg-[#0B1D38]/85 shadow-[0_8px_25px_rgba(7,85,216,0.1)] dark:shadow-[0_8px_25px_rgba(0,107,255,0.15)] backdrop-blur-xl transition-all duration-300 hover:scale-105",
        currentSize.tile,
        className
      )}
    >
      <img
        src="/nexus-icon.png"
        alt="Nexus"
        className={cn("object-contain drop-shadow-sm select-none", currentSize.icon)}
      />
      {isPulseActive && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C9E8] dark:bg-[#00D4FF] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white dark:border-[#020B1C] bg-[#0755D8] dark:bg-[#006BFF]" />
        </span>
      )}
    </div>
  );
}
