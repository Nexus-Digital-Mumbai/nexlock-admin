import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { t as DataTable } from "./DataTable-e7erQZcg.mjs";
import { c as AvatarFallback, l as Input, p as apiClient, s as Avatar, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Pencil, S as Search, St as Camera, n as X, o as Users, p as Store, tt as Eye } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/customers-DNzV88wN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initials = (s) => s.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
function CustomersPage() {
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [pagination, setPagination] = (0, import_react.useState)({
		page: 1,
		limit: 10,
		total: 0,
		pages: 1
	});
	const [viewOpen, setViewOpen] = (0, import_react.useState)(false);
	const [viewCustomer, setViewCustomer] = (0, import_react.useState)(null);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [editCustomer, setEditCustomer] = (0, import_react.useState)(null);
	const [editForm, setEditForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const fetchCustomers = async (page = 1) => {
		setLoading(true);
		try {
			const query = new URLSearchParams({
				page: String(page),
				limit: "10",
				...search ? { search } : {}
			}).toString();
			const res = await apiClient.get(`/customers?${query}`);
			if (res.success) {
				setCustomers(res.data);
				if (res.meta?.pagination) {
					const pg = res.meta.pagination;
					setPagination({
						page: pg.page,
						limit: pg.limit,
						total: pg.total,
						pages: pg.pages
					});
				}
			}
		} catch (err) {
			toast.error("Failed to load customers", { description: err.message });
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchCustomers(1);
	}, [search]);
	const openViewDialog = (row) => {
		setViewCustomer(row);
		setViewOpen(true);
	};
	const openEditDialog = (row) => {
		setEditCustomer(row);
		setEditForm({
			name: row.name,
			phone: row.phone,
			email: row.email || ""
		});
		setEditOpen(true);
	};
	const saveEdit = async () => {
		if (!editCustomer) return;
		if (!editForm.name.trim()) {
			toast.error("Name cannot be empty");
			return;
		}
		setSaving(true);
		try {
			if ((await apiClient.put(`/customers/${editCustomer.id}`, {
				name: editForm.name.trim(),
				phone: editForm.phone.trim(),
				email: editForm.email.trim()
			})).success) {
				toast.success("Customer record updated");
				setEditOpen(false);
				fetchCustomers(pagination.page);
			}
		} catch (err) {
			toast.error("Failed to update customer", { description: err.message });
		} finally {
			setSaving(false);
		}
	};
	const cols = [
		{
			key: "customerCode",
			header: "Customer ID",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20",
				children: r.customerCode
			})
		},
		{
			key: "name",
			header: "Customer Name",
			sortable: true,
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					className: "h-9 w-9 border border-border/80 shadow-xs",
					children: r.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: r.photoUrl,
						alt: r.name,
						className: "object-cover w-full h-full"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
						className: "bg-primary/10 text-primary text-xs font-bold",
						children: initials(r.name)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold text-foreground text-xs md:text-sm",
						children: r.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: r.phone
					})]
				})]
			})
		},
		{
			key: "email",
			header: "Email Address",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground font-medium",
				children: r.email || "—"
			})
		},
		{
			key: "dealer",
			header: "Enrolled By Dealer",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-xs font-medium text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-3.5 w-3.5 text-muted-foreground/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.dealer?.name || "Independent" })]
			})
		}
	];
	const actions = [{
		label: "View KYC Details",
		icon: Eye,
		onClick: openViewDialog
	}, {
		label: "Edit Record",
		icon: Pencil,
		onClick: openEditDialog
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Consumer Directory",
				description: "Financed hardware consumers registered across dealerships with verified identity records.",
				breadcrumbs: [{
					label: "Nexus",
					to: "/"
				}, { label: "Customers" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Registered Consumers",
					value: pagination.total.toLocaleString(),
					sub: "Verified accounts",
					icon: Users,
					tone: "primary"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col sm:flex-row gap-3 items-center justify-between rounded-3xl border border-white/80 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-4 shadow-sm backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by customer name, phone, code…",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "h-10 pl-11 pr-8 text-xs md:text-sm rounded-full bg-white/80 dark:bg-white/10 border-white/90 dark:border-white/15 focus-visible:bg-white shadow-xs"
						}),
						search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch(""),
							className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-black/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: customers,
				columns: cols,
				rowKey: (r) => r.id,
				loading,
				rowActions: actions,
				hideSearch: true,
				emptyTitle: "No customers registered yet",
				emptyDescription: "Customer records will appear here as soon as they are registered during device financing at dealer shops."
			}),
			pagination.pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-center gap-3 bg-card px-5 py-3 rounded-xl border border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground font-medium",
					children: [
						"Page ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-foreground",
							children: pagination.page
						}),
						" of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-foreground",
							children: pagination.pages
						}),
						" (",
						pagination.total,
						" total customers)"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: pagination.page <= 1,
						onClick: () => fetchCustomers(pagination.page - 1),
						className: "h-8 text-xs font-semibold border-border/80",
						children: "Previous"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: pagination.page >= pagination.pages,
						onClick: () => fetchCustomers(pagination.page + 1),
						className: "h-8 text-xs font-semibold border-border/80",
						children: "Next"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: viewOpen,
				onOpenChange: setViewOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border/80 p-0 rounded-2xl shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-base font-bold text-foreground",
								children: ["Consumer Record — ", viewCustomer?.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Verified identity credentials and emergency reference contacts."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-6 space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col md:flex-row gap-6 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2.5 mx-auto md:mx-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-36 h-36 rounded-2xl overflow-hidden border border-border/80 bg-muted/20 shadow-inner ring-2 ring-primary/20",
										children: viewCustomer?.photoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: viewCustomer.photoUrl,
											alt: "KYC",
											className: "w-full h-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "w-full h-full flex flex-col items-center justify-center text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-8 w-8 text-muted-foreground/60 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px]",
												children: "No Photo"
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold tracking-wider text-muted-foreground uppercase",
										children: "KYC Photo Verification"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Customer ID"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-sm font-bold font-mono text-primary",
												children: viewCustomer?.customerCode
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Enrolled At Dealer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs font-semibold text-foreground",
												children: viewCustomer?.dealer?.name || "Independent Store"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Mobile Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs font-semibold text-foreground font-mono",
												children: viewCustomer?.phone
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Email Address"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs font-semibold text-foreground truncate",
												children: viewCustomer?.email || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "Aadhaar ID"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs font-bold font-mono text-foreground",
												children: viewCustomer?.aadhaarNumber || "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border/60 bg-muted/20 p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
												children: "PAN Number"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs font-bold font-mono text-foreground",
												children: viewCustomer?.panNumber || "—"
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border/80 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2.5",
									children: "Primary Reference Contact"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 bg-muted/20 border border-border/60 rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-bold text-foreground",
										children: viewCustomer?.referenceName1 || "None Provided"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-1 flex items-center gap-3",
										children: [viewCustomer?.referencePhone1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: viewCustomer.referencePhone1
										}), viewCustomer?.referenceRelation1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground",
											children: ["Relation: ", viewCustomer.referenceRelation1]
										})]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "border-t border-border/80 px-6 py-3.5 bg-muted/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setViewOpen(false),
								className: "text-xs font-semibold",
								children: "Close Details"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md bg-card text-card-foreground border border-border/80 p-0 rounded-2xl shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-base font-bold text-foreground",
								children: ["Edit Consumer — ", editCustomer?.customerCode]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Update name and contact coordinates on file."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-6 py-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-name",
										className: "text-xs font-semibold text-foreground",
										children: "Full Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-name",
										value: editForm.name,
										onChange: (e) => setEditForm((f) => ({
											...f,
											name: e.target.value
										})),
										className: "h-9 text-xs bg-muted/20 border-border/80"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-phone",
										className: "text-xs font-semibold text-foreground",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-phone",
										value: editForm.phone,
										onChange: (e) => setEditForm((f) => ({
											...f,
											phone: e.target.value
										})),
										className: "h-9 text-xs bg-muted/20 border-border/80"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit-email",
										className: "text-xs font-semibold text-foreground",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit-email",
										value: editForm.email,
										onChange: (e) => setEditForm((f) => ({
											...f,
											email: e.target.value
										})),
										className: "h-9 text-xs bg-muted/20 border-border/80"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "border-t border-border/80 px-6 py-3.5 bg-muted/20 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditOpen(false),
								disabled: saving,
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: saveEdit,
								disabled: saving,
								className: "text-xs font-semibold",
								children: saving ? "Saving…" : "Save Record"
							})]
						})
					]
				})
			})
		]
	});
}
export { CustomersPage as component };
