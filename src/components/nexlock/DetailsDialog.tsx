import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface DetailField {
  label: string;
  value: ReactNode;
  colSpan?: 1 | 2;
}

export interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  fields: DetailField[];
  footer?: ReactNode;
}

export function DetailsDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  fields,
  footer,
}: DetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-card text-card-foreground border border-border/80 p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-border/80 px-6 py-4.5 bg-card/60 flex-shrink-0">
          <DialogTitle className="text-base font-bold text-foreground">{title}</DialogTitle>
          {subtitle && <DialogDescription className="text-xs text-muted-foreground">{subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3.5 px-6 py-5 md:grid-cols-2 flex-1 overflow-y-auto">
          {fields.map((f, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border border-border/60 bg-muted/20 p-3.5 transition-colors hover:bg-muted/30",
                f.colSpan === 2 && "md:col-span-2"
              )}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {f.label}
              </div>
              <div className="mt-1 text-xs md:text-sm font-medium text-foreground break-words">
                {f.value ?? "—"}
              </div>
            </div>
          ))}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-2.5 border-t border-border/80 px-6 py-3.5 flex-shrink-0 bg-muted/20">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
