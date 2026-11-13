import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as Network, Nt as Apple, T as RefreshCw, bt as ChartLine, d as Table2, h as Smartphone } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as XAxis, c as CartesianGrid, d as ResponsiveContainer, f as Tooltip, i as YAxis, r as LineChart, s as Line } from "../_libs/recharts+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/distributor-analytics-3t0ChqOQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ANDROID_COLOR = "#2563EB";
var IOS_COLOR = "#10B981";
function monthLabel(ym) {
	const [y, m] = ym.split("-").map(Number);
	return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
		month: "short",
		year: "2-digit"
	});
}
function TrendChart({ title, icon: Icon, color, data, loading }) {
	const [showTable, setShowTable] = (0, import_react.useState)(false);
	const total = data.reduce((sum, p) => sum + p.count, 0);
	const chartData = data.map((p) => ({
		...p,
		label: monthLabel(p.month)
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
					}), " units enrolled (last 6 months)"]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "h-8 gap-1.5 text-xs font-semibold border-border/80",
				onClick: () => setShowTable((s) => !s),
				children: [showTable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showTable ? "Chart View" : "Table View" })]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[240px] flex-col items-center justify-center gap-2 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generating trend visualization…" })]
		}) : chartData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-[240px] items-center justify-center text-xs text-muted-foreground",
			children: "No hardware enrollments logged in this window."
		}) : showTable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-[240px] overflow-y-auto rounded-lg border border-border/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 bg-muted/50 border-b border-border/80 text-muted-foreground uppercase font-bold text-[10px] tracking-wider",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2.5 px-3 text-left",
						children: "Month"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2.5 px-3 text-right",
						children: "Units Enrolled"
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
					}, p.month))
				})]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[240px] w-full pt-2",
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
							tickLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tick: {
								fontSize: 11,
								fill: "var(--muted-foreground)"
							},
							axisLine: false,
							tickLine: false,
							allowDecimals: false,
							width: 32
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
function DistributorAnalyticsPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await apiClient.get("/distributor/analytics");
				if (res.success) setData(res.data);
			} catch (err) {
				toast.error("Failed to load analytics", { description: err.message });
			} finally {
				setLoading(false);
			}
		})();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Distributor Fleet Analytics",
				description: "Enrollment velocity and platform breakdown across all your retail connector stores.",
				breadcrumbs: [{
					label: "Portal",
					to: "/distributor"
				}, { label: "Analytics" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Connector Dealers",
						value: data ? data.totalConnectors.toLocaleString() : loading ? "—" : "0",
						sub: "Subordinate shops",
						icon: Network,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Android Enrollments",
						value: data ? data.android.totalEnrolled.toLocaleString() : loading ? "—" : "0",
						sub: "6-month total",
						icon: Smartphone,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "iOS Enrollments",
						value: data ? data.ios.totalEnrolled.toLocaleString() : loading ? "—" : "0",
						sub: "6-month total",
						icon: Apple,
						tone: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
					title: "Android Enrollments",
					icon: Smartphone,
					color: ANDROID_COLOR,
					data: data?.android.trend ?? [],
					loading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendChart, {
					title: "iOS Enrollments",
					icon: Apple,
					color: IOS_COLOR,
					data: data?.ios.trend ?? [],
					loading
				})]
			})
		]
	});
}
export { DistributorAnalyticsPage as component };
