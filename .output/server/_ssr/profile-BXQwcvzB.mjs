import { i as __toESM } from "../_runtime.mjs";
import { t as PageHeader } from "./PageHeader-CA49LmhZ.mjs";
import { c as AvatarFallback, h as session, l as Input, m as cn, p as apiClient, s as Avatar, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-C2bEF2b1.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Ft as Activity, G as KeyRound, L as Mail, Q as FingerprintPattern, W as Laptop, X as Globe, ct as Clock, ft as CircleCheck, h as Smartphone, pt as CircleAlert, s as User, st as Copy, vt as Check, w as Save, y as ShieldCheck, z as Lock } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/profile-BXQwcvzB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initials = (s) => s.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "NX";
var fmtDate = (d) => d ? new Date(d).toLocaleString("en-IN", {
	dateStyle: "medium",
	timeStyle: "short"
}) : "—";
function getDeviceIcon(userAgent) {
	if (!userAgent) return Laptop;
	const ua = userAgent.toLowerCase();
	if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return Smartphone;
	return Laptop;
}
function Field({ label, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "text-xs font-semibold tracking-tight text-foreground/90",
				children: label
			})]
		}), children]
	});
}
function ProfilePage() {
	const currentUser = session.getUser();
	const [profile, setProfile] = (0, import_react.useState)({
		name: "",
		email: ""
	});
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [loginHistory, setLoginHistory] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [passwordOpen, setPasswordOpen] = (0, import_react.useState)(false);
	const [pwd, setPwd] = (0, import_react.useState)({
		current: "",
		next: "",
		confirm: ""
	});
	const [pwdSaving, setPwdSaving] = (0, import_react.useState)(false);
	const [copiedId, setCopiedId] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!currentUser?.userId) return;
		setLoading(true);
		apiClient.get(`/users/${currentUser.userId}`).then((res) => {
			setProfile({
				name: res.data.name,
				email: res.data.email
			});
			setSessions(res.data.sessions || []);
			setLoginHistory(res.data.loginHistories || []);
		}).catch(() => toast.error("Failed to load profile")).finally(() => setLoading(false));
	}, [currentUser?.userId]);
	const saveProfile = async () => {
		if (!currentUser?.userId) return;
		setSaving(true);
		try {
			await apiClient.put(`/users/${currentUser.userId}`, {
				name: profile.name,
				email: profile.email
			});
			toast.success("Profile updated", { description: "Your account credentials have been saved." });
		} catch (e) {
			toast.error(e.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};
	const changePassword = async () => {
		if (pwd.next !== pwd.confirm) {
			toast.error("Passwords do not match");
			return;
		}
		if (pwd.next.length < 6) {
			toast.error("New password must be at least 6 characters");
			return;
		}
		setPwdSaving(true);
		try {
			await apiClient.post("/auth/change-password", {
				currentPassword: pwd.current,
				newPassword: pwd.next
			});
			toast.success("Password changed", { description: "Your administrative password has been updated securely." });
			setPasswordOpen(false);
			setPwd({
				current: "",
				next: "",
				confirm: ""
			});
		} catch (e) {
			toast.error(e.message || "Failed to change password");
		} finally {
			setPwdSaving(false);
		}
	};
	const revokeSession = async (sessionId) => {
		try {
			await apiClient.delete(`/auth/sessions/${sessionId}`);
			setSessions((prev) => prev.filter((s) => s.id !== sessionId));
			toast.success("Session revoked", { description: "The device has been signed out." });
		} catch {
			toast.error("Failed to revoke session");
		}
	};
	const copyUserId = () => {
		if (currentUser?.userId) {
			navigator.clipboard.writeText(currentUser.userId);
			setCopiedId(true);
			setTimeout(() => setCopiedId(false), 2e3);
			toast.success("User ID copied to clipboard");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading account credentials…" })]
	});
	const activeSessions = sessions.filter((s) => !s.isRevoked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My Profile & Security",
				description: "Manage your administrator credentials, active authentication sessions, and security logs.",
				breadcrumbs: [{
					label: "Home",
					to: "/"
				}, { label: "My Profile" }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					className: "gap-2 border-border/80 hover:bg-muted/60 shadow-xs",
					onClick: () => {
						setPwd({
							current: "",
							next: "",
							confirm: ""
						});
						setPasswordOpen(true);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-primary" }), "Change Password"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface relative flex flex-col items-center rounded-2xl border border-border/80 p-6 text-center shadow-sm overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-2 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "h-24 w-24 border-2 border-primary/30 ring-4 ring-primary/10 shadow-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "text-2xl font-bold bg-primary text-primary-foreground",
										children: initials(profile.name || currentUser?.name || "?")
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-emerald-500 shadow-xs",
									title: "Session active"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold tracking-tight text-foreground",
								children: profile.name || "Administrator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
									" ",
									profile.email
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3.5 flex flex-wrap items-center justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), currentUser?.role || "Super Admin"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
									children: "Verified MFA"
								})]
							}),
							currentUser?.userId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: copyUserId,
								className: "mt-4 flex w-full items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground hover:bg-muted/60 transition-colors",
								title: "Click to copy User ID",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 font-mono truncate",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FingerprintPattern, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: currentUser.userId
									})]
								}), copiedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 shrink-0 opacity-70" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface rounded-2xl border border-border/80 p-5 space-y-4 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Security Posture" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Active Sessions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold text-foreground",
										children: [activeSessions.length, " Devices"]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Audit Log Records"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-bold text-foreground",
										children: [loginHistory.length, " Events"]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "30d Trail"
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface rounded-2xl border border-border/80 p-6 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold tracking-tight text-foreground",
											children: "Account Information"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Update your identity and registered administrator email."
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-5 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full Name",
										icon: User,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: profile.name,
											onChange: (e) => setProfile((p) => ({
												...p,
												name: e.target.value
											})),
											className: "bg-card/50 font-medium",
											placeholder: "Administrator Name"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Email Address",
										icon: Mail,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											value: profile.email,
											onChange: (e) => setProfile((p) => ({
												...p,
												email: e.target.value
											})),
											className: "bg-card/50 font-medium",
											placeholder: "admin@example.com"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: saveProfile,
										disabled: saving,
										className: "gap-2 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), saving ? "Saving…" : "Save Changes"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface rounded-2xl border border-border/80 p-6 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 flex items-center justify-between border-b border-border/60 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-semibold tracking-tight text-foreground",
										children: [
											"Active Authentication Sessions (",
											activeSessions.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Devices currently holding valid bearer tokens for your account."
									})] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [activeSessions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border/70 bg-card/40 p-6 text-center text-sm text-muted-foreground",
									children: "No active sessions found."
								}), activeSessions.map((s, idx) => {
									const DeviceIcon = getDeviceIcon(s.userAgent);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-border/70 bg-card/40 p-4 gap-4 transition-all duration-150 hover:border-border hover:bg-card/70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground/80 shrink-0 mt-0.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceIcon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-semibold truncate text-foreground",
														children: s.userAgent || "Unknown Browser / Client"
													}), idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0",
														children: "Current Device"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3" }), s.ipAddress || "Unknown IP"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), fmtDate(s.createdAt)]
														})
													]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											className: "shrink-0 text-destructive border-destructive/25 hover:bg-destructive/10 hover:border-destructive/40 transition-colors",
											onClick: () => revokeSession(s.id),
											children: "Revoke Access"
										})]
									}, s.id);
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-surface rounded-2xl border border-border/80 p-6 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 flex items-center justify-between border-b border-border/60 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold tracking-tight text-foreground",
										children: "Recent Security Audit Trail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Chronological log of authentication attempts and authorization checks."
									})] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [loginHistory.slice(0, 10).map((h) => {
									const isSuccess = h.status === "success";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-xl border border-border/60 bg-card/30 p-3.5 transition-colors hover:bg-card/60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs", isSuccess ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"),
												children: isSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-semibold font-mono text-foreground",
												children: h.ipAddress
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-muted-foreground",
												children: fmtDate(h.createdAt)
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", isSuccess ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border border-destructive/20 bg-destructive/10 text-destructive"),
											children: h.status
										})]
									}, h.id);
								}), !loginHistory.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border/70 bg-card/40 p-6 text-center text-sm text-muted-foreground",
									children: "No login history records available."
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: passwordOpen,
				onOpenChange: setPasswordOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md rounded-2xl border-border/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-semibold",
								children: "Change Administrative Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-xs",
								children: "Enter your current credentials and provide a strong new password."
							})] })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Current Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										value: pwd.current,
										onChange: (e) => setPwd((p) => ({
											...p,
											current: e.target.value
										})),
										className: "bg-card/50",
										placeholder: "Enter current password"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "New Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										value: pwd.next,
										onChange: (e) => setPwd((p) => ({
											...p,
											next: e.target.value
										})),
										placeholder: "Min 6 characters (uppercase, numbers recommended)",
										className: "bg-card/50"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold",
										children: "Confirm New Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										value: pwd.confirm,
										onChange: (e) => setPwd((p) => ({
											...p,
											confirm: e.target.value
										})),
										placeholder: "Re-type new password",
										className: "bg-card/50"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setPasswordOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: changePassword,
								disabled: pwdSaving,
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), pwdSaving ? "Changing…" : "Update Password"]
							})]
						})
					]
				})
			})
		]
	});
}
export { ProfilePage as component };
