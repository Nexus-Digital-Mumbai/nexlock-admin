import { useMemo, useState, type ReactNode } from "react";
import {
  Search, Download, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  MoreHorizontal, Trash2, Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  accessor?: (row: T) => string | number;
}

export interface RowAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  destructive?: boolean;
  separatorBefore?: boolean;
  show?: (row: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  // Set this when `data` is already server-paginated (the caller fetches one page at a time and
  // runs its own search against the backend) — otherwise this component's own search box only
  // ever filters the current page's already-fetched rows, silently hiding matches that exist on
  // other pages. Hides the built-in search input entirely so there's only one (working) search
  // box on the page, rather than two look-alike ones where only one actually searches everything.
  hideSearch?: boolean;
  pageSize?: number;
  bulkActions?: ReactNode;
  filters?: ReactNode;
  rowKey: (row: T) => string;
  rowActions?: RowAction<T>[];
  onBulkDelete?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search…",
  searchKeys,
  hideSearch = false,
  pageSize = 10,
  bulkActions,
  filters,
  rowKey,
  rowActions,
  onBulkDelete,
  onRowClick,
  loading,
  emptyTitle = "No records yet",
  emptyDescription = "There are no items matching your search or filters.",
  emptyAction,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  // Advanced Column Filters
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  // Helper to extract clean plain text from cell values / custom React nodes
  const getCellText = (row: T, c: Column<T>): string => {
    if (c.accessor) return String(c.accessor(row));
    const val = (row as any)[c.key];
    if (val === null || val === undefined) return "";
    
    if (c.render) {
      const rendered = c.render(row);
      if (rendered === null || rendered === undefined) return "";
      if (typeof rendered === "string" || typeof rendered === "number" || typeof rendered === "boolean") {
        return String(rendered);
      }
      
      if (typeof rendered === "object" && (rendered as any).props) {
        const props = (rendered as any).props;
        if (props.status) return String(props.status); // StatusBadge helper
        
        if (props.children !== undefined) {
          const children = props.children;
          if (Array.isArray(children)) {
            return children.map(ch => typeof ch === "object" ? "" : String(ch)).join(" ").trim();
          }
          if (typeof children === "object") {
            if (children.props && children.props.children) {
              const inner = children.props.children;
              return typeof inner === "object" ? "" : String(inner);
            }
            return "";
          }
          return String(children);
        }
      }
    }
    return String(val);
  };

  const filtered = useMemo(() => {
    let result = data;

    // Apply global search query
    if (query && !hideSearch) {
      const q = query.toLowerCase();
      result = result.filter((row) => {
        const keys = (searchKeys ?? (Object.keys(row as object) as (keyof T)[]));
        return keys.some((k) => String((row as Record<string, unknown>)[k as string] ?? "").toLowerCase().includes(q));
      });
    }

    // Apply column-level filters
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      const q = val.toLowerCase();
      result = result.filter((row) => {
        const col = columns.find((c) => String(c.key) === key);
        if (!col) return true;
        const text = getCellText(row, col);
        return text.toLowerCase().includes(q);
      });
    });

    return result;
  }, [data, query, searchKeys, hideSearch, columnFilters, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => String(c.key) === sort.key);
    const acc = col?.accessor ?? ((r: T) => (r as Record<string, unknown>)[sort.key] as string | number);
    return [...filtered].sort((a, b) => {
      const av = acc(a); const bv = acc(b);
      if (av == null) return 1; if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
      return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [filtered, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(rowKey(r)));
  const toggleAll = () => {
    const next = new Set(selected);
    if (allSelected) pageRows.forEach((r) => next.delete(rowKey(r)));
    else pageRows.forEach((r) => next.add(rowKey(r)));
    setSelected(next);
  };
  const toggleOne = (k: string) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k); else next.add(k);
    setSelected(next);
  };

  const handleBulkDelete = () => {
    if (!onBulkDelete) return;
    onBulkDelete(Array.from(selected));
    setSelected(new Set());
  };

  const exportToCSV = () => {
    const headers = columns.map(c => `"${String(c.header).replace(/"/g, '""')}"`).join(",");
    const rows = sorted.map(row => {
      return columns.map(c => `"${getCellText(row, c).replace(/"/g, '""')}"`).join(",");
    });
    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV export ready");
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocker prevented PDF generation. Please allow popups.");
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Export PDF - NexLock Platform</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
            .header { margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
            .logo { font-size: 20px; font-weight: bold; color: #0f172a; margin: 0; }
            .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
            .timestamp { float: right; font-size: 11px; color: #64748b; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 11px; }
            th { background-color: #f8fafc; font-weight: 600; color: #334155; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="timestamp">Generated on: ${new Date().toLocaleString()}</span>
            <h1 class="logo">NexLock Enterprise</h1>
            <div class="subtitle">Platform Console Data Export</div>
          </div>
          <table>
            <thead>
              <tr>
                ${columns.map(c => `<th>${c.header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${sorted.map(row => `
                <tr>
                  ${columns.map(c => `<td>${getCellText(row, c)}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        {!hideSearch && (
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs text-primary">
              <span className="font-medium">{selected.size} selected</span>
              {bulkActions}
              {onBulkDelete && (
                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive hover:text-destructive" onClick={handleBulkDelete}>
                  <Trash2 className="h-3.5 w-3.5" />Delete
                </Button>
              )}
            </div>
          )}
          {filters}
          <Button
            variant={showColumnFilters ? "secondary" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setShowColumnFilters(!showColumnFilters);
              setColumnFilters({});
            }}
          >
            <Filter className="h-3.5 w-3.5" />Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-3.5 w-3.5" />Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
                Export as Excel (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                Export as PDF Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </th>
              {columns.map((c) => {
                const isSort = sort?.key === String(c.key);
                return (
                  <th key={String(c.key)} className={cn("px-4 py-3 text-left font-medium", c.className)}>
                    {c.sortable ? (
                      <button
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => setSort((s) => {
                          const k = String(c.key);
                          if (s?.key !== k) return { key: k, dir: "asc" };
                          if (s.dir === "asc") return { key: k, dir: "desc" };
                          return null;
                        })}
                      >
                        {c.header}
                        {isSort ? (sort?.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}
                      </button>
                    ) : c.header}
                  </th>
                );
              })}
              <th className="w-10 px-4 py-3" />
            </tr>
            {showColumnFilters && (
              <tr className="border-t border-border bg-muted/10">
                <th className="px-4 py-2" />
                {columns.map((c) => (
                  <th key={`filter-${String(c.key)}`} className="px-4 py-2">
                    <Input
                      placeholder={`Filter ${c.header}...`}
                      value={columnFilters[String(c.key)] || ""}
                      onChange={(e) => {
                        setColumnFilters({
                          ...columnFilters,
                          [String(c.key)]: e.target.value,
                        });
                        setPage(1);
                      }}
                      className="h-7 px-2 py-1 text-xs font-normal bg-card border-border"
                    />
                  </th>
                ))}
                <th className="px-4 py-2" />
              </tr>
            )}
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <tr key={`sk-${i}`} className="border-t border-border">
                <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3"><Skeleton className="h-4 w-full max-w-[140px]" /></td>
                ))}
                <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
              </tr>
            ))}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-16">
                  <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Inbox className="h-5 w-5" />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-foreground">{emptyTitle}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{emptyDescription}</p>
                    {emptyAction && <div className="mt-4">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            )}
            {!loading && pageRows.map((row) => {
              const k = rowKey(row);
              const checked = selected.has(k);
              return (
                <tr
                  key={k}
                  className={cn(
                    "border-t border-border transition-colors hover:bg-muted/40",
                    checked && "bg-primary/5",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? (e) => {
                    if ((e.target as HTMLElement).closest("[data-row-guard]")) return;
                    onRowClick(row);
                  } : undefined}
                >
                  <td className="px-4 py-3" data-row-guard>
                    <Checkbox checked={checked} onCheckedChange={() => toggleOne(k)} />
                  </td>
                  {columns.map((c) => (
                    <td key={String(c.key)} className={cn("px-4 py-3 align-middle text-foreground", c.className)}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right" data-row-guard>
                    {rowActions && rowActions.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {rowActions
                            .filter((a) => !a.show || a.show(row))
                            .map((a, i) => (
                              <div key={a.label}>
                                {a.separatorBefore && i > 0 && <DropdownMenuSeparator />}
                                <DropdownMenuItem
                                  onClick={() => a.onClick(row)}
                                  className={a.destructive ? "text-destructive focus:text-destructive" : ""}
                                >
                                  {a.icon && <a.icon className="mr-2 h-4 w-4" />}
                                  {a.label}
                                </DropdownMenuItem>
                              </div>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground md:flex-row md:items-center">
        <div>
          Showing <span className="font-medium text-foreground">{sorted.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, sorted.length)}</span> of <span className="font-medium text-foreground">{sorted.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
            <Button key={p} variant={p === safePage ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" onClick={() => setPage(p)}>{p}</Button>
          ))}
          {totalPages > 5 && <span className="px-1">…</span>}
          <Button variant="outline" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}
