import { useMemo, useState, type ReactNode } from "react";
import {
  Search, Download, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  MoreHorizontal, Trash2, Inbox, X, FileSpreadsheet, FileText, Check
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
  searchPlaceholder = "Search records…",
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
  emptyTitle = "No records found",
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

  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;

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
        if (props.status) return String(props.status);
        
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
    link.setAttribute("download", `nexus_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully");
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
          <title>Export PDF - Nexus Enterprise</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #0f172a; background: #fff; }
            .header { margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
            .logo { font-size: 22px; font-weight: 800; color: #1e3a8a; margin: 0; }
            .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
            .timestamp { float: right; font-size: 11px; color: #64748b; margin-top: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 11px; }
            th { background-color: #f8fafc; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.04em; }
            tr:nth-child(even) { background-color: #fbfcfe; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="timestamp">Generated: ${new Date().toLocaleString()}</span>
            <h1 class="logo">Nexus Enterprise</h1>
            <div class="subtitle">Platform Management Data Export</div>
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
    <div className="card-surface overflow-hidden rounded-3xl transition-all">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border/60 p-4 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-[#061329]/60 backdrop-blur-md">
        {!hideSearch && (
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="glass-pill h-10 pl-10 pr-8 text-xs rounded-full w-full text-foreground dark:text-[#F5F8FF] placeholder:text-muted-foreground dark:placeholder:text-[#8CA5C8]/75 focus-visible:border-primary dark:focus-visible:border-[#00D4FF] focus-visible:ring-primary/20 dark:focus-visible:ring-[#00D4FF]/25 shadow-xs transition-all"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-black/5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {selected.size > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary animate-fade-in shadow-xs">
              <span>{selected.size} selected</span>
              {bulkActions}
              {onBulkDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6.5 gap-1 text-xs text-destructive hover:bg-destructive/15 hover:text-destructive px-2 font-medium rounded-full"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-3 w-3" />Delete
                </Button>
              )}
            </div>
          )}
          {filters}
          <Button
            variant={showColumnFilters || activeFilterCount > 0 ? "secondary" : "outline"}
            size="sm"
            className="glass-pill h-10 rounded-full gap-1.5 text-xs font-medium text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF] px-4 cursor-pointer"
            onClick={() => {
              setShowColumnFilters(!showColumnFilters);
              if (showColumnFilters) setColumnFilters({});
            }}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="glass-pill h-10 rounded-full gap-1.5 text-xs font-medium text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF] px-4 cursor-pointer">
                <Download className="h-3.5 w-3.5" />Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="card-elevated w-48 rounded-2xl p-1.5 text-foreground dark:text-[#F5F8FF] shadow-xl">
              <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer gap-2 text-xs font-medium rounded-xl px-3 py-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export as CSV (Excel)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer gap-2 text-xs font-medium rounded-xl px-3 py-2">
                <FileText className="h-4 w-4 text-rose-600" /> Export as PDF Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-white/60 dark:border-[#164675] bg-white/60 dark:bg-[#061329]/90 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:text-[#8CA5C8] backdrop-blur-md">
            <tr>
              <th className="w-10 px-4 py-3.5 text-left">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all rows" />
              </th>
              {columns.map((c) => {
                const isSort = sort?.key === String(c.key);
                return (
                  <th key={String(c.key)} className={cn("px-4 py-3.5 text-left font-semibold", c.className)}>
                    {c.sortable ? (
                      <button
                        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group cursor-pointer"
                        onClick={() => setSort((s) => {
                          const k = String(c.key);
                          if (s?.key !== k) return { key: k, dir: "asc" };
                          if (s.dir === "asc") return { key: k, dir: "desc" };
                          return null;
                        })}
                      >
                        <span>{c.header}</span>
                        {isSort ? (
                          sort?.dir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5 text-primary font-bold" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-primary font-bold" />
                          )
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 opacity-30 group-hover:opacity-75" />
                        )}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
              <th className="w-12 px-4 py-3.5 text-right font-medium">Actions</th>
            </tr>
            {showColumnFilters && (
              <tr className="border-t border-border/60 bg-muted/20 animate-fade-in">
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
                      className="h-7.5 px-2.5 py-1 text-xs font-normal bg-card border-border/80 focus-visible:border-primary/50"
                    />
                  </th>
                ))}
                <th className="px-4 py-2" />
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <tr key={`sk-${i}`} className="hover:bg-muted/30">
                <td className="px-4 py-3.5"><Skeleton className="h-4 w-4 rounded" /></td>
                {columns.map((c) => (
                  <td key={String(c.key)} className="px-4 py-3.5">
                    <Skeleton className="h-4 w-full max-w-[140px] rounded" />
                  </td>
                ))}
                <td className="px-4 py-3.5"><Skeleton className="h-4 w-4 ml-auto rounded" /></td>
              </tr>
            ))}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-16 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                      <Inbox className="h-6 w-6 text-primary/70" />
                    </div>
                    <h4 className="mt-3 text-sm font-bold text-foreground">{emptyTitle}</h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{emptyDescription}</p>
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
                    "transition-colors duration-150 hover:bg-muted/40",
                    checked && "bg-primary/5 hover:bg-primary/8",
                    onRowClick && "cursor-pointer",
                  )}
                  onClick={onRowClick ? (e) => {
                    if ((e.target as HTMLElement).closest("[data-row-guard]")) return;
                    onRowClick(row);
                  } : undefined}
                >
                  <td className="px-4 py-3.5" data-row-guard>
                    <Checkbox checked={checked} onCheckedChange={() => toggleOne(k)} aria-label="Select row" />
                  </td>
                  {columns.map((c) => (
                    <td key={String(c.key)} className={cn("px-4 py-3.5 align-middle text-foreground text-xs md:text-sm font-normal", c.className)}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 text-right" data-row-guard>
                    {rowActions && rowActions.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border border-white/80 dark:border-[#164675] bg-white/95 dark:bg-[#0B1D38]/95 backdrop-blur-xl text-foreground dark:text-[#F5F8FF]">
                          {rowActions
                            .filter((a) => !a.show || a.show(row))
                            .map((a, i) => (
                              <div key={a.label}>
                                {a.separatorBefore && i > 0 && <DropdownMenuSeparator />}
                                <DropdownMenuItem
                                  onClick={() => a.onClick(row)}
                                  className={cn(
                                    "cursor-pointer text-xs font-medium py-2 hover:bg-primary/10 dark:hover:bg-[#006BFF]/15 focus:bg-primary/15 dark:focus:bg-[#006BFF]/20 text-foreground dark:text-[#F5F8FF]",
                                    a.destructive && "text-destructive focus:bg-destructive/10 focus:text-destructive",
                                  )}
                                >
                                  {a.icon && <a.icon className="mr-2 h-4 w-4" />}
                                  {a.label}
                                </DropdownMenuItem>
                              </div>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-50"><MoreHorizontal className="h-4 w-4" /></Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col items-start justify-between gap-3 border-t border-white/60 dark:border-[#164675] bg-white/50 dark:bg-[#061329]/75 px-5 py-3.5 text-xs text-muted-foreground dark:text-[#8CA5C8] md:flex-row md:items-center backdrop-blur-md">
        <div>
          Showing <span className="font-semibold text-foreground font-mono">{sorted.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, sorted.length)}</span> of <span className="font-semibold text-foreground font-mono">{sorted.length}</span> records
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="h-8 w-8 rounded-full p-0 border-white/80 dark:border-[#164675] bg-white/70 dark:bg-[#0B1D38]/80 text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF]"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
            <Button
              key={p}
              variant={p === safePage ? "default" : "outline"}
              size="sm"
              className={cn("h-8 w-8 rounded-full p-0 text-xs font-semibold", p === safePage ? "bg-primary text-white shadow-xs border-primary" : "border-white/80 dark:border-[#164675] bg-white/70 dark:bg-[#0B1D38]/80 text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF]")}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          {totalPages > 5 && <span className="px-1 text-muted-foreground font-mono">…</span>}
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
            className="h-8 w-8 rounded-full p-0 border-white/80 dark:border-[#164675] bg-white/70 dark:bg-[#0B1D38]/80 text-foreground dark:text-[#F5F8FF] hover:border-primary/40 dark:hover:border-[#00D4FF]/40 hover:text-primary dark:hover:text-[#00D4FF]"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
