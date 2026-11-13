import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { l as Input, m as cn, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { t as Checkbox } from "./checkbox-DMTtsYgG.mjs";
import { t as Textarea } from "./textarea-Diw4dwM4.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-PboPEAIL.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Ot as Bell, S as Search, g as SlidersHorizontal, h as Smartphone, ot as CreditCard, p as Store, s as User, u as Trash2, x as Send, yt as CheckCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/notifications-CmvXoZ4i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SendNotificationDialog({ open, onOpenChange }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [content, setContent] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("INFO");
	const [target, setTarget] = (0, import_react.useState)("ALL");
	const [dealerSearch, setDealerSearch] = (0, import_react.useState)("");
	const [selectedDealers, setSelectedDealers] = (0, import_react.useState)([]);
	const { data: dealerResults } = useQuery({
		queryKey: [
			"dealers",
			"picker",
			dealerSearch
		],
		queryFn: () => apiClient.get(`/dealers?search=${encodeURIComponent(dealerSearch)}&limit=20`),
		enabled: target === "DEALERS"
	});
	const reset = () => {
		setTitle("");
		setContent("");
		setPriority("INFO");
		setTarget("ALL");
		setDealerSearch("");
		setSelectedDealers([]);
	};
	const sendMutation = useMutation({
		mutationFn: () => apiClient.post("/notifications/broadcast", {
			title,
			content,
			priority,
			target,
			dealerIds: target === "DEALERS" ? selectedDealers.map((d) => d.id) : void 0
		}),
		onSuccess: (res) => {
			const count = res.data?.recipientCount ?? 0;
			toast.success("Broadcast dispatched", { description: `Delivered to ${count} dealer staff member${count === 1 ? "" : "s"}.` });
			reset();
			onOpenChange(false);
		},
		onError: (e) => toast.error(e.message || "Failed to send notification")
	});
	const toggleDealer = (d) => {
		setSelectedDealers((cur) => cur.some((x) => x.id === d.id) ? cur.filter((x) => x.id !== d.id) : [...cur, d]);
	};
	const canSend = title.trim().length > 0 && content.trim().length > 0 && (target === "ALL" || selectedDealers.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => {
			if (!v) reset();
			onOpenChange(v);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg rounded-2xl border-border/80 shadow-2xl p-6 bg-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-base font-bold text-foreground",
					children: "Broadcast Platform Notification"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: "Push real-time alert messages to authorized dealer store personnel."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-foreground",
								children: "Message Title *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "e.g. Critical platform maintenance scheduled",
								maxLength: 100,
								className: "h-9 text-xs bg-muted/20 border-border/80"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-foreground",
								children: "Message Body *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 3,
								value: content,
								onChange: (e) => setContent(e.target.value),
								placeholder: "Provide complete operational guidance for store managers…",
								maxLength: 500,
								className: "text-xs bg-muted/20 border-border/80"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-foreground",
								children: "Alert Urgency / Priority"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: priority,
								onValueChange: setPriority,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-xs bg-muted/20 border-border/80",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "rounded-xl border-border shadow-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "INFO",
											className: "text-xs",
											children: "Info (General updates)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SUCCESS",
											className: "text-xs",
											children: "Success (Confirmations)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "WARNING",
											className: "text-xs",
											children: "Warning (Time sensitive)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "CRITICAL",
											className: "text-xs",
											children: "Critical (Immediate action)"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-foreground",
								children: "Distribution Scope"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTarget("ALL"),
									className: cn("flex-1 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer text-center", target === "ALL" ? "border-primary bg-primary/10 text-primary shadow-xs" : "border-border/80 text-muted-foreground hover:bg-muted/40"),
									children: "All Registered Dealers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTarget("DEALERS"),
									className: cn("flex-1 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer text-center", target === "DEALERS" ? "border-primary bg-primary/10 text-primary shadow-xs" : "border-border/80 text-muted-foreground hover:bg-muted/40"),
									children: "Selected Dealer Stores"
								})]
							})]
						}),
						target === "DEALERS" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 rounded-xl border border-border/80 bg-muted/15 p-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search dealers by name or code…",
									value: dealerSearch,
									onChange: (e) => setDealerSearch(e.target.value),
									className: "h-8 text-xs bg-card border-border/80"
								}),
								selectedDealers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-semibold text-primary",
									children: [selectedDealers.length, " stores chosen"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-44 space-y-1 overflow-y-auto pr-1",
									children: [(dealerResults?.data ?? []).map((d) => {
										const checked = selectedDealers.some((x) => x.id === d.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs hover:bg-card cursor-pointer border border-transparent hover:border-border/60 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
													checked,
													onCheckedChange: () => toggleDealer(d)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "flex-1 font-medium text-foreground truncate",
													children: d.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: d.code
												})
											]
										}, d.id);
									}), dealerResults && dealerResults.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "py-3 text-center text-xs text-muted-foreground",
										children: "No dealers matched your search."
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => onOpenChange(false),
						className: "text-xs",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => sendMutation.mutate(),
						disabled: !canSend || sendMutation.isPending,
						className: "gap-1.5 text-xs font-semibold shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), sendMutation.isPending ? "Broadcasting…" : "Send Broadcast"]
					})]
				})
			]
		})
	});
}
function NotificationsPage() {
	const queryClient = useQueryClient();
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [search, setSearch] = (0, import_react.useState)("");
	const [sendDialogOpen, setSendDialogOpen] = (0, import_react.useState)(false);
	const { data: listData, refetch } = useQuery({
		queryKey: [
			"notifications",
			"list",
			filter,
			search
		],
		queryFn: () => {
			const path = `/notifications?isRead=${filter === "Unread" ? "false" : filter === "Read" ? "true" : ""}&search=${search}&limit=50`;
			return apiClient.get(path);
		}
	});
	const notifications = listData?.data?.items || [];
	const { data: prefData } = useQuery({
		queryKey: ["notifications", "preferences"],
		queryFn: () => apiClient.get("/notifications/preferences")
	});
	const dbPreferences = prefData?.data || [];
	const preferenceEvents = [
		{
			key: "loan.approved",
			label: "Loan Approvals & Onboarding"
		},
		{
			key: "emi.reminder",
			label: "EMI Repayment Reminders"
		},
		{
			key: "payment.received",
			label: "Payment Confirmations"
		},
		{
			key: "customer.registered",
			label: "Consumer KYC Registration"
		},
		{
			key: "dealer.added",
			label: "Dealership Network Events"
		},
		{
			key: "device.assigned",
			label: "Hardware Lock Assignments"
		},
		{
			key: "marketing",
			label: "System Announcements"
		}
	];
	const updatePreferenceMutation = useMutation({
		mutationFn: (updatedList) => apiClient.put("/notifications/preferences", { preferences: updatedList }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications", "preferences"] });
			toast.success("Notification preferences updated successfully");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update preferences");
		}
	});
	const getPreferenceValue = (eventKey, channel) => {
		const existing = dbPreferences.find((p) => p.event === eventKey);
		if (existing) return existing[channel];
		if (eventKey === "marketing") return false;
		if (channel === "sms") return false;
		return true;
	};
	const handleTogglePreference = (eventKey, channel, checked) => {
		const currentList = [...dbPreferences];
		const existingIndex = currentList.findIndex((p) => p.event === eventKey);
		const defaultPref = {
			event: eventKey,
			email: getPreferenceValue(eventKey, "email"),
			sms: getPreferenceValue(eventKey, "sms"),
			push: getPreferenceValue(eventKey, "push"),
			inApp: getPreferenceValue(eventKey, "inApp")
		};
		if (existingIndex === -1) {
			const newPref = {
				...defaultPref,
				[channel]: checked
			};
			currentList.push(newPref);
		} else currentList[existingIndex] = {
			...currentList[existingIndex],
			[channel]: checked
		};
		updatePreferenceMutation.mutate(currentList);
	};
	const markReadMutation = useMutation({
		mutationFn: (id) => apiClient.patch(`/notifications/${id}/read`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			refetch();
		}
	});
	const markAllReadMutation = useMutation({
		mutationFn: () => apiClient.patch("/notifications/read-all"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			refetch();
			toast.success("All notifications marked as read");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => apiClient.delete(`/notifications/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			refetch();
		}
	});
	const handleNotificationClick = async (notif) => {
		if (!notif.isRead) await markReadMutation.mutateAsync(notif.id);
		const meta = notif.metadata;
		if (meta && meta.entityId) {
			const moduleName = String(meta.module).toLowerCase();
			if (moduleName === "loan" || moduleName === "emi") window.location.href = `/loans?search=${meta.entityId}`;
			else if (moduleName === "device") window.location.href = `/devices?search=${meta.entityId}`;
			else if (moduleName === "customer") window.location.href = `/customers?search=${meta.entityId}`;
			else if (moduleName === "dealer") window.location.href = `/dealers?search=${meta.entityId}`;
		}
	};
	const getPriorityStyle = (priority) => {
		switch (priority) {
			case "CRITICAL": return "bg-destructive/10 border-destructive/25 text-destructive";
			case "WARNING": return "bg-amber-500/10 border-amber-500/25 text-amber-500";
			case "SUCCESS": return "bg-emerald-500/10 border-emerald-500/25 text-emerald-500";
			default: return "bg-primary/10 border-primary/20 text-primary";
		}
	};
	const getCategoryIcon = (category) => {
		switch (category) {
			case "DEALER": return Store;
			case "CUSTOMER": return User;
			case "LOAN":
			case "EMI": return CreditCard;
			case "DEVICE":
			case "ANDROID": return Smartphone;
			default: return Bell;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Notification Center",
				description: "Monitor system events, broadcast alert messages to store managers, and configure delivery preferences.",
				breadcrumbs: [{
					label: "Nexus",
					to: "/"
				}, { label: "Notifications" }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setSendDialogOpen(true),
						className: "h-9 gap-1.5 text-xs font-semibold shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "Broadcast Message"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => markAllReadMutation.mutate(),
						className: "h-9 gap-1.5 text-xs font-semibold border-border/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-4 w-4" }), "Mark All as Read"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendNotificationDialog, {
				open: sendDialogOpen,
				onOpenChange: setSendDialogOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs lg:col-span-2 flex flex-col min-h-[500px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 p-4 gap-3 bg-card/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full max-w-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search alerts…",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "h-8.5 pl-9 text-xs bg-muted/30 border-border/80"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 rounded-lg border border-border/80 bg-muted/20 p-1 text-xs",
							children: [
								"All",
								"Unread",
								"Read"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFilter(t),
								className: cn("rounded-md px-3 py-1 font-semibold transition-all cursor-pointer", filter === t ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
								children: t
							}, t))
						})]
					}), notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex flex-col items-center justify-center p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6 text-primary/70 animate-pulse" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-bold text-foreground",
								children: "All alerts clear"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1 max-w-xs",
								children: "No notification items matching your filter settings."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border/60 overflow-y-auto max-h-[620px]",
						children: notifications.map((n) => {
							const Icon = getCategoryIcon(n.category);
							const isUnread = !n.isRead;
							const styleClass = getPriorityStyle(n.priority);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("group flex gap-4 p-4.5 transition-colors hover:bg-muted/30 relative", isUnread ? "bg-primary/4" : ""),
								children: [
									isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1.5 top-5 h-2 w-2 rounded-full bg-primary ring-2 ring-primary/20" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", styleClass),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: cn("text-xs md:text-sm font-semibold truncate", isUnread ? "text-foreground font-bold" : "text-foreground/80"),
													children: n.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "shrink-0 text-[10px] text-muted-foreground font-medium",
													children: new Date(n.createdAt).toLocaleString("en-IN", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit"
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground leading-relaxed pr-6",
												children: n.content
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center justify-between pt-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "sm",
													onClick: () => handleNotificationClick(n),
													className: "h-6.5 text-[11px] px-2.5 font-medium border-border/80 hover:border-primary/40 hover:text-primary transition-colors",
													children: n.metadata?.action || "View Target Record"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													onClick: () => deleteMutation.mutate(n.id),
													className: "h-6 w-6 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100",
													title: "Delete notification",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
												})]
											})
										]
									})
								]
							}, n.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-xl border border-border/80 bg-card p-5 shadow-xs h-fit space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 pb-3 border-b border-border/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-foreground",
							children: "Delivery Preferences"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3.5",
						children: preferenceEvents.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 p-3 rounded-xl border border-border/60 bg-muted/15",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-foreground",
								children: ev.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-4 gap-2 text-center pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-muted-foreground uppercase font-bold tracking-wider",
											children: "In-App"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: getPreferenceValue(ev.key, "inApp"),
											onCheckedChange: (checked) => handleTogglePreference(ev.key, "inApp", !!checked)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-muted-foreground uppercase font-bold tracking-wider",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: getPreferenceValue(ev.key, "email"),
											onCheckedChange: (checked) => handleTogglePreference(ev.key, "email", !!checked)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-muted-foreground uppercase font-bold tracking-wider",
											children: "SMS"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: getPreferenceValue(ev.key, "sms"),
											onCheckedChange: (checked) => handleTogglePreference(ev.key, "sms", !!checked)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-muted-foreground uppercase font-bold tracking-wider",
											children: "Push"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: getPreferenceValue(ev.key, "push"),
											onCheckedChange: (checked) => handleTogglePreference(ev.key, "push", !!checked)
										})]
									})
								]
							})]
						}, ev.key))
					})]
				})]
			})
		]
	});
}
export { NotificationsPage as component };
