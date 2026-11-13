import { i as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D8jQpDG7.mjs";
import { t as BroadcastChannel } from "../_libs/unenv.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createFileRoute, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Slot, L as require_jsx_runtime, d as DialogContent, f as DialogDescription, g as DialogTrigger, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { E as Receipt, H as LayoutDashboard, K as Info, M as Network, N as Moon, Ot as Bell, P as Menu, R as LogOut, S as Search, T as RefreshCw, V as LoaderCircle, _ as Shield, _t as ChevronDown, b as Settings2, f as Sun, gt as ChevronLeft, h as Smartphone, ht as ChevronRight, j as PanelLeftClose, jt as ArrowRight, l as TriangleAlert, lt as Circle, n as X, o as Users, ot as CreditCard, p as Store, pt as CircleAlert, s as User, u as Trash2, vt as Check, xt as ChartColumn, y as ShieldCheck, yt as CheckCheck, z as Lock } from "../_libs/lucide-react.mjs";
import { t as Separator$1 } from "../_libs/radix-ui__react-separator.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/api-client-B0uOc4Iw.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/**
* NexLock — Session Manager
*
* Centralized auth state management with:
* - Access token read/write from localStorage
* - User profile caching
* - JWT expiry parsing for proactive refresh
* - Cross-tab logout via BroadcastChannel + storage event fallback
* - Session expiry with clean redirect and user-friendly message
*/
var STORAGE_PREFIX = "nexlock:";
var AUTH_KEY = `${STORAGE_PREFIX}auth`;
var TOKEN_KEY = `${STORAGE_PREFIX}token`;
var USER_KEY = `${STORAGE_PREFIX}user`;
var API_BASE$1 = "https://nexlock-backend.onrender.com/api/v1";
var CHANNEL_NAME = "nexlock-auth";
var broadcastChannel = null;
try {
	broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
} catch {}
var refreshTimer = null;
function parseJwt(token) {
	try {
		const base64Url = token.split(".")[1];
		if (!base64Url) return null;
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		return JSON.parse(atob(base64));
	} catch {
		return null;
	}
}
function getTokenExpiry(token) {
	const payload = parseJwt(token);
	return payload?.exp ? payload.exp * 1e3 : null;
}
var session = {
	getAccessToken() {
		if (typeof window === "undefined") return null;
		return window.localStorage.getItem(TOKEN_KEY);
	},
	setAccessToken(token) {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(TOKEN_KEY, token);
		window.localStorage.setItem(AUTH_KEY, "1");
		this.scheduleProactiveRefresh(token);
	},
	getUser() {
		if (typeof window === "undefined") return null;
		try {
			const raw = window.localStorage.getItem(USER_KEY);
			const user = raw ? JSON.parse(raw) : null;
			if (!user) return null;
			const decoded = this.decodeToken();
			return {
				...user,
				id: user.id || decoded?.userId,
				userId: user.id || decoded?.userId,
				dealerId: user.dealerId || decoded?.dealerId,
				role: user.role || decoded?.role,
				permissions: user.permissions || decoded?.permissions || [],
				isStaff: user.isStaff ?? decoded?.isStaff,
				isDistributor: user.isDistributor ?? decoded?.isDistributor ?? false
			};
		} catch {
			return null;
		}
	},
	setUser(user) {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(USER_KEY, JSON.stringify(user));
	},
	isAuthenticated() {
		if (typeof window === "undefined") return false;
		if (!this.getAccessToken()) return false;
		return window.localStorage.getItem(AUTH_KEY) === "1";
	},
	decodeToken() {
		const token = this.getAccessToken();
		return token ? parseJwt(token) : null;
	},
	logout() {
		const token = this.getAccessToken();
		const isStaff = this.getUser()?.isStaff;
		fetch(`${API_BASE$1}${isStaff ? "/dealer-staff/logout" : "/auth/logout"}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...token ? { Authorization: `Bearer ${token}` } : {}
			},
			credentials: "include"
		}).catch(() => {});
		this.clearSession();
		this.broadcastLogout();
		window.location.replace(isStaff ? "/distributor-login" : "/login");
	},
	expireSession() {
		const isStaff = this.getUser()?.isStaff;
		this.clearSession();
		this.broadcastLogout();
		toast.error("Your session has expired. Please sign in again.", { duration: 5e3 });
		setTimeout(() => {
			window.location.replace(isStaff ? "/distributor-login" : "/login");
		}, 300);
	},
	clearSession() {
		if (typeof window === "undefined") return;
		this.cancelProactiveRefresh();
		window.localStorage.removeItem(AUTH_KEY);
		window.localStorage.removeItem(TOKEN_KEY);
		window.localStorage.removeItem(USER_KEY);
		window.sessionStorage.removeItem(`${STORAGE_PREFIX}pending-email`);
		window.sessionStorage.removeItem(`${STORAGE_PREFIX}pre-auth-token`);
		window.sessionStorage.removeItem(`${STORAGE_PREFIX}trust-device`);
	},
	broadcastLogout() {
		if (broadcastChannel) broadcastChannel.postMessage({ type: "logout" });
	},
	broadcastLogin() {
		if (broadcastChannel) broadcastChannel.postMessage({ type: "login" });
	},
	scheduleProactiveRefresh(token) {
		this.cancelProactiveRefresh();
		const expiry = getTokenExpiry(token);
		if (!expiry) return;
		const refreshIn = expiry - Date.now() - 12e4;
		if (refreshIn <= 0) return;
		const isStaff = parseJwt(token)?.isStaff;
		refreshTimer = setTimeout(async () => {
			try {
				const res = await fetch(`${API_BASE$1}${isStaff ? "/dealer-staff/refresh" : "/auth/refresh"}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include"
				});
				if (res.ok) {
					const data = await res.json();
					if (data.success && data.data?.accessToken) this.setAccessToken(data.data.accessToken);
				}
			} catch {}
		}, refreshIn);
	},
	cancelProactiveRefresh() {
		if (refreshTimer) {
			clearTimeout(refreshTimer);
			refreshTimer = null;
		}
	},
	init() {
		if (broadcastChannel) broadcastChannel.onmessage = (event) => {
			if (event.data?.type === "logout") {
				this.clearSession();
				toast.info("You have been signed out from another tab.");
				setTimeout(() => window.location.replace("/login"), 300);
			}
		};
		window.addEventListener("storage", (event) => {
			if (event.key === AUTH_KEY && event.newValue === null) {
				this.clearSession();
				window.location.replace("/login");
			}
		});
		const token = this.getAccessToken();
		if (token) this.scheduleProactiveRefresh(token);
	}
};
if (typeof window !== "undefined") session.init();
/**
* NexLock — Centralized API Client
*
* Features:
* - Automatic JWT attachment via Authorization header
* - HttpOnly cookie-based refresh tokens (credentials: 'include')
* - Silent 401 → refresh → retry flow
* - Request queue mutex to prevent concurrent refresh storms
* - User-friendly error messages (never raw API errors for auth failures)
*/
var API_BASE = "https://nexlock-backend.onrender.com/api/v1";
var isRefreshing = false;
var refreshQueue = [];
function processQueue(error) {
	const queue = [...refreshQueue];
	refreshQueue = [];
	queue.forEach(({ resolve, reject, retry }) => {
		if (error) reject(error);
		else retry().then(resolve).catch(reject);
	});
}
async function request(path, options = {}) {
	const token = session.getAccessToken();
	const headers = {
		"Content-Type": "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {},
		...options.headers || {}
	};
	try {
		const res = await fetch(`${API_BASE}${path}`, {
			...options,
			headers,
			credentials: "include"
		});
		if (res.status === 401 && !options._isRetry && !isAuthEndpoint(path)) return handleUnauthorized(() => request(path, {
			...options,
			_isRetry: true
		}));
		const data = await res.json();
		if (!res.ok) throw new ApiClientError(getUserFriendlyMessage(res.status, data.message), res.status, data);
		return data;
	} catch (err) {
		if (err instanceof ApiClientError) throw err;
		throw new ApiClientError("Unable to connect to the server. Please check your connection.", 0, null);
	}
}
function handleUnauthorized(retry) {
	if (isRefreshing) return new Promise((resolve, reject) => {
		refreshQueue.push({
			resolve,
			reject,
			retry
		});
	});
	isRefreshing = true;
	return new Promise((resolve, reject) => {
		refreshQueue.push({
			resolve,
			reject,
			retry
		});
		fetch(`${API_BASE}${refreshEndpoint()}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include"
		}).then(async (res) => {
			if (!res.ok) throw new Error("Refresh failed");
			const data = await res.json();
			if (data.success && data.data?.accessToken) {
				session.setAccessToken(data.data.accessToken);
				isRefreshing = false;
				processQueue(null);
			} else throw new Error("Refresh failed");
		}).catch((err) => {
			isRefreshing = false;
			session.expireSession();
			processQueue(err);
		});
	});
}
function isAuthEndpoint(path) {
	return [
		"/auth/login",
		"/auth/refresh",
		"/auth/logout",
		"/dealer-staff/login",
		"/dealer-staff/refresh",
		"/dealer-staff/logout"
	].some((ap) => path.startsWith(ap));
}
function refreshEndpoint() {
	return session.getUser()?.isStaff ? "/dealer-staff/refresh" : "/auth/refresh";
}
function getUserFriendlyMessage(status, serverMessage) {
	if (status === 401) return "Your session has expired. Please sign in again.";
	if (status === 403) return "You don't have permission to perform this action.";
	if (status === 404) return serverMessage || "The requested resource was not found.";
	if (status === 409) return serverMessage || "A conflict occurred. Please try again.";
	if (status === 422) return serverMessage || "Please check your input and try again.";
	if (status === 423) return serverMessage || "Account is temporarily locked.";
	if (status >= 500) return "Something went wrong. Please try again later.";
	return serverMessage || "An unexpected error occurred.";
}
var ApiClientError = class extends Error {
	status;
	data;
	constructor(message, status, data) {
		super(message);
		this.name = "ApiClientError";
		this.status = status;
		this.data = data;
	}
};
var apiClient = {
	get: (path, options) => request(path, {
		...options,
		method: "GET"
	}),
	post: (path, body, options) => request(path, {
		...options,
		method: "POST",
		body: body ? JSON.stringify(body) : void 0
	}),
	put: (path, body, options) => request(path, {
		...options,
		method: "PUT",
		body: body ? JSON.stringify(body) : void 0
	}),
	patch: (path, body, options) => request(path, {
		...options,
		method: "PATCH",
		body: body ? JSON.stringify(body) : void 0
	}),
	delete: (path, options) => request(path, {
		...options,
		method: "DELETE"
	})
};
// node_modules/.nitro/vite/services/ssr/assets/router-C4OGpStW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-s6YZMD_s.css";
var nexlock_logo_default = "/assets/nexlock-logo-D-35vrbC.jpeg";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function Logo({ className, showWordmark = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center gap-3", className),
		children: showWordmark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/nexus-official-logo.png",
				alt: "NEXUS",
				className: "h-10 w-auto max-w-[190px] object-contain transition-transform duration-200"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-white/70 p-1 shadow-sm backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/nexus-official-logo.png",
				alt: "NEXUS",
				className: "h-full w-auto max-w-none object-cover object-left"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" })]
			})]
		})
	});
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator$1, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Separator$1.displayName;
function NotificationDrawer() {
	const queryClient = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: unreadData } = useQuery({
		queryKey: ["notifications", "unread-count"],
		queryFn: () => apiClient.get("/notifications/unread-count"),
		refetchInterval: 15e3
	});
	const unreadCount = unreadData?.data?.count || 0;
	const { data: listData, refetch } = useQuery({
		queryKey: ["notifications", "list"],
		queryFn: () => apiClient.get("/notifications"),
		enabled: open
	});
	const notifications = listData?.data?.items || [];
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
		}
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => apiClient.delete(`/notifications/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			refetch();
		}
	});
	(0, import_react.useEffect)(() => {
		if (open) refetch();
	}, [open, refetch]);
	const groupNotifications = (items) => {
		const today = [];
		const yesterday = [];
		const earlier = [];
		const todayStr = (/* @__PURE__ */ new Date()).toDateString();
		const yesterdayDate = /* @__PURE__ */ new Date();
		yesterdayDate.setDate(yesterdayDate.getDate() - 1);
		const yesterdayStr = yesterdayDate.toDateString();
		items.forEach((item) => {
			const dStr = new Date(item.createdAt).toDateString();
			if (dStr === todayStr) today.push(item);
			else if (dStr === yesterdayStr) yesterday.push(item);
			else earlier.push(item);
		});
		return {
			today,
			yesterday,
			earlier
		};
	};
	const { today, yesterday, earlier } = groupNotifications(notifications);
	const formatTime = (dateStr) => {
		const d = new Date(dateStr);
		const diffMs = (/* @__PURE__ */ new Date()).getTime() - d.getTime();
		const diffMins = Math.floor(diffMs / 6e4);
		const diffHours = Math.floor(diffMins / 60);
		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		return d.toLocaleDateString("en-IN", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};
	const getPriorityStyle = (priority) => {
		switch (priority) {
			case "CRITICAL": return {
				bg: "bg-destructive/10 border-destructive/25 text-destructive",
				indicator: "bg-destructive",
				icon: CircleAlert
			};
			case "WARNING": return {
				bg: "bg-warning/15 border-warning/30 text-warning-foreground",
				indicator: "bg-warning",
				icon: TriangleAlert
			};
			case "SUCCESS": return {
				bg: "bg-success/15 border-success/30 text-success-foreground",
				indicator: "bg-success",
				icon: Check
			};
			default: return {
				bg: "bg-primary/10 border-primary/20 text-primary",
				indicator: "bg-primary",
				icon: Info
			};
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
	const handleItemClick = async (item) => {
		if (!item.isRead) await markReadMutation.mutateAsync(item.id);
		const meta = item.metadata;
		if (meta && meta.entityId) {
			const moduleName = String(meta.module).toLowerCase();
			if (moduleName === "loan" || moduleName === "emi") window.location.href = `/loans?search=${meta.entityId}`;
			else if (moduleName === "device") window.location.href = `/devices?search=${meta.entityId}`;
			else if (moduleName === "customer") window.location.href = `/customers?search=${meta.entityId}`;
			else if (moduleName === "dealer") window.location.href = `/dealers?search=${meta.entityId}`;
		}
	};
	const renderItem = (item) => {
		const isUnread = !item.isRead;
		const style = getPriorityStyle(item.priority);
		const CatIcon = getCategoryIcon(item.category);
		const actionLabel = item.metadata?.action;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("group relative flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:shadow-xs", isUnread ? "bg-card border-primary/30 shadow-xs" : "bg-card/60 border-border/60 hover:bg-card/90"),
			children: [
				isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute left-1.5 top-4 h-2 w-2 rounded-full", style.indicator) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", style.bg),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatIcon, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: cn("text-xs font-semibold leading-tight truncate", isUnread ? "text-foreground font-bold" : "text-foreground/80"),
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground whitespace-nowrap shrink-0",
								children: formatTime(item.createdAt)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-relaxed pr-2 line-clamp-2",
							children: item.content
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => handleItemClick(item),
								className: "h-6.5 text-[10px] px-2.5 font-medium border-border/80 hover:border-primary/40 hover:text-primary transition-colors",
								children: actionLabel || "View Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => deleteMutation.mutate(item.id),
								className: "h-6 w-6 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100",
								title: "Delete notification",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
							})]
						})
					]
				})
			]
		}, item.id);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "relative flex h-11 w-11 items-center justify-center rounded-full border border-white/90 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xs text-foreground/80 hover:bg-white hover:text-foreground hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
				"aria-label": "Open notifications",
				title: "Notifications",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-[18px] w-[18px]" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute right-2 top-2 flex h-2.5 w-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" })]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-md flex flex-col p-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-white/80 dark:border-white/15 shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
				className: "p-5 pb-4 border-b border-border/80 bg-card/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
							className: "text-sm font-bold tracking-tight text-foreground",
							children: "Activity & Alerts"
						}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary",
							children: [unreadCount, " unread"]
						})]
					}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => markAllReadMutation.mutate(),
						className: "h-7 text-xs text-muted-foreground hover:text-primary gap-1 px-2 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5" }), " Mark all read"]
					})]
				})
			}), notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col items-center justify-center p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-6 w-6 text-primary/70" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-bold text-foreground",
						children: "Everything is up to date"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed",
						children: "No unread security events, device triggers, or system alerts at this moment."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto p-5 space-y-5",
				children: [
					today.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold tracking-wider uppercase text-muted-foreground",
								children: "Today"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2.5",
							children: today.map(renderItem)
						})]
					}),
					yesterday.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold tracking-wider uppercase text-muted-foreground",
								children: "Yesterday"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2.5",
							children: yesterday.map(renderItem)
						})]
					}),
					earlier.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold tracking-wider uppercase text-muted-foreground",
								children: "Earlier"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2.5",
							children: earlier.map(renderItem)
						})]
					})
				]
			})]
		})]
	});
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
function UniversalSearch() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const [debouncedQuery, setDebouncedQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 250);
		return () => clearTimeout(handler);
	}, [query]);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
		}
		function handleKeyDown(event) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				inputRef.current?.focus();
				setIsOpen(true);
			}
			if (event.key === "Escape") {
				setIsOpen(false);
				inputRef.current?.blur();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
	const { data, isLoading } = useQuery({
		queryKey: ["universal-search", debouncedQuery],
		queryFn: () => {
			if (!debouncedQuery || debouncedQuery.trim().length < 2) return null;
			return apiClient.get(`/bi/search?q=${encodeURIComponent(debouncedQuery)}`);
		},
		enabled: debouncedQuery.trim().length >= 2
	});
	const results = data?.data || {
		dealers: [],
		customers: [],
		devices: []
	};
	const hasResults = results.dealers.length > 0 || results.customers.length > 0 || results.devices.length > 0;
	const handleItemClick = (item) => {
		setIsOpen(false);
		setQuery("");
		if (item.type === "Dealer") window.location.href = `/dealers?search=${item.subtitle}`;
		else if (item.type === "Customer") window.location.href = `/customers?search=${item.subtitle}`;
		else if (item.type === "Device") window.location.href = `/devices?search=${item.subtitle}`;
	};
	const getTypeIcon = (type) => {
		switch (type) {
			case "Dealer": return Store;
			case "Customer": return User;
			case "Loan": return CreditCard;
			default: return Smartphone;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "relative w-full max-w-md md:max-w-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative group",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80 transition-colors group-focus-within:text-primary pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					ref: inputRef,
					placeholder: "Search dealers, devices, IMEI...",
					value: query,
					onChange: (e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					},
					onFocus: () => setIsOpen(true),
					className: "h-11 pl-11 pr-16 bg-white/70 dark:bg-white/10 backdrop-blur-xl border border-white/90 dark:border-white/15 rounded-full text-xs md:text-sm text-foreground placeholder:text-muted-foreground/75 shadow-sm hover:bg-white/85 focus-visible:bg-white dark:focus-visible:bg-slate-900/90 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5",
					children: [
						query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setQuery("");
								setIsOpen(false);
							},
							className: "p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/5 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
						}),
						isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "hidden select-none items-center gap-0.5 rounded-full border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground md:inline-flex",
							children: "⌘K"
						})
					]
				})
			]
		}), isOpen && query.trim().length >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-0 right-0 top-full z-50 mt-2.5 max-h-[460px] overflow-y-auto rounded-2xl border border-white/85 dark:border-white/15 bg-white/90 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in-50 slide-in-from-top-1",
			children: isLoading && query === debouncedQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center p-6 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin text-primary" }), " Searching Nexus database…"]
			}) : !hasResults ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6 text-center text-xs text-muted-foreground",
				children: ["No matching records found for ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold text-foreground",
					children: [
						"\"",
						query,
						"\""
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-1",
				children: [
					results.dealers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
						children: [
							"Dealers (",
							results.dealers.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: results.dealers.map((item) => {
							const Icon = getTypeIcon(item.type);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: () => handleItemClick(item),
								className: "flex items-center justify-between rounded-xl p-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground truncate",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground truncate",
											children: item.subtitle
										})]
									})]
								})
							}, `dealer-${item.id}`);
						})
					})] }),
					results.customers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
						children: [
							"Customers (",
							results.customers.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: results.customers.map((item) => {
							const Icon = getTypeIcon(item.type);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: () => handleItemClick(item),
								className: "flex items-center justify-between rounded-xl p-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground truncate",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground truncate",
											children: item.subtitle
										})]
									})]
								})
							}, `cust-${item.id}`);
						})
					})] }),
					results.devices.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
						children: [
							"Devices (",
							results.devices.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-0.5",
						children: results.devices.map((item) => {
							const Icon = getTypeIcon(item.type);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: () => handleItemClick(item),
								className: "flex items-center justify-between rounded-xl p-2 text-xs hover:bg-primary/10 transition-colors cursor-pointer group",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground truncate",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground font-mono truncate",
											children: item.subtitle
										})]
									})]
								})
							}, `dev-${item.id}`);
						})
					})] })
				]
			})
		})]
	});
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var nav = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/dealers",
		label: "Dealers",
		icon: Store
	},
	{
		to: "/customers",
		label: "Customers",
		icon: Users
	},
	{
		to: "/devices",
		label: "Devices",
		icon: Smartphone
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/user-management",
		label: "Users & Roles",
		icon: ShieldCheck
	},
	{
		to: "/roles",
		label: "Access Control",
		icon: Lock
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings2
	}
];
var distributorNav = [
	{
		to: "/distributor",
		label: "My Quota & Connectors",
		icon: Network,
		exact: true
	},
	{
		to: "/distributor-analytics",
		label: "Analytics",
		icon: ChartColumn,
		exact: true
	},
	{
		to: "/distributor-billing",
		label: "Billing",
		icon: Receipt,
		exact: true
	}
];
function AppShell({ children }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [dark, setDark] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const user = session.getUser();
	const userPermissions = user?.permissions || [];
	const allowedNav = user?.isStaff ? distributorNav : nav.filter((item) => {
		if (item.to === "/dealers" && !userPermissions.includes("dealer.read")) return false;
		if (item.to === "/customers" && !userPermissions.includes("customer.read")) return false;
		if (item.to === "/devices" && !userPermissions.includes("device.read")) return false;
		if (item.to === "/analytics" && user?.role !== "Super Admin") return false;
		if (item.to === "/user-management" && !userPermissions.includes("user.read") && !userPermissions.includes("user.manage")) return false;
		if (item.to === "/roles" && !userPermissions.includes("role.read") && !userPermissions.includes("role.manage")) return false;
		if (item.to === "/settings" && !userPermissions.includes("settings.read") && !userPermissions.includes("settings.write")) return false;
		return true;
	});
	const handleLogout = () => {
		session.logout();
	};
	const toggleTheme = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-transparent text-foreground antialiased selection:bg-primary/20 selection:text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex flex-col bg-white/45 dark:bg-slate-950/70 backdrop-blur-2xl border-r border-white/75 dark:border-white/10 transition-all duration-300 ease-in-out shadow-[0_20px_50px_rgba(80,85,120,0.06)]", collapsed ? "w-[80px]" : "w-[260px]", "hidden md:flex"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-20 items-center justify-between border-b border-white/60 dark:border-white/10 px-5",
						children: [collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { showWordmark: false })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCollapsed(!collapsed),
							className: cn("rounded-xl p-1.5 text-muted-foreground/80 hover:bg-white/60 hover:text-foreground transition-colors cursor-pointer", collapsed && "hidden"),
							"aria-label": "Collapse sidebar",
							title: "Collapse sidebar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1.5 overflow-y-auto px-3.5 py-5",
						children: allowedNav.map((item) => {
							const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								title: collapsed ? item.label : void 0,
								className: cn("group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200", active ? "bg-[#E5E1FE] dark:bg-indigo-600/30 text-[#252066] dark:text-indigo-200 font-semibold shadow-xs border border-white/80 dark:border-white/15" : "text-[#555C7A] dark:text-slate-300 hover:bg-white/55 dark:hover:bg-white/10 hover:text-[#181B34] dark:hover:text-white", collapsed && "justify-center px-0 h-11 w-11 mx-auto rounded-xl"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105", active ? "text-[#4338CA] dark:text-indigo-400" : "text-[#6B7280] dark:text-slate-400 group-hover:text-[#181B34] dark:group-hover:text-white") }),
									!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 truncate tracking-tight text-[13.5px]",
										children: item.label
									}),
									active && !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[#4338CA] dark:bg-indigo-400 animate-pulse" })
								]
							}, item.to);
						})
					}),
					!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3.5 pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-2xl border border-white/80 dark:border-white/15 bg-white/60 dark:bg-white/5 p-4 shadow-sm backdrop-blur-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[12px] font-bold text-foreground tracking-tight",
										children: "Secure. Manage. Control."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground leading-relaxed mb-3",
									children: "Smarter Device Management with NexLock MDM."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/devices",
									className: "inline-flex items-center gap-1.5 rounded-full bg-[#1A1C30] dark:bg-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:bg-[#282B48] transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Learn More" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-white/60 dark:border-white/10 p-3.5 bg-white/30 dark:bg-white/5",
						children: !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl p-1.5 hover:bg-white/50 dark:hover:bg-white/10 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "h-9 w-9 ring-2 ring-white/80 dark:ring-white/10 shrink-0 shadow-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-primary/20 text-primary font-bold text-xs",
										children: (user?.name || "Somya Tiwari").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-xs font-bold text-foreground",
										children: user?.name || "Somya Tiwari"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[10px] text-muted-foreground",
										children: user?.role || "Super Admin"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleLogout,
								className: "rounded-xl p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer",
								title: "Sign out",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleLogout,
								className: "flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer",
								title: "Sign out",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCollapsed(false),
								className: "flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/60 hover:text-foreground transition-colors cursor-pointer",
								title: "Expand sidebar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
							})]
						})
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in",
				onClick: () => setMobileOpen(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-foreground md:hidden shadow-2xl animate-in slide-in-from-left duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-18 items-center justify-between border-b border-border/80 px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(false),
							className: "rounded-xl p-1.5 text-muted-foreground hover:bg-black/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1.5 overflow-y-auto p-4",
						children: allowedNav.map((item) => {
							const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: () => setMobileOpen(false),
								className: cn("flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-colors", active ? "bg-[#E5E1FE] text-[#252066] font-semibold shadow-xs" : "text-[#555C7A] hover:bg-white/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border/80 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })]
						})
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex min-h-screen flex-col transition-all duration-300 ease-in-out", collapsed ? "md:pl-[80px]" : "md:pl-[260px]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-20 items-center justify-between gap-4 px-5 md:px-8 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-full h-11 w-11 flex items-center justify-center border border-white/80 bg-white/70 backdrop-blur-xl text-muted-foreground hover:bg-white md:hidden",
							onClick: () => setMobileOpen(true),
							"aria-label": "Open navigation menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UniversalSearch, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationDrawer, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "h-11 w-11 flex items-center justify-center rounded-full border border-white/90 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xs text-foreground/80 hover:bg-white hover:text-foreground hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
								onClick: toggleTheme,
								title: dark ? "Switch to light mode" : "Switch to dark mode",
								children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4.5 w-4.5 text-amber-400 transition-transform hover:rotate-45" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4.5 w-4.5 text-slate-700 transition-transform hover:-rotate-12" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-3 h-11 pl-1.5 pr-4 rounded-full border border-white/90 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xs hover:bg-white dark:hover:bg-white/20 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
											className: "h-8 w-8 ring-2 ring-white/90 dark:ring-white/20 shadow-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
												className: "bg-primary/20 text-primary text-xs font-bold",
												children: (user?.name || "Somya Tiwari").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hidden text-left sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs font-bold leading-tight text-foreground",
												children: user?.name || "Somya Tiwari"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] leading-tight text-muted-foreground",
												children: user?.role || "Super Admin"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" })
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56 rounded-2xl border border-white/80 dark:border-white/15 bg-white/90 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
										className: "font-normal px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold leading-none",
												children: user?.name || "Somya Tiwari"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs leading-none text-muted-foreground",
												children: user?.email || "admin@nexus.io"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/profile",
											className: "w-full cursor-pointer rounded-xl font-medium px-3 py-2",
											children: "Profile & Security"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/settings",
											className: "w-full cursor-pointer rounded-xl font-medium px-3 py-2",
											children: "Platform Settings"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										className: "text-destructive font-medium cursor-pointer rounded-xl px-3 py-2 focus:bg-destructive/10 focus:text-destructive",
										onClick: handleLogout,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"]
									})
								]
							})] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-5 md:p-8 animate-fade-up max-w-[1600px] w-full mx-auto",
					children
				})]
			})
		]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface max-w-md p-8 text-center animate-fade-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-7 w-7 text-primary" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-extrabold tracking-tight text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-lg font-semibold text-foreground",
					children: "Page Not Found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The console endpoint or resource you requested cannot be located."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all",
						children: "Return to Dashboard"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "card-surface max-w-md p-8 text-center animate-fade-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold text-foreground",
					children: "Unable to Load View"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "An unexpected runtime issue occurred. Please retry or contact support if the issue persists."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), " Try again"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-all",
						children: "Home"
					})]
				})
			]
		})
	});
}
var Route$17 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Nexus — Enterprise Device Financing Admin" },
			{
				name: "description",
				content: "Nexus administrator console for Android device financing, EMI collections and device security."
			},
			{
				property: "og:title",
				content: "Nexus — Enterprise Device Financing Admin"
			},
			{
				name: "twitter:title",
				content: "Nexus — Enterprise Device Financing Admin"
			},
			{
				property: "og:description",
				content: "Nexus administrator console for Android device financing, EMI collections and device security."
			},
			{
				name: "twitter:description",
				content: "Nexus administrator console for Android device financing, EMI collections and device security."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da6efa99-dcb5-4aec-b4ed-59ad822296cc/id-preview-ede2b605--35028105-fc3e-4849-a6ed-2a01a91ed75a.lovable.app-1782847687941.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da6efa99-dcb5-4aec-b4ed-59ad822296cc/id-preview-ede2b605--35028105-fc3e-4849-a6ed-2a01a91ed75a.lovable.app-1782847687941.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [
			{
				rel: "shortcut icon",
				href: nexlock_logo_default
			},
			{
				rel: "icon",
				type: "image/jpeg",
				href: nexlock_logo_default
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$17.useRouteContext();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [pathname === "/login" || pathname === "/distributor-login" || pathname === "/privacy" || pathname === "/terms" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-right" })]
	});
}
function AuthGate({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (!session.isAuthenticated()) {
			window.location.replace("/login");
			return;
		}
		if (session.getUser()?.isStaff && !pathname.startsWith("/distributor")) {
			window.location.replace("/distributor");
			return;
		}
		setReady(true);
	}, [pathname]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex h-16 w-16 items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6 text-primary" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs font-medium tracking-wide uppercase text-muted-foreground animate-pulse",
			children: "Initializing Nexus Console…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var $$splitComponentImporter$16 = () => import("./routes-D9VD2leT.mjs");
var Route$16 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Operations Dashboard — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./analytics-Cmi_kNUo.mjs");
var Route$15 = createFileRoute("/analytics")({
	head: () => ({ meta: [{ title: "Analytics & Trends — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./customers-DNzV88wN.mjs");
var Route$14 = createFileRoute("/customers")({
	head: () => ({ meta: [{ title: "Customers — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./dealers-BNG6xaQx.mjs");
var Route$13 = createFileRoute("/dealers")({
	head: () => ({ meta: [{ title: "Dealers — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./devices-B8XfpaZm.mjs");
var Route$12 = createFileRoute("/devices")({
	head: () => ({ meta: [{ title: "Devices — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./distributor-PUxT67TK.mjs");
var Route$11 = createFileRoute("/distributor")({
	head: () => ({ meta: [{ title: "Distributor Portal — NexLock" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./distributor-analytics-3t0ChqOQ.mjs");
var Route$10 = createFileRoute("/distributor-analytics")({
	head: () => ({ meta: [{ title: "Analytics — Distributor Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./distributor-billing-CVeSymno.mjs");
var Route$9 = createFileRoute("/distributor-billing")({
	head: () => ({ meta: [{ title: "Billing — Distributor Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./distributor-login-CcWvsUDv.mjs");
var Route$8 = createFileRoute("/distributor-login")({
	head: () => ({ meta: [{ title: "Distributor Portal Sign In — Nexus" }, {
		name: "description",
		content: "Sign in to manage your quota pool, connector dealers, and device enrollments."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./login-CGdjiaod.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — Nexus Admin Console" }, {
		name: "description",
		content: "Secure administrator sign in for the Nexus enterprise device financing and lock management console."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./notifications-CmvXoZ4i.mjs");
var Route$6 = createFileRoute("/notifications")({
	head: () => ({ meta: [{ title: "Notifications & Alerts — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./privacy-1e4Y5ujp.mjs");
var Route$5 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Privacy Policy — Nexus" }, {
		name: "description",
		content: "How Nexus collects and uses information from financed devices and dealer accounts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./profile-BXQwcvzB.mjs");
var Route$4 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "My Profile — NexLock Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./roles-CZMky3Ck.mjs");
var Route$3 = createFileRoute("/roles")({
	head: () => ({ meta: [{ title: "Roles & Permissions — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./settings-t8zjUMuW.mjs");
var Route$2 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Platform Settings — NexLock Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./terms-DlkTmqnn.mjs");
var Route$1 = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "Terms & Conditions — Nexus" }, {
		name: "description",
		content: "The terms that apply to devices enrolled in the Nexus Device Protection Program and to dealer accounts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./user-management-snOXrp0m.mjs");
var Route = createFileRoute("/user-management")({
	head: () => ({ meta: [{ title: "User Management — Nexus Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$16.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$17
	}),
	AnalyticsRoute: Route$15.update({
		id: "/analytics",
		path: "/analytics",
		getParentRoute: () => Route$17
	}),
	CustomersRoute: Route$14.update({
		id: "/customers",
		path: "/customers",
		getParentRoute: () => Route$17
	}),
	DealersRoute: Route$13.update({
		id: "/dealers",
		path: "/dealers",
		getParentRoute: () => Route$17
	}),
	DevicesRoute: Route$12.update({
		id: "/devices",
		path: "/devices",
		getParentRoute: () => Route$17
	}),
	DistributorRoute: Route$11.update({
		id: "/distributor",
		path: "/distributor",
		getParentRoute: () => Route$17
	}),
	DistributorAnalyticsRoute: Route$10.update({
		id: "/distributor-analytics",
		path: "/distributor-analytics",
		getParentRoute: () => Route$17
	}),
	DistributorBillingRoute: Route$9.update({
		id: "/distributor-billing",
		path: "/distributor-billing",
		getParentRoute: () => Route$17
	}),
	DistributorLoginRoute: Route$8.update({
		id: "/distributor-login",
		path: "/distributor-login",
		getParentRoute: () => Route$17
	}),
	LoginRoute: Route$7.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$17
	}),
	NotificationsRoute: Route$6.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => Route$17
	}),
	PrivacyRoute: Route$5.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$17
	}),
	ProfileRoute: Route$4.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$17
	}),
	RolesRoute: Route$3.update({
		id: "/roles",
		path: "/roles",
		getParentRoute: () => Route$17
	}),
	SettingsRoute: Route$2.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$17
	}),
	TermsRoute: Route$1.update({
		id: "/terms",
		path: "/terms",
		getParentRoute: () => Route$17
	}),
	UserManagementRoute: Route.update({
		id: "/user-management",
		path: "/user-management",
		getParentRoute: () => Route$17
	})
};
var routeTree = Route$17._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
export { DropdownMenuSeparator as a, AvatarFallback as c, buttonVariants as d, Logo as f, session as h, DropdownMenuItem as i, Input as l, cn as m, DropdownMenu as n, DropdownMenuTrigger as o, apiClient as p, DropdownMenuContent as r, Avatar as s, router_exports as t, Button as u };
