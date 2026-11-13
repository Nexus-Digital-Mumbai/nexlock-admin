import { i as __toESM } from "../_runtime.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, l as Input, m as cn, n as DropdownMenu, o as DropdownMenuTrigger, r as DropdownMenuContent, u as Button } from "./router-C4OGpStW.mjs";
import { t as Checkbox } from "./checkbox-DMTtsYgG.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { $ as FileText, S as Search, Z as Funnel, _t as ChevronDown, at as Download, et as FileSpreadsheet, gt as ChevronLeft, ht as ChevronRight, it as Ellipsis, mt as ChevronUp, n as X, q as Inbox, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/DataTable-e7erQZcg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function DataTable({ data, columns, searchPlaceholder = "Search records…", searchKeys, hideSearch = false, pageSize = 10, bulkActions, filters, rowKey, rowActions, onBulkDelete, onRowClick, loading, emptyTitle = "No records found", emptyDescription = "There are no items matching your search or filters.", emptyAction }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [sort, setSort] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [showColumnFilters, setShowColumnFilters] = (0, import_react.useState)(false);
	const [columnFilters, setColumnFilters] = (0, import_react.useState)({});
	const activeFilterCount = Object.values(columnFilters).filter(Boolean).length;
	const getCellText = (row, c) => {
		if (c.accessor) return String(c.accessor(row));
		const val = row[c.key];
		if (val === null || val === void 0) return "";
		if (c.render) {
			const rendered = c.render(row);
			if (rendered === null || rendered === void 0) return "";
			if (typeof rendered === "string" || typeof rendered === "number" || typeof rendered === "boolean") return String(rendered);
			if (typeof rendered === "object" && rendered.props) {
				const props = rendered.props;
				if (props.status) return String(props.status);
				if (props.children !== void 0) {
					const children = props.children;
					if (Array.isArray(children)) return children.map((ch) => typeof ch === "object" ? "" : String(ch)).join(" ").trim();
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
	const filtered = (0, import_react.useMemo)(() => {
		let result = data;
		if (query && !hideSearch) {
			const q = query.toLowerCase();
			result = result.filter((row) => {
				return (searchKeys ?? Object.keys(row)).some((k) => String(row[k] ?? "").toLowerCase().includes(q));
			});
		}
		Object.entries(columnFilters).forEach(([key, val]) => {
			if (!val) return;
			const q = val.toLowerCase();
			result = result.filter((row) => {
				const col = columns.find((c) => String(c.key) === key);
				if (!col) return true;
				return getCellText(row, col).toLowerCase().includes(q);
			});
		});
		return result;
	}, [
		data,
		query,
		searchKeys,
		hideSearch,
		columnFilters,
		columns
	]);
	const sorted = (0, import_react.useMemo)(() => {
		if (!sort) return filtered;
		const acc = columns.find((c) => String(c.key) === sort.key)?.accessor ?? ((r) => r[sort.key]);
		return [...filtered].sort((a, b) => {
			const av = acc(a);
			const bv = acc(b);
			if (av == null) return 1;
			if (bv == null) return -1;
			if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
			return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
		});
	}, [
		filtered,
		sort,
		columns
	]);
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
	const toggleOne = (k) => {
		const next = new Set(selected);
		if (next.has(k)) next.delete(k);
		else next.add(k);
		setSelected(next);
	};
	const handleBulkDelete = () => {
		if (!onBulkDelete) return;
		onBulkDelete(Array.from(selected));
		setSelected(/* @__PURE__ */ new Set());
	};
	const exportToCSV = () => {
		const csvContent = "﻿" + [columns.map((c) => `"${String(c.header).replace(/"/g, "\"\"")}"`).join(","), ...sorted.map((row) => {
			return columns.map((c) => `"${getCellText(row, c).replace(/"/g, "\"\"")}"`).join(",");
		})].join("\n");
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
            <span class="timestamp">Generated: ${(/* @__PURE__ */ new Date()).toLocaleString()}</span>
            <h1 class="logo">Nexus Enterprise</h1>
            <div class="subtitle">Platform Management Data Export</div>
          </div>
          <table>
            <thead>
              <tr>
                ${columns.map((c) => `<th>${c.header}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${sorted.map((row) => `
                <tr>
                  ${columns.map((c) => `<td>${getCellText(row, c)}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          <\/script>
        </body>
      </html>
    `;
		printWindow.document.write(html);
		printWindow.document.close();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_12px_36px_-6px_rgba(100,105,145,0.08)] transition-all",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-white/60 dark:border-white/10 p-4 md:flex-row md:items-center md:justify-between bg-white/40 dark:bg-white/5 backdrop-blur-md",
				children: [!hideSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full md:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								setPage(1);
							},
							placeholder: searchPlaceholder,
							className: "h-10 pl-10 pr-8 text-xs rounded-full bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 hover:bg-white focus-visible:bg-white shadow-xs transition-all"
						}),
						query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setQuery("");
								setPage(1);
							},
							className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-black/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary animate-fade-in shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [selected.size, " selected"] }),
								bulkActions,
								onBulkDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-6.5 gap-1 text-xs text-destructive hover:bg-destructive/15 hover:text-destructive px-2 font-medium rounded-full",
									onClick: handleBulkDelete,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" }), "Delete"]
								})
							]
						}),
						filters,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: showColumnFilters || activeFilterCount > 0 ? "secondary" : "outline",
							size: "sm",
							className: "h-10 rounded-full gap-1.5 text-xs font-medium border-white/85 dark:border-white/15 bg-white/80 dark:bg-white/10 hover:bg-white shadow-xs px-4",
							onClick: () => {
								setShowColumnFilters(!showColumnFilters);
								if (showColumnFilters) setColumnFilters({});
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" }),
								activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white",
									children: activeFilterCount
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "h-10 rounded-full gap-1.5 text-xs font-medium border-white/85 dark:border-white/15 bg-white/80 dark:bg-white/10 hover:bg-white shadow-xs px-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Export"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-48 rounded-2xl shadow-xl border border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: exportToCSV,
								className: "cursor-pointer gap-2 text-xs font-medium rounded-xl px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }), " Export as CSV (Excel)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: exportToPDF,
								className: "cursor-pointer gap-2 text-xs font-medium rounded-xl px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-rose-600" }), " Export as PDF Report"]
							})]
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", {
						className: "sticky top-0 z-10 border-b border-white/60 dark:border-white/10 bg-white/50 dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "w-10 px-4 py-3.5 text-left",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: allSelected,
									onCheckedChange: toggleAll,
									"aria-label": "Select all rows"
								})
							}),
							columns.map((c) => {
								const isSort = sort?.key === String(c.key);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: cn("px-4 py-3.5 text-left font-semibold", c.className),
									children: c.sortable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-1.5 hover:text-foreground transition-colors group cursor-pointer",
										onClick: () => setSort((s) => {
											const k = String(c.key);
											if (s?.key !== k) return {
												key: k,
												dir: "asc"
											};
											if (s.dir === "asc") return {
												key: k,
												dir: "desc"
											};
											return null;
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.header }), isSort ? sort?.dir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5 text-primary font-bold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-primary font-bold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 opacity-30 group-hover:opacity-75" })]
									}) : c.header
								}, String(c.key));
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "w-12 px-4 py-3.5 text-right font-medium",
								children: "Actions"
							})
						] }), showColumnFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border/60 bg-muted/20 animate-fade-in",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" }),
								columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: `Filter ${c.header}...`,
										value: columnFilters[String(c.key)] || "",
										onChange: (e) => {
											setColumnFilters({
												...columnFilters,
												[String(c.key)]: e.target.value
											});
											setPage(1);
										},
										className: "h-7.5 px-2.5 py-1 text-xs font-normal bg-card border-border/80 focus-visible:border-primary/50"
									})
								}, `filter-${String(c.key)}`)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border/60",
						children: [
							loading && Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4 rounded" })
									}),
									columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full max-w-[140px] rounded" })
									}, String(c.key))),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4 ml-auto rounded" })
									})
								]
							}, `sk-${i}`)),
							!loading && pageRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: columns.length + 2,
								className: "px-4 py-16 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mx-auto flex max-w-sm flex-col items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6 text-primary/70" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mt-3 text-sm font-bold text-foreground",
											children: emptyTitle
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted-foreground leading-relaxed",
											children: emptyDescription
										}),
										emptyAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-4",
											children: emptyAction
										})
									]
								})
							}) }),
							!loading && pageRows.map((row) => {
								const k = rowKey(row);
								const checked = selected.has(k);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: cn("transition-colors duration-150 hover:bg-muted/40", checked && "bg-primary/5 hover:bg-primary/8", onRowClick && "cursor-pointer"),
									onClick: onRowClick ? (e) => {
										if (e.target.closest("[data-row-guard]")) return;
										onRowClick(row);
									} : void 0,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5",
											"data-row-guard": true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked,
												onCheckedChange: () => toggleOne(k),
												"aria-label": "Select row"
											})
										}),
										columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: cn("px-4 py-3.5 align-middle text-foreground text-xs md:text-sm font-normal", c.className),
											children: c.render ? c.render(row) : String(row[c.key] ?? "—")
										}, String(c.key))),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3.5 text-right",
											"data-row-guard": true,
											children: rowActions && rowActions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
												align: "end",
												className: "w-48 rounded-xl shadow-lg border border-border",
												children: rowActions.filter((a) => !a.show || a.show(row)).map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [a.separatorBefore && i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => a.onClick(row),
													className: cn("cursor-pointer text-xs font-medium py-2", a.destructive && "text-destructive focus:bg-destructive/10 focus:text-destructive"),
													children: [a.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "mr-2 h-4 w-4" }), a.label]
												})] }, a.label))
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-7 w-7 text-muted-foreground opacity-50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
											})
										})
									]
								}, k);
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-start justify-between gap-3 border-t border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 px-5 py-3.5 text-xs text-muted-foreground md:flex-row md:items-center backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					"Showing ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground font-mono",
						children: [
							sorted.length === 0 ? 0 : start + 1,
							"–",
							Math.min(start + pageSize, sorted.length)
						]
					}),
					" of ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground font-mono",
						children: sorted.length
					}),
					" records"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: safePage === 1,
							onClick: () => setPage(safePage - 1),
							className: "h-8 w-8 rounded-full p-0 border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 hover:bg-white",
							title: "Previous page",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: p === safePage ? "default" : "outline",
							size: "sm",
							className: cn("h-8 w-8 rounded-full p-0 text-xs font-semibold", p === safePage ? "bg-primary text-white shadow-xs" : "border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 hover:bg-white"),
							onClick: () => setPage(p),
							children: p
						}, p)),
						totalPages > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-1 text-muted-foreground font-mono",
							children: "…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							disabled: safePage === totalPages,
							onClick: () => setPage(safePage + 1),
							className: "h-8 w-8 rounded-full p-0 border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 hover:bg-white",
							title: "Next page",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})
					]
				})]
			})
		]
	});
}
export { DataTable as t };
