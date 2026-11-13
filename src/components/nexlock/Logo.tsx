import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showWordmark ? (
        <div className="flex items-center">
          <img
            src="/nexus-official-logo.png"
            alt="NEXUS"
            className="h-10 w-auto max-w-[190px] object-contain transition-transform duration-200"
          />
        </div>
      ) : (
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white/70 p-1 shadow-sm backdrop-blur-md">
          <img
            src="/nexus-official-logo.png"
            alt="NEXUS"
            className="h-full w-auto max-w-none object-cover object-left"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        </div>
      )}
    </div>
  );
}
