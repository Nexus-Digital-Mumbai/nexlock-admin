import nexlockLogo from "@/assets/nexlock-logo.jpeg";
import { cn } from "@/lib/utils";

export function Logo({ className, showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img src={nexlockLogo} alt="NexLock" className="h-8 w-8 rounded-md object-cover bg-white p-0.5" />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">NexLock</span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/60">Admin Console</span>
        </div>
      )}
    </div>
  );
}
