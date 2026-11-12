import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface Crumb { label: string; to?: string }

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
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {c.to ? (
                  <Link to={c.to as never} className="hover:text-foreground">{c.label}</Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
