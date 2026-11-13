import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-PboPEAIL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ct as Calendar, T as RefreshCw, bt as ChartLine, d as Table2, h as Smartphone, n as X, p as Store } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as XAxis, c as CartesianGrid, d as ResponsiveContainer, f as Tooltip, i as YAxis, r as LineChart, s as Line } from "../_libs/recharts+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/analytics-Cmi_kNUo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ENROLLMENT_COLOR = "#2563EB";
var DEALERS_COLOR = "#10B981";
function localDayBoundary(dateStr, edge) {
	const [year, month, day] = dateStr.split("-").map(Number);
	return edge === "start" ? new Date(year, month - 1, day, 0, 0, 0, 0) : new Date(year, month - 1, day, 23, 59, 59, 999);
}
function formatBucketLabel(iso, granularity) {
	const d = new Date(iso);
	if (granularity === "month") return d.toLocaleDateString("en-IN", {
		month: "short",
		year: "2-digit"
	});
	if (granularity === "week") return d.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short"
	});
	return d.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short"
	});
}
function TrendChart({ title, icon: Icon, color, data, granularity, loading }) {
	const [showTable, setShowTable] = (0, import_react.useState)(false);
	const total = data.reduce((sum, p) => sum + p.count, 0);
	const chartData = data.map((p) => ({
		...p,
		label: formatBucketLabel(p.bucket, granularity)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 w-10 items-center justify-center rounded-xl border shadow-xs",
					style: {
						backgroundColor: `${color}15`,
						borderColor: `${color}30`,
						color
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-bold text-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-foreground",
						children: total.toLocaleString()
					}), " total units in timeframe"]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "h-8 gap-1.5 text-xs font-semibold border-border/80",
				onClick: () => setShowTable((s) => !s),
				children: [showTable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showTable ? "Chart View" : "Table View" })]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[280px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generating chart curves…" })]
		}) : chartData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-[280px] items-center justify-center text-xs text-muted-foreground",
			children: "No records captured for the selected time window."
		}) : showTable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[280px] overflow-y-auto rounded-lg border border-border/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 bg-muted/50 border-b border-border/80 text-muted-foreground uppercase font-bold text-[10px] tracking-wider",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2.5 px-3 text-left",
						children: "Period Bucket"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2.5 px-3 text-right",
						children: "Volume"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border/60",
					children: chartData.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-muted/20 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 px-3 text-foreground font-medium",
							children: p.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2 px-3 text-right font-bold text-foreground",
							children: p.count.toLocaleString()
						})]
					}, p.bucket))
				})]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[280px] w-full pt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
					data: chartData,
					margin: {
						top: 10,
						right: 12,
						left: -16,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							stroke: "var(--border)",
							opacity: .6,
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "label",
							tick: {
								fontSize: 11,
								fill: "var(--muted-foreground)"
							},
							axisLine: { stroke: "var(--border)" },
							tickLine: false,
							minTickGap: 20
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tick: {
								fontSize: 11,
								fill: "var(--muted-foreground)"
							},
							axisLine: false,
							tickLine: false,
							allowDecimals: false,
							width: 36
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							cursor: {
								stroke: color,
								strokeWidth: 1.5,
								strokeDasharray: "4 4"
							},
							contentStyle: {
								backgroundColor: "var(--card)",
								borderColor: "var(--border)",
								borderRadius: "0.75rem",
								boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
								fontSize: 12,
								padding: "8px 12px"
							},
							labelStyle: {
								color: "var(--muted-foreground)",
								fontWeight: 600,
								marginBottom: 4
							},
							formatter: (value) => [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								style: {
									color,
									fontWeight: 700
								},
								children: [value.toLocaleString(), " units"]
							}, "val"), title]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "count",
							stroke: color,
							strokeWidth: 2.5,
							dot: {
								r: 3.5,
								fill: color,
								strokeWidth: 2,
								stroke: "var(--card)"
							},
							activeDot: {
								r: 6,
								fill: color,
								strokeWidth: 2,
								stroke: "var(--card)"
							}
						})
					]
				})
			})
		})]
	});
}
function AnalyticsPage() {
	const [granularity, setGranularity] = (0, import_react.useState)("day");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchTrends = async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({ granularity });
			if (from) params.set("from", localDayBoundary(from, "start").toISOString());
			if (to) params.set("to", localDayBoundary(to, "end").toISOString());
			const res = await apiClient.get(`/bi/trends?${params.toString()}`);
			if (res.success) setData(res.data);
		} catch (err) {
			toast.error("Failed to load analytics", { description: err.message });
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchTrends();
	}, [
		granularity,
		from,
		to
	]);
	const totals = (0, import_react.useMemo)(() => {
		return {
			enrollment: data?.enrollment.reduce((s, p) => s + p.count, 0) ?? 0,
			dealers: data?.dealers.reduce((s, p) => s + p.count, 0) ?? 0
		};
	}, [data]);
	const clearRange = () => {
		setFrom("");
		setTo("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Fleet Analytics & Trends",
				description: "Comprehensive analysis of hardware enrollments and dealership growth over time.",
				breadcrumbs: [{
					label: "Nexus",
					to: "/"
				}, { label: "Analytics" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: granularity,
							onValueChange: (v) => setGranularity(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-[150px] h-10 rounded-full text-xs bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 font-medium shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
								className: "rounded-2xl border-white/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "day",
										className: "text-xs rounded-xl",
										children: "Day-by-Day"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "week",
										className: "text-xs rounded-xl",
										children: "Weekly Rollup"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "month",
										className: "text-xs rounded-xl",
										children: "Monthly Rollup"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-full border border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: from,
									onChange: (e) => setFrom(e.target.value),
									className: "bg-transparent text-xs text-foreground focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/50",
									children: "to"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: to,
									onChange: (e) => setTo(e.target.value),
									className: "bg-transparent text-xs text-foreground focus:outline-none"
								})
							]
						}),
						(from || to) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: clearRange,
							className: "h-8 gap-1 text-xs text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), " Clear Range"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs font-semibold text-muted-foreground",
					children: ["Showing: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: from || to ? "Custom Range" : "All Historical Data"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Device Enrollments in Window",
					value: totals.enrollment.toLocaleString(),
					sub: from || to ? "Within selected date boundaries" : "All-time accumulated volume",
					icon: Smartphone,
					tone: "primary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Dealers Onboarded in Window",
					value: totals.dealers.toLocaleString(),
					sub: from || to ? "Within selected date boundaries" : "All-time accumulated partners",
					icon: Store,
					tone: "success"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
					title: "Device Enrollment Growth",
					icon: Smartphone,
					color: ENROLLMENT_COLOR,
					data: data?.enrollment ?? [],
					granularity,
					loading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
					title: "Dealer Onboarding Rate",
					icon: Store,
					color: DEALERS_COLOR,
					data: data?.dealers ?? [],
					granularity,
					loading
				})]
			})
		]
	});
}
export { AnalyticsPage as component };
