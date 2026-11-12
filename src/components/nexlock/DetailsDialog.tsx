import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-card text-card-foreground border border-border p-0 overflow-hidden">
        <DialogHeader className="border-b border-border px-6 py-4 flex-shrink-0">
          <DialogTitle className="text-base">{title}</DialogTitle>
          {subtitle && <DialogDescription className="text-xs">{subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-6 py-5 md:grid-cols-2 flex-1 overflow-y-auto">
          {fields.map((f, i) => (
            <div key={i} className={f.colSpan === 2 ? "md:col-span-2" : ""}>
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {f.label}
              </div>
              <div className="mt-1 text-sm text-foreground">{f.value ?? "—"}</div>
            </div>
          ))}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-3 flex-shrink-0 bg-card">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
