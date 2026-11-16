import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type FieldType = "text" | "email" | "tel" | "password" | "number" | "date" | "textarea" | "select" | "switch";

export interface FormField {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  section?: string;
  colSpan?: 1 | 2;
  validate?: (value: unknown, values: Record<string, unknown>) => string | null;
}

export interface CrudModalProps<T extends Record<string, unknown>> {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  fields: FormField[];
  initial?: Partial<T>;
  mode?: "create" | "edit";
  submitLabel?: string;
  onSubmit: (values: T) => void | Promise<void>;
}

export function CrudModal<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initial,
  mode = "create",
  submitLabel,
  onSubmit,
}: CrudModalProps<T>) {
  const defaults = useMemo(() => {
    const d: Record<string, unknown> = {};
    fields.forEach((f) => {
      d[f.name] =
        (initial as Record<string, unknown> | undefined)?.[f.name] ??
        (f.type === "switch" ? false : f.type === "number" ? 0 : "");
    });
    return d;
  }, [fields, initial]);

  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(defaults);
      setErrors({});
    }
  }, [open, defaults]);

  const setVal = (name: string, v: unknown) => {
    setValues((p) => ({ ...p, [name]: v }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      const v = values[f.name];
      const empty = v === "" || v === null || v === undefined;
      if (f.required && empty) errs[f.name] = `${f.label} is required`;
      else if (!empty && f.type === "email" && !/^\S+@\S+\.\S+$/.test(String(v)))
        errs[f.name] = "Enter a valid email address";
      else if (!empty && f.type === "tel" && String(v).replace(/\D/g, "").length < 7)
        errs[f.name] = "Enter a valid phone number";
      else if (!empty && f.type === "number" && Number.isNaN(Number(v)))
        errs[f.name] = "Must be a valid number";
      else if (f.validate) {
        const msg = f.validate(v, values);
        if (msg) errs[f.name] = msg;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const out: Record<string, unknown> = { ...values };
      fields.forEach((f) => {
        if (f.type === "number") out[f.name] = Number(out[f.name] ?? 0);
      });
      await onSubmit(out as T);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const sections = useMemo(() => {
    const map = new Map<string, FormField[]>();
    fields.forEach((f) => {
      const s = f.section ?? "";
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push(f);
    });
    return Array.from(map.entries());
  }, [fields]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-elevated max-w-2xl max-h-[85vh] flex flex-col text-card-foreground p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="border-b border-border/60 px-6 py-4.5 bg-card/60 flex-shrink-0">
          <DialogTitle className="text-base font-bold text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs text-muted-foreground">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="px-6 py-5 space-y-6 flex-1 overflow-y-auto">
          {sections.map(([section, list], idx) => (
            <div key={section || idx} className="space-y-3">
              {section && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {section}
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {list.map((f) => (
                  <div
                    key={f.name}
                    className={cn("space-y-1.5", f.colSpan === 2 && "md:col-span-2")}
                  >
                    <Label className="text-xs font-semibold text-foreground/90">
                      {f.label}
                      {f.required && <span className="ml-1 text-destructive font-bold">*</span>}
                    </Label>
                    {renderField(f, values[f.name], (v) => setVal(f.name, v), !!errors[f.name])}
                    {errors[f.name] ? (
                      <p className="text-[11px] font-medium text-destructive">{errors[f.name]}</p>
                    ) : f.helper ? (
                      <p className="text-[11px] text-muted-foreground">{f.helper}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="border-t border-border/80 px-6 py-3.5 sm:justify-end flex-shrink-0 bg-muted/20 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={submitting} className="border-border/80 text-xs font-medium">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting} className="gap-1.5 text-xs font-semibold shadow-xs">
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {submitLabel ?? (mode === "edit" ? "Save Changes" : "Create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function renderField(
  f: FormField,
  value: unknown,
  onChange: (v: unknown) => void,
  hasError: boolean,
): ReactNode {
  const t = f.type ?? "text";
  if (t === "textarea") {
    return (
      <Textarea
        value={String(value ?? "")}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={cn("text-xs bg-muted/20 border-border/80 focus-visible:bg-card", hasError && "border-destructive")}
      />
    );
  }
  if (t === "select") {
    return (
      <Select value={String(value ?? "")} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className={cn("h-9 text-xs bg-muted/20 border-border/80", hasError && "border-destructive")}>
          <SelectValue placeholder={f.placeholder ?? "Select an option…"} />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-xl border-border">
          {(f.options ?? []).map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (t === "switch") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-2.5">
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
        <span className="text-xs font-medium text-foreground">
          {value ? "Enabled" : "Disabled"}
        </span>
      </div>
    );
  }
  return (
    <Input
      type={t}
      value={value === undefined || value === null ? "" : String(value)}
      placeholder={f.placeholder}
      min={f.min}
      max={f.max}
      onChange={(e) =>
        onChange(t === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
      }
      className={cn("h-9 text-xs bg-muted/20 border-border/80 focus-visible:bg-card", hasError && "border-destructive")}
    />
  );
}
