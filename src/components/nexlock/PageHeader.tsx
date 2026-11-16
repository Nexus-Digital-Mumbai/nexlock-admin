import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import type { ReactNode } from "react";

interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-white/60 dark:border-[#164675]/80 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/80 dark:border-[#164675] bg-white/70 dark:bg-[#0B1D38]/80 px-3 py-1 text-xs text-muted-foreground dark:text-[#8CA5C8] shadow-xs backdrop-blur-md">
            {breadcrumbs.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/40 dark:text-[#8CA5C8]/40 shrink-0" />}
                {c.to ? (
                  <Link
                    to={c.to as never}
                    className="inline-flex items-center gap-1 font-medium transition-colors hover:text-primary"
                  >
                    {i === 0 && <Home className="h-3 w-3" />}
                    <span>{c.label}</span>
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground dark:text-[#F5F8FF]">{c.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground dark:text-[#F5F8FF] md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-xs md:text-sm leading-relaxed text-muted-foreground dark:text-[#8CA5C8]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </div>
  );
}
