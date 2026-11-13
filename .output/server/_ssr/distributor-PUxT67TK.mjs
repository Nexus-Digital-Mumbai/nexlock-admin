import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { t as DataTable } from "./DataTable-e7erQZcg.mjs";
import { n as DetailsDialog, r as useCrudUi, t as CrudModal } from "./use-crud-ui-DlRlQKZK.mjs";
import { t as StatusBadge } from "./StatusBadge-Day_GkQv.mjs";
import { m as cn, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { D as Plus, I as MapPin, M as Network, Nt as Apple, U as Layers, b as Settings2, h as Smartphone, p as Store, tt as Eye } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/distributor-PUxT67TK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createFields = [
	{
		name: "name",
		label: "Dealer Name",
		required: true,
		section: "Business"
	},
	{
		name: "contact",
		label: "Contact Person",
		required: true,
		section: "Business"
	},
	{
		name: "email",
		label: "Business Email",
		type: "email",
		required: true,
		section: "Business"
	},
	{
		name: "phone",
		label: "Business Phone",
		type: "tel",
		required: true,
		section: "Business"
	},
	{
		name: "city",
		label: "City",
		required: true,
		section: "Location"
	},
	{
		name: "state",
		label: "State Code",
		required: true,
		placeholder: "MH",
		section: "Location"
	},
	{
		name: "androidEnrollmentLimit",
		label: "Android Quota to Allocate",
		type: "number",
		required: true,
		placeholder: "0",
		section: "Quota"
	},
	{
		name: "iosEnrollmentLimit",
		label: "iOS Quota to Allocate",
		type: "number",
		required: true,
		placeholder: "0",
		section: "Quota"
	},
	{
		name: "staffEmail",
		label: "Dealer App Login Email",
		type: "email",
		required: true,
		section: "Dealer App Login"
	},
	{
		name: "staffPassword",
		label: "Dealer App Login Password",
		type: "password",
		required: true,
		section: "Dealer App Login"
	}
];
var quotaFields = [{
	name: "androidEnrollmentLimit",
	label: "Android Quota",
	type: "number",
	required: true,
	section: "Quota"
}, {
	name: "iosEnrollmentLimit",
	label: "iOS Quota",
	type: "number",
	required: true,
	section: "Quota"
}];
function DistributorPage() {
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [connectors, setConnectors] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const ui = useCrudUi();
	const fetchAll = async () => {
		setLoading(true);
		try {
			const [summaryRes, connectorsRes] = await Promise.all([apiClient.get("/distributor/summary"), apiClient.get("/distributor/connectors")]);
			if (summaryRes.success) setSummary(summaryRes.data);
			if (connectorsRes.success) setConnectors(connectorsRes.data);
		} catch (err) {
			toast.error("Failed to load distributor data", { description: err.message });
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchAll();
	}, []);
	const onCreateConnector = async (v) => {
		try {
			if ((await apiClient.post("/distributor/connectors", {
				name: v.name,
				contact: v.contact,
				email: v.email,
				phone: v.phone,
				city: v.city,
				state: v.state,
				androidEnrollmentLimit: Number(v.androidEnrollmentLimit) || 0,
				iosEnrollmentLimit: Number(v.iosEnrollmentLimit) || 0,
				staffEmail: v.staffEmail,
				staffPassword: v.staffPassword
			})).success) {
				toast.success("Connector dealer created", { description: v.name });
				ui.setCreateOpen(false);
				fetchAll();
			}
		} catch (err) {
			toast.error("Failed to create connector dealer", { description: err.message });
		}
	};
	const onAdjustQuota = async (v) => {
		if (!ui.editRow) return;
		try {
			if ((await apiClient.patch(`/distributor/connectors/${ui.editRow.id}/quota`, {
				androidEnrollmentLimit: Number(v.androidEnrollmentLimit) || 0,
				iosEnrollmentLimit: Number(v.iosEnrollmentLimit) || 0
			})).success) {
				toast.success("Quota updated", { description: ui.editRow.name });
				ui.setEditRow(null);
				fetchAll();
			}
		} catch (err) {
			toast.error("Failed to update quota", { description: err.message });
		}
	};
	const cols = [
		{
			key: "name",
			header: "Connector Dealer",
			sortable: true,
			accessor: (r) => `${r.name} (${r.contact})`,
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-foreground text-sm tracking-tight truncate",
						children: r.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.contact }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground/40",
								children: "•"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] text-primary",
								children: r.code
							})
						]
					})]
				})]
			})
		},
		{
			key: "city",
			header: "Location",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs text-foreground/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground/70 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					r.city,
					", ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold uppercase",
						children: r.state
					})
				] })]
			})
		},
		{
			key: "androidEnrollmentLimit",
			header: "Quota Allocation & Usage",
			className: "text-right",
			accessor: (r) => `Android ${r.androidUsed}/${r.androidEnrollmentLimit}, iOS ${r.iosUsed}/${r.iosEnrollmentLimit}`,
			render: (r) => {
				const androidPct = r.androidEnrollmentLimit > 0 ? Math.min(100, Math.round(r.androidUsed / r.androidEnrollmentLimit * 100)) : 0;
				const iosPct = r.iosEnrollmentLimit > 0 ? Math.min(100, Math.round(r.iosUsed / r.iosEnrollmentLimit * 100)) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 text-right text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-3 w-3 text-emerald-500" }), " Android:"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-medium text-foreground",
								children: [
									r.androidUsed,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/70",
										children: "/"
									}),
									" ",
									r.androidEnrollmentLimit
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-mono font-semibold", androidPct >= 90 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"),
								children: [androidPct, "%"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "h-3 w-3 text-sky-500" }), " iOS:"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono font-medium text-foreground",
								children: [
									r.iosUsed,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/70",
										children: "/"
									}),
									" ",
									r.iosEnrollmentLimit
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-mono font-semibold", iosPct >= 90 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"),
								children: [iosPct, "%"]
							})
						]
					})]
				});
			}
		},
		{
			key: "status",
			header: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status || "active" })
		},
		{
			key: "createdAt",
			header: "Enrolled On",
			sortable: true,
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted-foreground",
				children: new Date(r.createdAt).toISOString().slice(0, 10)
			})
		}
	];
	const actions = [{
		label: "View Details",
		icon: Eye,
		onClick: (r) => ui.setViewRow(r)
	}, {
		label: "Adjust Quota",
		icon: Settings2,
		onClick: (r) => ui.setEditRow(r)
	}];
	const androidAllocatedPct = summary && summary.android.pool > 0 ? Math.min(100, Math.round((summary.android.ownUsed + summary.android.allocatedToConnectors) / summary.android.pool * 100)) : 0;
	const iosAllocatedPct = summary && summary.ios.pool > 0 ? Math.min(100, Math.round((summary.ios.ownUsed + summary.ios.allocatedToConnectors) / summary.ios.pool * 100)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Distributor Operations Portal",
				description: summary ? `Master Quota Allocation & Connector Network • ${summary.name} (${summary.code})` : "Manage your master quota pool and sub-dealer connector network.",
				breadcrumbs: [{
					label: "Home",
					to: "/distributor"
				}, { label: "Distributor Portal" }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gap-2 shadow-sm",
					onClick: () => ui.setCreateOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Create Connector Dealer"]
				})
			}),
			summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface rounded-2xl border border-border/80 p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Android Master Pool"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold text-foreground",
									children: [
										summary.android.pool.toLocaleString(),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground",
											children: "Keys Total"
										})
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-mono font-bold text-emerald-500",
									children: [androidAllocatedPct, "% Committed"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [summary.android.remaining.toLocaleString(), " Available"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-muted/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-emerald-500 transition-all duration-500",
								style: { width: `${androidAllocatedPct}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[11px] text-muted-foreground pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Used by You: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: summary.android.ownUsed
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Allocated to Connectors: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: summary.android.allocatedToConnectors
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Connector Active: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: summary.android.usedByConnectors
								})] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface rounded-2xl border border-border/80 p-5 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "iOS Master Pool"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-base font-bold text-foreground",
									children: [
										summary.ios.pool.toLocaleString(),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-normal text-muted-foreground",
											children: "Keys Total"
										})
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs font-mono font-bold text-sky-500",
									children: [iosAllocatedPct, "% Committed"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [summary.ios.remaining.toLocaleString(), " Available"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-muted/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-sky-500 transition-all duration-500",
								style: { width: `${iosAllocatedPct}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[11px] text-muted-foreground pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Used by You: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: summary.ios.ownUsed
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Allocated to Connectors: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: summary.ios.allocatedToConnectors
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Connector Active: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground font-mono",
									children: summary.ios.usedByConnectors
								})] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Android Master Pool",
						value: summary ? summary.android.pool.toLocaleString() : "—",
						sub: summary ? `${summary.android.ownUsed} used by direct store` : void 0,
						icon: Smartphone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Android Available",
						value: summary ? summary.android.remaining.toLocaleString() : "—",
						sub: summary ? `${summary.android.allocatedToConnectors} allocated to connectors` : void 0,
						icon: Network,
						tone: summary && summary.android.remaining <= 0 ? "danger" : "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Android Connector Used",
						value: summary ? summary.android.usedByConnectors.toLocaleString() : "—",
						sub: summary ? `of ${summary.android.allocatedToConnectors.toLocaleString()} allocated` : void 0,
						icon: Store
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "iOS Master Pool",
						value: summary ? summary.ios.pool.toLocaleString() : "—",
						sub: summary ? `${summary.ios.ownUsed} used by direct store` : void 0,
						icon: Apple
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "iOS Available",
						value: summary ? summary.ios.remaining.toLocaleString() : "—",
						sub: summary ? `${summary.ios.allocatedToConnectors} allocated to connectors` : void 0,
						icon: Network,
						tone: summary && summary.ios.remaining <= 0 ? "danger" : "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "iOS Connector Used",
						value: summary ? summary.ios.usedByConnectors.toLocaleString() : "—",
						sub: summary ? `of ${summary.ios.allocatedToConnectors.toLocaleString()} allocated` : void 0,
						icon: Store
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold tracking-tight text-foreground",
								children: "Managed Connector Dealers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary",
								children: connectors.length
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					data: connectors,
					columns: cols,
					rowKey: (r) => r.id,
					loading,
					searchPlaceholder: "Search connector dealers by store name, contact, city…",
					searchKeys: [
						"name",
						"city",
						"contact",
						"code"
					],
					rowActions: actions,
					emptyTitle: "No connector dealers registered",
					emptyDescription: "Deploy your quota pool to authorized connector dealers across your distribution region.",
					emptyAction: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => ui.setCreateOpen(true),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Create Connector Dealer"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudModal, {
				open: ui.createOpen,
				onOpenChange: ui.setCreateOpen,
				title: "Register New Connector Dealer",
				description: "Allocates license quota from your master pool to an authorized partner store.",
				fields: createFields,
				onSubmit: onCreateConnector,
				submitLabel: "Create Connector Dealer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudModal, {
				open: !!ui.editRow,
				onOpenChange: (o) => !o && ui.setEditRow(null),
				title: "Adjust Connector License Quota",
				description: `Modify license allocation boundaries for ${ui.editRow?.name} (${ui.editRow?.code})`,
				fields: quotaFields,
				initial: ui.editRow ?? void 0,
				mode: "edit",
				onSubmit: onAdjustQuota,
				submitLabel: "Save Quota Allocation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailsDialog, {
				open: !!ui.viewRow,
				onOpenChange: (o) => !o && ui.setViewRow(null),
				title: ui.viewRow?.name ?? "",
				subtitle: ui.viewRow ? `Connector Code: ${ui.viewRow.code} • ${ui.viewRow.city}, ${ui.viewRow.state}` : "",
				fields: ui.viewRow ? [
					{
						label: "Contact Person",
						value: ui.viewRow.contact
					},
					{
						label: "Business Email",
						value: ui.viewRow.email
					},
					{
						label: "Phone Number",
						value: ui.viewRow.phone
					},
					{
						label: "Store Location",
						value: `${ui.viewRow.city}, ${ui.viewRow.state}`
					},
					{
						label: "Android Quota Utilization",
						value: `${ui.viewRow.androidUsed.toLocaleString()} active devices / ${ui.viewRow.androidEnrollmentLimit.toLocaleString()} allocated keys`
					},
					{
						label: "iOS Quota Utilization",
						value: `${ui.viewRow.iosUsed.toLocaleString()} active devices / ${ui.viewRow.iosEnrollmentLimit.toLocaleString()} allocated keys`
					},
					{
						label: "Connector Status",
						value: ui.viewRow.status
					}
				] : [],
				footer: ui.viewRow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => ui.setViewRow(null),
					children: "Close"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gap-1.5",
					onClick: () => {
						const r = ui.viewRow;
						ui.setViewRow(null);
						ui.setEditRow(r);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4" }), "Adjust Quota"]
				})] })
			})
		]
	});
}
export { DistributorPage as component };
