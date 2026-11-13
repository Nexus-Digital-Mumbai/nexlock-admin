import { i as __toESM } from "../_runtime.mjs";
import { h as session, l as Input, p as apiClient, u as Button } from "./router-C4OGpStW.mjs";
import { t as Label } from "./label-BInbItP8.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as Network, U as Layers, V as LoaderCircle, h as Smartphone, jt as ArrowRight, nt as EyeOff, tt as Eye, y as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/distributor-login-CcWvsUDv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DistributorLoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (session.isAuthenticated()) navigate({ to: "/distributor" });
	}, [navigate]);
	const validate = () => {
		const e = {};
		if (!email.trim()) e.email = "Email is required";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
		if (!password) e.password = "Password is required";
		setErrors(e);
		return Object.keys(e).length === 0;
	};
	const submit = (ev) => {
		ev.preventDefault();
		if (!validate()) return;
		setLoading(true);
		apiClient.post("/dealer-staff/login", {
			email,
			password
		}).then((data) => {
			if (data.success) {
				session.setAccessToken(data.data.accessToken);
				session.setUser(data.data.staff);
				session.broadcastLogin();
				toast.success("Login successful", { description: "Welcome to Nexus Distributor Portal." });
				navigate({ to: "/distributor" });
			} else toast.error("Sign in failed", { description: data.message || "Invalid credentials" });
		}).catch((err) => {
			toast.error("Authentication Error", { description: err.message || "Connection failed to server" });
		}).finally(() => {
			setLoading(false);
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative min-h-screen w-full overflow-hidden antialiased selection:bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-12 lg:px-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden lg:col-span-7 lg:block space-y-7 animate-fade-up",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#4338CA] dark:text-indigo-300 shadow-xs backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" }), "Nexus Distributor & Quota Ecosystem"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/nexus-official-logo.png",
									alt: "NEXUS",
									className: "h-14 w-auto max-w-[280px] object-contain"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl font-extrabold tracking-tight text-[#14172C] dark:text-white sm:text-5xl lg:text-[46px] leading-[1.18]",
								children: "Manage Quota Pools & Sub-Dealer Networks."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-sm leading-relaxed text-[#5A5F7A] dark:text-slate-300",
								children: "Allocate device enrollment limits to connector shops, review distributor billings, track live device activations, and streamline hardware onboarding under a single unified quota."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid max-w-xl grid-cols-2 gap-4 pt-2",
						children: [
							{
								title: "Quota Distribution",
								desc: "Allocate and rebalance Android & iOS limits across retail branches.",
								icon: Layers
							},
							{
								title: "Sub-Dealer Connectors",
								desc: "Authorize new retail partner stores and manage staff logins seamlessly.",
								icon: Network
							},
							{
								title: "Live Activation Tracking",
								desc: "Real-time metrics for enrolled, active, and completed financing plans.",
								icon: Smartphone
							},
							{
								title: "Single Sign-On",
								desc: "Use your existing Dealer mobile app credentials for instant access.",
								icon: ShieldCheck
							}
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/80 dark:border-white/10 bg-white/55 dark:bg-slate-900/50 p-4.5 shadow-sm backdrop-blur-xl transition-all hover:bg-white/70 dark:hover:bg-slate-900/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-4.5 w-4.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-bold text-[#14172C] dark:text-white",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-[#64748B] dark:text-slate-400 leading-relaxed",
									children: f.desc
								})
							]
						}, f.title))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-md lg:col-span-5 animate-fade-up",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex justify-center lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/nexus-official-logo.png",
							alt: "NEXUS",
							className: "h-12 w-auto max-w-[220px] object-contain"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-3xl border border-white/85 dark:border-white/15 bg-white/70 dark:bg-slate-900/80 p-8 sm:p-9 shadow-[0_20px_50px_rgba(80,85,120,0.12)] backdrop-blur-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold uppercase tracking-wider text-[#4338CA] dark:text-indigo-400",
											children: "Distributor Portal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300",
											children: "Dealer App Credentials"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-2xl font-extrabold tracking-tight text-[#14172C] dark:text-white",
										children: "Distributor Sign In"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs leading-relaxed text-[#64748B] dark:text-slate-400",
										children: "Sign in with your registered dealer email and password to access quota tools."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: submit,
								noValidate: true,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "dist-email",
												className: "text-xs font-semibold text-foreground",
												children: "Dealer Account Email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "dist-email",
												type: "email",
												autoComplete: "email",
												placeholder: "distributor@shop.com",
												value: email,
												onChange: (e) => setEmail(e.target.value),
												"aria-invalid": !!errors.email,
												className: `h-11 rounded-2xl border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 text-foreground placeholder:text-muted-foreground/70 focus-visible:bg-white shadow-xs ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`
											}),
											errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-medium text-rose-500",
												children: errors.email
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-between",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "dist-password",
													className: "text-xs font-semibold text-foreground",
													children: "Password"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "dist-password",
													type: showPw ? "text" : "password",
													autoComplete: "current-password",
													placeholder: "Enter account password",
													value: password,
													onChange: (e) => setPassword(e.target.value),
													"aria-invalid": !!errors.password,
													className: `h-11 pr-11 rounded-2xl border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 text-foreground placeholder:text-muted-foreground/70 focus-visible:bg-white shadow-xs ${errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""}`
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setShowPw((s) => !s),
													className: "absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:text-foreground cursor-pointer",
													"aria-label": showPw ? "Hide password" : "Show password",
													children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												})]
											}),
											errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] font-medium text-rose-500",
												children: errors.password
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: loading,
										className: "mt-3 h-11 w-full rounded-2xl bg-[#1E1B4B] hover:bg-[#2A2665] text-white font-semibold text-sm shadow-md transition-all cursor-pointer",
										children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }), "Signing in…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2",
											children: ["Access Portal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: "text-xs font-semibold text-[#4338CA] hover:underline transition-colors",
									children: "← Return to Platform Administrator Login"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-between text-xs text-muted-foreground px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Nexus Platform"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/privacy",
								className: "hover:text-foreground transition-colors",
								children: "Privacy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/terms",
								className: "hover:text-foreground transition-colors",
								children: "Terms"
							})]
						})]
					})
				]
			})]
		})
	});
}
export { DistributorLoginPage as component };
