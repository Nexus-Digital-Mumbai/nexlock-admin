import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { t as DataTable } from "./DataTable-e7erQZcg.mjs";
import { p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ct as Calendar, Nt as Apple, T as RefreshCw, a as Wallet, h as Smartphone, p as Store } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/distributor-billing-CVeSymno.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fmtInr = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
function localDayBoundary(dateStr, edge) {
	const [year, month, day] = dateStr.split("-").map(Number);
	return edge === "start" ? new Date(year, month - 1, day, 0, 0, 0, 0) : new Date(year, month - 1, day, 23, 59, 59, 999);
}
function toDateInputValue(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
var presets = [
	{
		label: "This Month",
		range: () => {
			const now = /* @__PURE__ */ new Date();
			return {
				from: new Date(now.getFullYear(), now.getMonth(), 1),
				to: now
			};
		}
	},
	{
		label: "Last Month",
		range: () => {
			const now = /* @__PURE__ */ new Date();
			return {
				from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
				to: new Date(now.getFullYear(), now.getMonth(), 0)
			};
		}
	},
	{
		label: "Last 30 Days",
		range: () => {
			const now = /* @__PURE__ */ new Date();
			return {
				from: /* @__PURE__ */ new Date(now.getTime() - 25056e5),
				to: now
			};
		}
	}
];
function DistributorBillingPage() {
	const thisMonth = presets[0].range();
	const [from, setFrom] = (0, import_react.useState)(toDateInputValue(thisMonth.from));
	const [to, setTo] = (0, import_react.useState)(toDateInputValue(thisMonth.to));
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchBilling = (0, import_react.useCallback)(async (fromStr, toStr) => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				from: localDayBoundary(fromStr, "start").toISOString(),
				to: localDayBoundary(toStr, "end").toISOString()
			});
			const res = await apiClient.get(`/distributor/billing?${params.toString()}`);
			if (res.success) setData(res.data);
		} catch (err) {
			toast.error("Failed to load billing data", { description: err.message });
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchBilling(from, to);
	}, []);
	const applyPreset = (range) => {
		const f = toDateInputValue(range.from);
		const t = toDateInputValue(range.to);
		setFrom(f);
		setTo(t);
		fetchBilling(f, t);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Distributor Settlement & Billing",
				description: "Calculate connector dealer enrollment consumption and invoice charges over billing cycles.",
				breadcrumbs: [{
					label: "Portal",
					to: "/distributor"
				}, { label: "Billing" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-full border border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: from,
									max: to,
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
									min: from,
									onChange: (e) => setTo(e.target.value),
									className: "bg-transparent text-xs text-foreground focus:outline-none"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => fetchBilling(from, to),
							disabled: loading,
							className: "h-8.5 text-xs font-semibold shadow-xs",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3 animate-spin mr-1.5" }), "Calculate Invoice"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden h-5 w-px bg-border/80 sm:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: presets.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8 text-xs font-medium border-border/80 hover:bg-muted",
								onClick: () => applyPreset(p.range()),
								children: p.label
							}, p.label))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Android Devices Billed",
						value: data ? data.totals.androidUsed.toLocaleString() : loading ? "—" : "0",
						sub: data ? `@ ${fmtInr(data.rates.android)} per unit fee` : void 0,
						icon: Smartphone,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "iOS Devices Billed",
						value: data ? data.totals.iosUsed.toLocaleString() : loading ? "—" : "0",
						sub: data ? `@ ${fmtInr(data.rates.ios)} per unit fee` : void 0,
						icon: Apple,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Gross Invoice Total",
						value: data ? fmtInr(data.totals.amount) : loading ? "—" : fmtInr(0),
						sub: "All connector charges combined",
						icon: Wallet,
						tone: "primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: data?.connectors ?? [],
				columns: [
					{
						key: "name",
						header: "Connector Dealer",
						sortable: true,
						accessor: (r) => `${r.name} (${r.code}, ${r.city}, ${r.state})`,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground text-xs md:text-sm",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									r.code,
									" • ",
									r.city,
									", ",
									r.state
								]
							})] })]
						})
					},
					{
						key: "androidUsed",
						header: "Android Units",
						className: "text-right",
						sortable: true,
						accessor: (r) => `${r.androidUsed} devices (${fmtInr(r.androidAmount)})`,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-xs space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-foreground",
								children: [r.androidUsed.toLocaleString(), " devices"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground font-mono",
								children: fmtInr(r.androidAmount)
							})]
						})
					},
					{
						key: "iosUsed",
						header: "iOS Units",
						className: "text-right",
						sortable: true,
						accessor: (r) => `${r.iosUsed} devices (${fmtInr(r.iosAmount)})`,
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-xs space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-bold text-foreground",
								children: [r.iosUsed.toLocaleString(), " devices"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground font-mono",
								children: fmtInr(r.iosAmount)
							})]
						})
					},
					{
						key: "amount",
						header: "Invoice Subtotal",
						className: "text-right",
						sortable: true,
						accessor: (r) => fmtInr(r.amount),
						render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-bold text-foreground text-xs md:text-sm bg-muted/40 px-2 py-1 rounded-md border border-border/80",
							children: fmtInr(r.amount)
						})
					}
				],
				rowKey: (r) => r.id,
				loading,
				searchPlaceholder: "Search connector dealers by name, code or city…",
				searchKeys: [
					"name",
					"code",
					"city"
				],
				emptyTitle: "No usage in this billing period",
				emptyDescription: "No connector store enrolled a financed device within the specified calendar interval."
			})
		]
	});
}
export { DistributorBillingPage as component };
