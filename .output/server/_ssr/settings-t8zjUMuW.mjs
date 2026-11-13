import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { l as Input, m as cn, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { t as Switch } from "./switch-sgIg-9Hs.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-PboPEAIL.mjs";
import { t as Textarea } from "./textarea-Diw4dwM4.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as ScrollText, Nt as Apple, Ot as Bell, T as RefreshCw, _ as Shield, ft as CircleCheck, g as SlidersHorizontal, h as Smartphone, l as TriangleAlert, m as Sparkles, ot as CreditCard, ut as CircleX, w as Save, wt as Building2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/settings-t8zjUMuW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULTS = {
	platformName: "NexLock",
	companyLogo: "",
	timezone: "Asia/Kolkata",
	currency: "INR",
	dateFormat: "DD-MM-YYYY",
	defaultLoanDuration: 12,
	gracePeriod: 3,
	defaultPenalty: 2,
	allowPartialPayments: true,
	autoCloseCompletedLoan: true,
	emailNotifications: true,
	smsNotifications: true,
	pushNotifications: true,
	heartbeatInterval: 15,
	offlineTimeout: 60,
	locationUpdateInterval: 30,
	commandRetryCount: 3,
	commandTimeout: 120,
	passwordPolicy: "medium",
	sessionTimeout: 30,
	maxLoginAttempts: 5,
	auditLogRetention: 365,
	reportRetention: 90,
	dealerAppMinVersionCode: 1,
	dealerAppLatestVersionCode: 1,
	dealerAppLatestVersionName: "1.0.0",
	dealerAppPlayStoreUrl: "",
	dealerAppUpdateMessage: "A new version of the NexLock Dealer app is available."
};
var tabs = [
	{
		id: "general",
		label: "General",
		desc: "Identity, locale & branding",
		icon: Building2
	},
	{
		id: "loan",
		label: "Loan Settings",
		desc: "EMI, grace & penalties",
		icon: CreditCard
	},
	{
		id: "notification",
		label: "Notifications",
		desc: "Broadcast channels",
		icon: Bell
	},
	{
		id: "device",
		label: "Device Settings",
		desc: "MDM heartbeat & telemetry",
		icon: Smartphone
	},
	{
		id: "ios-mdm",
		label: "iOS MDM",
		desc: "Apple Business & NanoMDM",
		icon: Apple
	},
	{
		id: "dealer-app",
		label: "Dealer App Update",
		desc: "Version control & rollout",
		icon: RefreshCw
	},
	{
		id: "security",
		label: "Security",
		desc: "Password & session timeout",
		icon: Shield
	},
	{
		id: "audit",
		label: "Audit & Retention",
		desc: "Data lifecycle policies",
		icon: ScrollText
	}
];
function StatusRow({ label, description, ok }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("col-span-2 flex items-center justify-between rounded-xl border p-4.5 transition-all duration-200", ok ? "border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/30" : "border-border/70 bg-card/40 hover:border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-0.5 pr-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold tracking-tight text-foreground",
					children: label
				}), ok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400",
					children: "Active"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground leading-relaxed",
				children: description
			})]
		}), ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "Configured"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-muted-foreground/60" }), "Not configured"]
		})]
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs font-semibold tracking-tight text-foreground/90",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] leading-relaxed text-muted-foreground",
				children: hint
			})
		]
	});
}
function SectionCard({ title, description, icon: Icon, badge, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface rounded-2xl border border-border/80 shadow-sm overflow-hidden transition-all duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border/60 bg-muted/15 px-6 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold tracking-tight text-foreground",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: description
					})] })]
				}), badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary",
					children: badge
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-5 md:grid-cols-2",
				children
			})
		})]
	});
}
function ToggleRow({ label, description, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("col-span-2 flex items-center justify-between rounded-xl border p-4.5 transition-all duration-200 cursor-pointer select-none", value ? "border-primary/30 bg-primary/[0.03] shadow-xs" : "border-border/70 bg-card/40 hover:border-border"),
		onClick: () => onChange(!value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pr-4 space-y-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold tracking-tight text-foreground",
					children: label
				}), value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary animate-pulse" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground leading-relaxed",
				children: description
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				checked: value,
				onCheckedChange: onChange
			})
		})]
	});
}
function SettingsPage() {
	const [tab, setTab] = (0, import_react.useState)("general");
	const [values, setValues] = (0, import_react.useState)(DEFAULTS);
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [iosMdmStatus, setIosMdmStatus] = (0, import_react.useState)(null);
	const [iosMdmLoading, setIosMdmLoading] = (0, import_react.useState)(false);
	const loadIosMdmStatus = (0, import_react.useCallback)(async () => {
		setIosMdmLoading(true);
		try {
			const res = await apiClient.get("/mdm-ios/status");
			if (res.success) setIosMdmStatus(res.data);
		} catch {} finally {
			setIosMdmLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (tab === "ios-mdm" && !iosMdmStatus && !iosMdmLoading) loadIosMdmStatus();
	}, [
		tab,
		iosMdmStatus,
		iosMdmLoading,
		loadIosMdmStatus
	]);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const res = await apiClient.get("/settings");
			setValues({
				...DEFAULTS,
				...res.data
			});
			setDirty(false);
		} catch {
			toast.error("Failed to load settings");
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const patch = (key, value) => {
		setValues((v) => ({
			...v,
			[key]: value
		}));
		setDirty(true);
	};
	const save = async () => {
		setSaving(true);
		try {
			await apiClient.put("/settings", values);
			toast.success("Settings saved", { description: "Platform configuration has been updated." });
			setDirty(false);
		} catch (e) {
			toast.error(e.message || "Failed to save settings");
		} finally {
			setSaving(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading platform configuration…" })]
	});
	const activeTabMeta = tabs.find((t) => t.id === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Platform Settings",
			description: "Configure NexLock security policies, device telemetry, and financing operations.",
			breadcrumbs: [{
				label: "Home",
				to: "/"
			}, { label: "Platform Settings" }],
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Unsaved changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: cn("gap-1.5 shadow-sm transition-all", dirty ? "shadow-primary/20 bg-primary hover:bg-primary/95 ring-2 ring-primary/20" : ""),
					onClick: save,
					disabled: !dirty || saving,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), saving ? "Saving…" : "Save Changes"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "card-surface rounded-2xl border border-border/80 p-2 space-y-1 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }), " Configuration Modules"]
					}), tabs.map((t) => {
						const active = tab === t.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTab(t.id),
							className: cn("group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150", active ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs font-semibold leading-tight",
									children: t.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("truncate text-[10px] leading-tight mt-0.5", active ? "text-primary-foreground/80" : "text-muted-foreground/70"),
									children: t.desc
								})]
							})]
						}, t.id);
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface rounded-2xl border border-border/80 p-4 space-y-3 hidden lg:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-foreground/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-primary" }), " Nexus Engine"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400",
							children: "v2.5 Live"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active Region" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground font-medium",
									children: values.timezone.split("/")[1] || "Asia"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Heartbeat Cadence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-foreground font-medium",
									children: [values.heartbeatInterval, " min"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lock Policy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground font-medium capitalize",
									children: values.passwordPolicy
								})]
							})
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					tab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "General System Identity",
						description: "Platform title, organizational branding, and regional localization standards.",
						icon: Building2,
						badge: "Core System",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Platform Name",
								hint: "Displayed in the top navigation bar, browser tabs, and notification footers.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: values.platformName,
									onChange: (e) => patch("platformName", e.target.value),
									className: "bg-card/50 font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Company Logo URL",
								hint: "HTTPS link to SVG, PNG, or WebP logo icon asset.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: values.companyLogo,
									onChange: (e) => patch("companyLogo", e.target.value),
									placeholder: "https://cdn.example.com/logo.png",
									className: "bg-card/50"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Primary Time Zone",
								hint: "Calculates EMI due dates, grace period expiry, and heartbeat windows.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: values.timezone,
									onValueChange: (v) => patch("timezone", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-card/50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
										"Asia/Kolkata",
										"Asia/Singapore",
										"Asia/Dubai",
										"Europe/London",
										"America/New_York"
									].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: z,
										children: z
									}, z)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Operational Currency",
								hint: "Standard monetary symbol applied across all loan contracts and receipts.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: values.currency,
									onValueChange: (v) => patch("currency", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-card/50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "INR",
											children: "INR — Indian Rupee (₹)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "USD",
											children: "USD — US Dollar ($)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "AED",
											children: "AED — UAE Dirham (د.إ)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SGD",
											children: "SGD — Singapore Dollar (S$)"
										})
									] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Date Display Format",
								hint: "Standard localized timestamp representation across all reports and tables.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: values.dateFormat,
									onValueChange: (v) => patch("dateFormat", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-card/50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "DD-MM-YYYY",
											children: "DD-MM-YYYY (e.g. 13-11-2026)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "MM/DD/YYYY",
											children: "MM/DD/YYYY (e.g. 11/13/2026)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "YYYY-MM-DD",
											children: "YYYY-MM-DD (ISO 8601)"
										})
									] })]
								})
							})
						]
					}),
					tab === "loan" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Loan & EMI Configuration",
						description: "Default financing terms, grace windows, penalty structures, and settlement rules.",
						icon: CreditCard,
						badge: "Financing Engine",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Default Loan Duration (Months)",
								hint: "Default term applied to newly initialized financing contracts.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 360,
									value: values.defaultLoanDuration,
									onChange: (e) => patch("defaultLoanDuration", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Grace Period Window (Days)",
								hint: "Days allowed past the due date before penalty accrual and auto-lock triggers.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 30,
									value: values.gracePeriod,
									onChange: (e) => patch("gracePeriod", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Default Penalty Surcharge (%)",
								hint: "Monthly compounding percentage applied to overdue instalment balances.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 100,
									step: .5,
									value: values.defaultPenalty,
									onChange: (e) => patch("defaultPenalty", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 space-y-3.5 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
									label: "Allow Partial EMI Settlements",
									description: "Permit consumers to submit payments smaller than the scheduled monthly instalment.",
									value: values.allowPartialPayments,
									onChange: (v) => patch("allowPartialPayments", v)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
									label: "Auto-close Completed Financing Contracts",
									description: "Automatically transition loan state to Completed when ledger balance reaches zero.",
									value: values.autoCloseCompletedLoan,
									onChange: (v) => patch("autoCloseCompletedLoan", v)
								})]
							})
						]
					}),
					tab === "notification" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Global Notification Channels",
						description: "Toggle multi-channel messaging routes for borrower reminders and dealer alerts.",
						icon: Bell,
						badge: "Broadcast Gateway",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Email Notifications (SMTP Gateway)",
								description: "Deliver payment receipts, delinquency notices, and statements via transactional email.",
								value: values.emailNotifications,
								onChange: (v) => patch("emailNotifications", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "SMS Notifications (Telecom Gateway)",
								description: "Send mission-critical OTPs, due-date alerts, and lockout warnings via high-priority SMS.",
								value: values.smsNotifications,
								onChange: (v) => patch("smsNotifications", v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "FCM Push Notifications",
								description: "Send realtime MDM push notifications and silent triggers directly to enrolled mobile devices.",
								value: values.pushNotifications,
								onChange: (v) => patch("pushNotifications", v)
							})
						]
					}),
					tab === "device" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Device Telemetry & Command Protocol",
						description: "Heartbeat cadence, offline detection thresholds, and remote command retry limits.",
						icon: Smartphone,
						badge: "MDM Protocol",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Heartbeat Ping Interval (Minutes)",
								hint: "Cadence at which enrolled handsets transmit telemetry and state to Nexus.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 1440,
									value: values.heartbeatInterval,
									onChange: (e) => patch("heartbeatInterval", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Offline Timeout Threshold (Minutes)",
								hint: "Duration of silence before an enrolled handset is flagged as Offline.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 10080,
									value: values.offlineTimeout,
									onChange: (e) => patch("offlineTimeout", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "GPS Location Update Cadence (Minutes)",
								hint: "Android only — GPS location reporting frequency. iOS MDM does not support GPS polling.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 1440,
									value: values.locationUpdateInterval,
									onChange: (e) => patch("locationUpdateInterval", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Command Execution Retry Count",
								hint: "Number of retry attempts executed when a remote command fails or drops.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									max: 10,
									value: values.commandRetryCount,
									onChange: (e) => patch("commandRetryCount", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Command Wait Timeout (Seconds)",
								hint: "Maximum duration allowed for an enrolled client to acknowledge command reception.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 10,
									max: 3600,
									value: values.commandTimeout,
									onChange: (e) => patch("commandTimeout", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							})
						]
					}),
					tab === "ios-mdm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Apple iOS MDM & Business Manager Infrastructure",
						description: "Real-time telemetry and configuration status of Apple device enrollment and supervision services.",
						icon: Apple,
						badge: "Apple Supervised",
						children: iosMdmLoading && !iosMdmStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 flex flex-col items-center justify-center py-10 gap-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Querying Apple MDM status and certificates…" })]
						}) : iosMdmStatus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
								label: "NanoMDM Server Engine",
								description: "The core MDM check-in, APNs push dispatcher, and command orchestration server every enrolled iPhone communicates with.",
								ok: iosMdmStatus.nanomdm.configured
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
								label: "SCEP PKI CA Authority",
								description: "Issues and signs the client identity x509 identity certificates required for secure mutual TLS iOS communication.",
								ok: iosMdmStatus.scep.configured
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
								label: "Lock-screen Kiosk App Bundle ID",
								description: "Required for remote device lockdown to pin Autonomous Single App Mode (ASAM) to the NexLock iOS client.",
								ok: iosMdmStatus.lockscreenApp.configured
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
								label: "NanoDEP Server (Apple Business Manager)",
								description: "Direct synchronization gateway with Apple Business Manager (ABM) for automated zero-touch enrollment.",
								ok: iosMdmStatus.nanodep.configured
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
								label: "DEP Enrollment Profile Defined",
								description: "The mandatory Apple Business Manager supervision profile assigned to hardware during factory unboxing.",
								ok: iosMdmStatus.nanodep.profileDefined
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusRow, {
								label: "Apple VPP Volume Purchase Auto-Install",
								description: "Automates silent distribution of the lock-screen kiosk client upon activation (requires Apple Custom App approval).",
								ok: iosMdmStatus.vpp.configured
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2 rounded-xl border border-border/80 bg-muted/20 p-8 text-center text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Apple, { className: "mx-auto h-8 w-8 text-muted-foreground/40 mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground",
									children: "Could not query iOS MDM status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Verify backend Apple APNs certificates and NanoMDM environment credentials."
								})
							]
						})
					}),
					tab === "dealer-app" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Dealer Mobile App Release Management",
						description: "Controls version gating, minimum compatible build numbers, and play store rollout advisories.",
						icon: RefreshCw,
						badge: "Android Build",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2 mb-2 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs leading-relaxed text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Version Code Strategy: "
										}),
										"Input the numeric ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono text-primary font-bold",
											children: "versionCode"
										}),
										" from ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "font-mono",
											children: "android/app/build.gradle"
										}),
										". Devices with a build below the minimum version code will be immediately gated behind a mandatory full-screen update block."
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Minimum Required Version Code",
								hint: "Dealers below this build number cannot access any functions until upgraded.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									value: values.dealerAppMinVersionCode,
									onChange: (e) => patch("dealerAppMinVersionCode", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Latest Available Version Code",
								hint: "Dealers between minimum and latest will receive a dismissible update prompt.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									value: values.dealerAppLatestVersionCode,
									onChange: (e) => patch("dealerAppLatestVersionCode", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Display Version Name",
								hint: "Public semver string shown to dealers (e.g. 1.2.4).",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: values.dealerAppLatestVersionName,
									onChange: (e) => patch("dealerAppLatestVersionName", e.target.value),
									placeholder: "1.0.7",
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Google Play Store Link",
								hint: "Destination URL launched when dealer taps the Update action.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: values.dealerAppPlayStoreUrl,
									onChange: (e) => patch("dealerAppPlayStoreUrl", e.target.value),
									placeholder: "https://play.google.com/store/apps/details?id=com.nexlock.dealer",
									className: "bg-card/50"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Release Advisory Message",
									hint: "Advisory text rendered on both mandatory and optional update dialogs.",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										value: values.dealerAppUpdateMessage,
										onChange: (e) => patch("dealerAppUpdateMessage", e.target.value),
										className: "bg-card/50 resize-y"
									})
								})
							})
						]
					}),
					tab === "security" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Identity & Authentication Security",
						description: "Configure password entropy requirements, idle session expirations, and brute-force lockout rules.",
						icon: Shield,
						badge: "SOC 2 Standard",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Password Complexity Tier",
								hint: "Standard password strength enforced during administrator registration and reset.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: values.passwordPolicy,
									onValueChange: (v) => patch("passwordPolicy", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-card/50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "low",
											children: "Low — Minimum 6 characters"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "medium",
											children: "Medium — 8+ characters, uppercase and numbers"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "high",
											children: "High — 12+ characters, symbols and mixed case"
										})
									] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Idle Session Expiry (Minutes)",
								hint: "Automatically invalidate administrative tokens after continuous period of inactivity.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 5,
									max: 1440,
									value: values.sessionTimeout,
									onChange: (e) => patch("sessionTimeout", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Max Failed Login Attempts",
								hint: "Temporary IP/account lockout enforced after consecutive credential failures.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 3,
									max: 20,
									value: values.maxLoginAttempts,
									onChange: (e) => patch("maxLoginAttempts", +e.target.value),
									className: "bg-card/50 font-mono font-medium"
								})
							})
						]
					}),
					tab === "audit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
						title: "Data Retention & Audit Lifecycle",
						description: "Compliance retention windows for telemetry trails, audit logs, and scheduled report exports.",
						icon: ScrollText,
						badge: "Data Hygiene",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Audit Log Archival Retention (Days)",
							hint: "Automated purge threshold for administrative security audit trails.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 30,
								max: 3650,
								value: values.auditLogRetention,
								onChange: (e) => patch("auditLogRetention", +e.target.value),
								className: "bg-card/50 font-mono font-medium"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Generated Report Retention (Days)",
							hint: "Storage purge threshold for historical CSV/PDF report artifacts.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 7,
								max: 365,
								value: values.reportRetention,
								onChange: (e) => patch("reportRetention", +e.target.value),
								className: "bg-card/50 font-mono font-medium"
							})
						})]
					}),
					dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky bottom-6 z-20 flex items-center justify-between rounded-2xl border border-primary/30 bg-background/95 backdrop-blur-md px-6 py-4 shadow-xl shadow-primary/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/25",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold text-foreground",
								children: "You have unsaved changes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Changes to ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: activeTabMeta?.label
									}),
									" have not been committed."
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: save,
							disabled: saving,
							className: "gap-1.5 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), saving ? "Saving…" : "Save Now"]
						})]
					})
				]
			})]
		})]
	});
}
export { SettingsPage as component };
