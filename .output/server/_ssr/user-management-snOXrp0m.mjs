import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { t as DataTable } from "./DataTable-e7erQZcg.mjs";
import { t as StatusBadge } from "./StatusBadge-Day_GkQv.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-J3iS7xoS.mjs";
import { c as AvatarFallback, h as session, l as Input, m as cn, p as apiClient, s as Avatar, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-PboPEAIL.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Pencil, At as Ban, D as Plus, Ft as Activity, G as KeyRound, O as Play, R as LogOut, T as RefreshCw, _ as Shield, o as Users, tt as Eye, u as Trash2, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/user-management-snOXrp0m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var initials = (s) => s.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
var fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", {
	dateStyle: "medium",
	timeStyle: "short"
}) : "—";
function FormField({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-semibold text-foreground/90",
			children: label
		}), children]
	});
}
function UsersPage() {
	const currentUser = session.getUser();
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [dealers, setDealers] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editUser, setEditUser] = (0, import_react.useState)(null);
	const [viewUser, setViewUser] = (0, import_react.useState)(null);
	const [deleteUser, setDeleteUser] = (0, import_react.useState)(null);
	const [resetUser, setResetUser] = (0, import_react.useState)(null);
	const [forceLogoutUser, setForceLogoutUser] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		password: "",
		roleId: "",
		dealerId: "",
		status: "active"
	});
	const [resetPwd, setResetPwd] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({ limit: "50" });
			if (search) params.append("search", search);
			if (statusFilter !== "all") params.append("status", statusFilter);
			if (roleFilter !== "all") params.append("roleId", roleFilter);
			const res = await apiClient.get(`/users?${params}`);
			setItems(res.data.items);
			setTotal(res.data.total);
		} catch {
			toast.error("Failed to load users");
		} finally {
			setLoading(false);
		}
	}, [
		search,
		statusFilter,
		roleFilter
	]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		apiClient.get("/roles?limit=100").then((r) => setRoles(r.data.items.map((x) => ({
			id: x.id,
			name: x.name
		})))).catch(() => {});
		apiClient.get("/dealers?limit=100").then((r) => setDealers(r.data.map((x) => ({
			id: x.id,
			name: x.name
		})))).catch(() => {});
	}, []);
	const openView = async (u) => {
		try {
			const res = await apiClient.get(`/users/${u.id}`);
			setViewUser(res.data);
		} catch {
			toast.error("Failed to load user details");
		}
	};
	const openEdit = (u) => {
		setForm({
			name: u.name,
			email: u.email,
			password: "",
			roleId: u.roleId,
			dealerId: u.dealerId || "",
			status: u.status
		});
		setEditUser(u);
	};
	const handleCreate = async () => {
		if (!form.name || !form.email || !form.password || !form.roleId) {
			toast.error("Name, email, password, and role are required");
			return;
		}
		setSaving(true);
		try {
			await apiClient.post("/users", {
				...form,
				dealerId: form.dealerId || null
			});
			toast.success("User created", { description: `${form.name} can now log in.` });
			setCreateOpen(false);
			setForm({
				name: "",
				email: "",
				password: "",
				roleId: "",
				dealerId: "",
				status: "active"
			});
			load();
		} catch (e) {
			toast.error(e.message || "Failed to create user");
		} finally {
			setSaving(false);
		}
	};
	const handleEdit = async () => {
		if (!editUser) return;
		setSaving(true);
		try {
			const payload = {
				name: form.name,
				email: form.email,
				roleId: form.roleId,
				status: form.status,
				dealerId: form.dealerId || null
			};
			await apiClient.put(`/users/${editUser.id}`, payload);
			toast.success("User updated");
			setEditUser(null);
			load();
		} catch (e) {
			toast.error(e.message || "Failed to update user");
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async () => {
		if (!deleteUser) return;
		try {
			await apiClient.delete(`/users/${deleteUser.id}`);
			toast.success("User deleted");
			setDeleteUser(null);
			load();
		} catch (e) {
			toast.error(e.message || "Failed to delete user");
		}
	};
	const handleResetPassword = async () => {
		if (!resetUser || !resetPwd) return;
		setSaving(true);
		try {
			await apiClient.post(`/users/${resetUser.id}/reset-password`, { password: resetPwd });
			toast.success("Password reset", { description: `${resetUser.name}'s password has been updated.` });
			setResetUser(null);
			setResetPwd("");
		} catch (e) {
			toast.error(e.message || "Failed to reset password");
		} finally {
			setSaving(false);
		}
	};
	const handleForceLogout = async () => {
		if (!forceLogoutUser) return;
		try {
			await apiClient.post(`/users/${forceLogoutUser.id}/force-logout`);
			toast.success("Sessions revoked", { description: `${forceLogoutUser.name} has been logged out everywhere.` });
			setForceLogoutUser(null);
			load();
		} catch (e) {
			toast.error(e.message || "Failed to force logout");
		}
	};
	const quickStatus = async (u, status) => {
		try {
			await apiClient.put(`/users/${u.id}`, { status });
			toast.success(status === "active" ? "User enabled" : "User disabled");
			load();
		} catch (e) {
			toast.error(e.message || "Failed to update status");
		}
	};
	const cols = [
		{
			key: "name",
			header: "Administrator",
			sortable: true,
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					className: "h-9 w-9 border border-border/80 ring-2 ring-primary/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
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
						children: r.email
					})]
				})]
			})
		},
		{
			key: "role",
			header: "Role Definition",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3 text-primary" }), r.role]
			})
		},
		{
			key: "dealerName",
			header: "Assigned Dealership",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium text-foreground",
				children: r.dealerName || "Global (All Stores)"
			})
		},
		{
			key: "status",
			header: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
		},
		{
			key: "lastActiveAt",
			header: "Last Activity",
			sortable: true,
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium text-muted-foreground",
				children: r.lastActiveAt ? fmtDate(r.lastActiveAt) : "Never Logged In"
			})
		}
	];
	const actions = [
		{
			label: "View User Details",
			icon: Eye,
			onClick: openView
		},
		{
			label: "Edit Account",
			icon: Pencil,
			onClick: openEdit
		},
		{
			label: "Reset Password",
			icon: KeyRound,
			onClick: (r) => {
				setResetPwd("");
				setResetUser(r);
			}
		},
		{
			label: "Force Logout",
			icon: LogOut,
			onClick: (r) => setForceLogoutUser(r)
		},
		{
			label: "Disable Account",
			icon: Ban,
			onClick: (r) => quickStatus(r, "disabled"),
			show: (r) => r.status === "active"
		},
		{
			label: "Enable Account",
			icon: Play,
			onClick: (r) => quickStatus(r, "active"),
			show: (r) => r.status !== "active"
		},
		{
			label: "Delete User",
			icon: Trash2,
			onClick: (r) => setDeleteUser(r),
			destructive: true,
			separatorBefore: true,
			show: (r) => r.id !== currentUser?.userId
		}
	];
	const active = items.filter((u) => u.status === "active").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "User Management",
				description: "Oversee administrative accounts, role assignments, and active workstation sessions.",
				breadcrumbs: [{
					label: "Nexus",
					to: "/"
				}, { label: "User Management" }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "h-9 gap-1.5 text-xs font-semibold shadow-xs",
					onClick: () => {
						setForm({
							name: "",
							email: "",
							password: "",
							roleId: "",
							dealerId: "",
							status: "active"
						});
						setCreateOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Admin User"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Total Admin Users",
						value: total.toString(),
						sub: "Platform operators",
						icon: Users,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Active Accounts",
						value: active.toString(),
						sub: "Authorized sign-ins",
						icon: Play,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Defined Roles",
						value: roles.length.toString(),
						sub: "Access tier catalog",
						icon: KeyRound,
						tone: "primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by name, email, or role…",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "h-9 w-full sm:w-64 text-xs bg-muted/30 border-border/70"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-36 text-xs bg-muted/30 border-border/70",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							className: "rounded-xl border-border shadow-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									className: "text-xs",
									children: "All Statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "active",
									className: "text-xs",
									children: "Active Only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "disabled",
									className: "text-xs",
									children: "Disabled"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "pending",
									className: "text-xs",
									children: "Pending"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: roleFilter,
						onValueChange: setRoleFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-44 text-xs bg-muted/30 border-border/70",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
							className: "rounded-xl border-border shadow-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								className: "text-xs font-semibold",
								children: "All Roles"
							}), roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: r.id,
								className: "text-xs",
								children: r.name
							}, r.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: load,
						className: "h-9 gap-1.5 text-xs font-medium border-border/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Refresh"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: items,
				columns: cols,
				rowKey: (r) => r.id,
				loading,
				searchPlaceholder: "Search administrators…",
				searchKeys: [
					"name",
					"email",
					"role"
				],
				rowActions: actions,
				emptyTitle: "No administrator accounts found",
				emptyDescription: "Add your first administrator to grant console permissions."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold text-foreground",
								children: "Add New Administrator"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Provision a new staff account with granular role permissions."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 overflow-y-auto px-6 py-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Full Name *",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.name,
											onChange: (e) => setForm((f) => ({
												...f,
												name: e.target.value
											})),
											placeholder: "Rohan Agarwal",
											className: "h-9 text-xs bg-muted/20 border-border/80"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Email Address *",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											value: form.email,
											onChange: (e) => setForm((f) => ({
												...f,
												email: e.target.value
											})),
											placeholder: "rohan@nexus.io",
											className: "h-9 text-xs bg-muted/20 border-border/80"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Initial Password *",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										value: form.password,
										onChange: (e) => setForm((f) => ({
											...f,
											password: e.target.value
										})),
										placeholder: "Min 6 characters",
										className: "h-9 text-xs bg-muted/20 border-border/80"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Role *",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.roleId,
											onValueChange: (v) => setForm((f) => ({
												...f,
												roleId: v
											})),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs bg-muted/20 border-border/80",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select role" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "rounded-xl border-border shadow-xl",
												children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: r.id,
													className: "text-xs",
													children: r.name
												}, r.id))
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Status",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.status,
											onValueChange: (v) => setForm((f) => ({
												...f,
												status: v
											})),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-9 text-xs bg-muted/20 border-border/80",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
												className: "rounded-xl border-border shadow-xl",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "active",
														className: "text-xs",
														children: "Active"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "pending",
														className: "text-xs",
														children: "Pending"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "disabled",
														className: "text-xs",
														children: "Disabled"
													})
												]
											})]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Restrict to Dealer Store (Optional)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.dealerId || "none",
										onValueChange: (v) => setForm((f) => ({
											...f,
											dealerId: v === "none" ? "" : v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs bg-muted/20 border-border/80",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "No dealer restriction (Global)" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
											className: "rounded-xl border-border shadow-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "none",
												className: "text-xs font-semibold",
												children: "No dealer restriction (Global Access)"
											}), dealers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: d.id,
												className: "text-xs",
												children: d.name
											}, d.id))]
										})]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "border-t border-border/80 px-6 py-3.5 bg-muted/20 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setCreateOpen(false),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleCreate,
								disabled: saving,
								className: "text-xs font-semibold shadow-xs",
								children: saving ? "Creating…" : "Create User"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editUser,
				onOpenChange: (o) => !o && setEditUser(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold text-foreground",
								children: "Edit User Profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: editUser?.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 overflow-y-auto px-6 py-5 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Full Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.name,
										onChange: (e) => setForm((f) => ({
											...f,
											name: e.target.value
										})),
										className: "h-9 text-xs bg-muted/20 border-border/80"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Email Address",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										value: form.email,
										onChange: (e) => setForm((f) => ({
											...f,
											email: e.target.value
										})),
										className: "h-9 text-xs bg-muted/20 border-border/80"
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Role Assignment",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.roleId,
										onValueChange: (v) => setForm((f) => ({
											...f,
											roleId: v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs bg-muted/20 border-border/80",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select role" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "rounded-xl border-border shadow-xl",
											children: roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: r.id,
												className: "text-xs",
												children: r.name
											}, r.id))
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.status,
										onValueChange: (v) => setForm((f) => ({
											...f,
											status: v
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-xs bg-muted/20 border-border/80",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
											className: "rounded-xl border-border shadow-xl",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "active",
													className: "text-xs",
													children: "Active"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "pending",
													className: "text-xs",
													children: "Pending"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "disabled",
													className: "text-xs",
													children: "Disabled"
												})
											]
										})]
									})
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "border-t border-border/80 px-6 py-3.5 bg-muted/20 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditUser(null),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleEdit,
								disabled: saving,
								className: "text-xs font-semibold shadow-xs",
								children: saving ? "Saving…" : "Save Changes"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewUser,
				onOpenChange: (o) => !o && setViewUser(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
						className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								className: "h-10 w-10 ring-2 ring-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "bg-primary/10 text-primary font-bold",
									children: viewUser ? initials(viewUser.name) : ""
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold text-foreground",
								children: viewUser?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: viewUser?.email
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-6 py-5 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-muted/20 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
											children: "Assigned Role"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-xs font-semibold text-foreground",
											children: viewUser?.role
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-muted/20 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
											children: "Account Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: viewUser?.status || "" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-muted/20 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
											children: "Active Sessions"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-xs font-bold text-foreground font-mono",
											children: viewUser?.sessions?.filter((s) => !s.isRevoked).length ?? 0
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5" }),
									" Active Workstation Sessions (",
									viewUser?.sessions?.filter((s) => !s.isRevoked).length ?? 0,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [viewUser?.sessions?.filter((s) => !s.isRevoked).slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/60 bg-muted/20 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground truncate",
										children: s.userAgent
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground mt-1 flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: s.ipAddress
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Started: ", fmtDate(s.createdAt)] })
										]
									})]
								}, s.id)), !viewUser?.sessions?.filter((s) => !s.isRevoked).length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground/70 italic p-3 text-center border border-dashed border-border rounded-xl",
									children: "No active sessions currently open."
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Recent Sign-In Attempts"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [viewUser?.loginHistories?.slice(0, 5).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-semibold text-foreground",
										children: h.ipAddress
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: fmtDate(h.createdAt)
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: h.status === "success" ? "default" : "destructive",
										className: "text-[10px] font-bold",
										children: h.status
									})]
								}, h.id)), !viewUser?.loginHistories?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground/70 italic p-3 text-center border border-dashed border-border rounded-xl",
									children: "No previous sign-in records."
								})]
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!resetUser,
				onOpenChange: (o) => !o && setResetUser(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm rounded-2xl border-border/80 shadow-2xl p-6 bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold text-foreground",
							children: "Reset Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: [
								"Define a new password for ",
								resetUser?.name,
								". All existing active sessions will be terminated immediately."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-foreground",
								children: "New Access Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "password",
								placeholder: "Min 6 characters",
								value: resetPwd,
								onChange: (e) => setResetPwd(e.target.value),
								className: "h-9 text-xs bg-muted/20 border-border/80",
								autoFocus: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setResetUser(null),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleResetPassword,
								disabled: saving || !resetPwd,
								className: "text-xs font-semibold",
								children: saving ? "Resetting…" : "Confirm Password Reset"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!forceLogoutUser,
				onOpenChange: (o) => !o && setForceLogoutUser(null),
				title: "Force Session Termination?",
				description: `${forceLogoutUser?.name} will be immediately signed out across all workstations and browser sessions.`,
				onConfirm: handleForceLogout,
				confirmLabel: "Revoke All Sessions",
				destructive: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!deleteUser,
				onOpenChange: (o) => !o && setDeleteUser(null),
				title: "Revoke Administrator Account?",
				description: `The account for "${deleteUser?.name}" will be deleted. Access tokens will be revoked immediately.`,
				onConfirm: handleDelete,
				confirmLabel: "Delete User",
				destructive: true
			})
		]
	});
}
export { UsersPage as component };
