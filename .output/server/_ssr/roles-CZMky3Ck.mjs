import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { t as KpiCard } from "./KpiCard-DtUTTMnO.mjs";
import { t as DataTable } from "./DataTable-e7erQZcg.mjs";
import { t as ConfirmDialog } from "./ConfirmDialog-J3iS7xoS.mjs";
import { l as Input, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { t as Textarea } from "./textarea-Diw4dwM4.mjs";
import { t as Checkbox } from "./checkbox-DMTtsYgG.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as Pencil, D as Plus, G as KeyRound, T as RefreshCw, _ as Shield, st as Copy, tt as Eye, u as Trash2, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/roles-CZMky3Ck.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FormField({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs font-semibold text-foreground/90",
			children: label
		}), children]
	});
}
function RolesPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [permCatalog, setPermCatalog] = (0, import_react.useState)([]);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editRole, setEditRole] = (0, import_react.useState)(null);
	const [viewRole, setViewRole] = (0, import_react.useState)(null);
	const [permRole, setPermRole] = (0, import_react.useState)(null);
	const [deleteRole, setDeleteRole] = (0, import_react.useState)(null);
	const [selectedPerms, setSelectedPerms] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		description: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const allPerms = permCatalog.flatMap((g) => g.items.map((i) => i.key));
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const res = await apiClient.get("/roles?limit=100");
			setItems(res.data.items);
			setTotal(res.data.total);
		} catch {
			toast.error("Failed to load roles");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	(0, import_react.useEffect)(() => {
		apiClient.get("/roles/permissions").then((r) => setPermCatalog(r.data)).catch(() => {});
	}, []);
	const openPerms = (role) => {
		setPermRole(role);
		setSelectedPerms([...role.permissions]);
	};
	const savePerms = async () => {
		if (!permRole) return;
		setSaving(true);
		try {
			await apiClient.put(`/roles/${permRole.id}`, { permissions: selectedPerms });
			toast.success("Permissions updated", { description: permRole.name });
			setPermRole(null);
			load();
		} catch (e) {
			toast.error(e.message || "Failed to update permissions");
		} finally {
			setSaving(false);
		}
	};
	const handleCreate = async () => {
		if (!form.name) {
			toast.error("Role name is required");
			return;
		}
		setSaving(true);
		try {
			await apiClient.post("/roles", form);
			toast.success("Role created successfully");
			setCreateOpen(false);
			setForm({
				name: "",
				description: ""
			});
			load();
		} catch (e) {
			toast.error(e.message || "Failed to create role");
		} finally {
			setSaving(false);
		}
	};
	const handleEdit = async () => {
		if (!editRole) return;
		setSaving(true);
		try {
			await apiClient.put(`/roles/${editRole.id}`, form);
			toast.success("Role updated");
			setEditRole(null);
			load();
		} catch (e) {
			toast.error(e.message || "Failed to update role");
		} finally {
			setSaving(false);
		}
	};
	const handleClone = async (role) => {
		try {
			await apiClient.post(`/roles/${role.id}/clone`);
			toast.success("Role duplicated", { description: `${role.name} (Copy) created.` });
			load();
		} catch (e) {
			toast.error(e.message || "Failed to clone role");
		}
	};
	const handleDelete = async () => {
		if (!deleteRole) return;
		try {
			await apiClient.delete(`/roles/${deleteRole.id}`);
			toast.success("Role deleted");
			setDeleteRole(null);
			load();
		} catch (e) {
			toast.error(e.message || "Failed to delete role");
		}
	};
	const togglePerm = (key, checked) => {
		setSelectedPerms((prev) => checked ? [...prev, key] : prev.filter((x) => x !== key));
	};
	const toggleGroup = (group, checked) => {
		const keys = group.items.map((i) => i.key);
		setSelectedPerms((prev) => checked ? [.../* @__PURE__ */ new Set([...prev, ...keys])] : prev.filter((k) => !keys.includes(k)));
	};
	const cols = [
		{
			key: "name",
			header: "Access Role",
			sortable: true,
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${r.isSystem ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/40 text-muted-foreground border-border/80"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground text-xs md:text-sm",
							children: r.name
						}), r.isSystem && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary",
							children: "System Role"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground truncate max-w-sm mt-0.5",
						children: r.description || "No description specified"
					})]
				})]
			})
		},
		{
			key: "userCount",
			header: "Assigned Users",
			sortable: true,
			className: "text-right",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-foreground",
				children: [r.userCount, " users"]
			})
		},
		{
			key: "permissions",
			header: "Granted Permissions",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 w-16 rounded-full bg-muted overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary rounded-full transition-all",
						style: { width: `${allPerms.length ? r.permissions.length / allPerms.length * 100 : 0}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold text-muted-foreground font-mono",
					children: [
						r.permissions.length,
						"/",
						allPerms.length
					]
				})]
			})
		}
	];
	const actions = [
		{
			label: "View Role Permissions",
			icon: Eye,
			onClick: (r) => setViewRole(r)
		},
		{
			label: "Edit Role Information",
			icon: Pencil,
			onClick: (r) => {
				setForm({
					name: r.name,
					description: r.description || ""
				});
				setEditRole(r);
			}
		},
		{
			label: "Configure Permissions Matrix",
			icon: KeyRound,
			onClick: openPerms
		},
		{
			label: "Duplicate Role",
			icon: Copy,
			onClick: handleClone
		},
		{
			label: "Delete Role",
			icon: Trash2,
			onClick: (r) => setDeleteRole(r),
			destructive: true,
			separatorBefore: true,
			show: (r) => !r.isSystem && r.userCount === 0
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Roles & Access Control",
				description: "Configure role-based access control (RBAC) definitions and feature permissions.",
				breadcrumbs: [{
					label: "Nexus",
					to: "/"
				}, { label: "Roles & Permissions" }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: load,
						className: "h-9 gap-1.5 text-xs font-semibold border-border/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Refresh"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "h-9 gap-1.5 text-xs font-semibold shadow-xs",
						onClick: () => {
							setForm({
								name: "",
								description: ""
							});
							setCreateOpen(true);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Create New Role"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Defined Roles",
						value: total.toString(),
						sub: "Access tier categories",
						icon: ShieldCheck,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Permission Points",
						value: allPerms.length.toString(),
						sub: "Granular feature gates",
						icon: KeyRound,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Assigned Operators",
						value: items.reduce((s, r) => s + r.userCount, 0).toString(),
						sub: "Active personnel",
						icon: Shield,
						tone: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Protected System Roles",
						value: items.filter((r) => r.isSystem).length.toString(),
						sub: "Built-in immutable",
						icon: ShieldCheck,
						tone: "primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				data: items,
				columns: cols,
				rowKey: (r) => r.id,
				loading,
				searchPlaceholder: "Search roles by title or capability…",
				searchKeys: ["name", "description"],
				rowActions: actions,
				emptyTitle: "No access roles defined",
				emptyDescription: "Create customized roles to partition platform privileges safely."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl border-border/80 shadow-2xl p-6 bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold text-foreground",
							children: "Create Access Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Define a new security tier for admin users."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Role Name *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.name,
									onChange: (e) => setForm((f) => ({
										...f,
										name: e.target.value
									})),
									placeholder: "e.g. Compliance Auditor",
									className: "h-9 text-xs bg-muted/20 border-border/80"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: form.description,
									onChange: (e) => setForm((f) => ({
										...f,
										description: e.target.value
									})),
									placeholder: "Brief summary of permissions for this security tier…",
									className: "text-xs bg-muted/20 border-border/80"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
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
								className: "text-xs font-semibold",
								children: saving ? "Creating…" : "Create Role"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editRole,
				onOpenChange: (o) => !o && setEditRole(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl border-border/80 shadow-2xl p-6 bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold text-foreground",
							children: "Edit Role Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: editRole?.name
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Role Name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.name,
									onChange: (e) => setForm((f) => ({
										...f,
										name: e.target.value
									})),
									className: "h-9 text-xs bg-muted/20 border-border/80"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Description",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									value: form.description,
									onChange: (e) => setForm((f) => ({
										...f,
										description: e.target.value
									})),
									className: "text-xs bg-muted/20 border-border/80"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditRole(null),
								className: "text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleEdit,
								disabled: saving,
								className: "text-xs font-semibold",
								children: saving ? "Saving…" : "Save Changes"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewRole,
				onOpenChange: (o) => !o && setViewRole(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-bold text-foreground",
							children: viewRole?.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: viewRole?.description || "No description provided"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto px-6 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active Permissions Matrix" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-primary font-bold",
									children: [
										"(",
										viewRole?.permissions.length ?? 0,
										" enabled)"
									]
								})]
							}),
							permCatalog.map((g) => {
								const grantedInGroup = g.items.filter((i) => viewRole?.permissions.includes(i.key));
								if (!grantedInGroup.length) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: g.group
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: grantedInGroup.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 font-mono text-[11px] text-primary font-medium",
											children: p.key
										}, p.key))
									})]
								}, g.group);
							}),
							!viewRole?.permissions.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground italic text-center p-6 border border-dashed border-border rounded-xl",
								children: "No permissions currently assigned to this role."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!permRole,
				onOpenChange: (o) => !o && setPermRole(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] flex flex-col p-0 rounded-2xl border-border/80 shadow-2xl bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
							className: "border-b border-border/80 px-6 py-4.5 bg-card/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "text-base font-bold text-foreground",
								children: ["Permissions Matrix — ", permRole?.name]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs text-muted-foreground",
								children: "Toggle specific API and console privileges for users assigned to this role."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto px-6 py-5 space-y-6",
							children: permCatalog.map((g) => {
								const groupKeys = g.items.map((i) => i.key);
								const allGroupSelected = groupKeys.every((k) => selectedPerms.includes(k));
								const someGroupSelected = groupKeys.some((k) => selectedPerms.includes(k));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/60 bg-muted/15 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
												checked: allGroupSelected,
												onCheckedChange: (v) => toggleGroup(g, !!v),
												className: someGroupSelected && !allGroupSelected ? "data-[state=unchecked]:border-primary" : ""
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-bold uppercase tracking-wider text-foreground",
												children: g.group
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-mono text-muted-foreground",
											children: [
												groupKeys.filter((k) => selectedPerms.includes(k)).length,
												" / ",
												groupKeys.length,
												" enabled"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2",
										children: g.items.map((p) => {
											const checked = selectedPerms.includes(p.key);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex cursor-pointer items-center justify-between rounded-lg border border-border/60 bg-card p-3 hover:bg-muted/40 transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 pr-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs font-semibold text-foreground",
														children: p.description
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[10px] text-muted-foreground font-mono mt-0.5",
														children: p.key
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													checked,
													onCheckedChange: (v) => togglePerm(p.key, !!v)
												})]
											}, p.key);
										})
									})]
								}, g.group);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "border-t border-border/80 px-6 py-3.5 sm:justify-between bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: selectedPerms.length
									}),
									" of ",
									allPerms.length,
									" permissions active"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setPermRole(null),
									className: "text-xs",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: savePerms,
									disabled: saving,
									className: "text-xs font-semibold shadow-xs",
									children: saving ? "Saving…" : "Save Matrix"
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: !!deleteRole,
				onOpenChange: (o) => !o && setDeleteRole(null),
				title: "Delete Access Role?",
				description: deleteRole ? `The role "${deleteRole.name}" will be permanently removed.` : "",
				onConfirm: handleDelete,
				confirmLabel: "Delete Role",
				destructive: true
			})
		]
	});
}
export { RolesPage as component };
