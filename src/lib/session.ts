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

import { toast } from "sonner";

const STORAGE_PREFIX = "nexlock:";
const AUTH_KEY = `${STORAGE_PREFIX}auth`;
const TOKEN_KEY = `${STORAGE_PREFIX}token`;
const USER_KEY = `${STORAGE_PREFIX}user`;

const API_BASE = import.meta.env.VITE_API_URL || "https://nexlock-backend.onrender.com/api/v1";

// BroadcastChannel for cross-tab sync (with fallback)
const CHANNEL_NAME = "nexlock-auth";
let broadcastChannel: BroadcastChannel | null = null;

try {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
} catch {
  // BroadcastChannel not supported — fall back to storage events
}

// Proactive refresh timer
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

// ---------- JWT helpers ----------

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function getTokenExpiry(token: string): number | null {
  const payload = parseJwt(token);
  return payload?.exp ? payload.exp * 1000 : null; // Convert to ms
}

// ---------- Session manager ----------

export const session = {
  // ---- Access Token ----
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  setAccessToken(token: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(AUTH_KEY, "1");
    this.scheduleProactiveRefresh(token);
  },

  // ---- User Profile ----
  getUser(): any | null {
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
        // Only ever present for a DealerStaff login (see dealer-staff.service.ts's JWT payload)
        // — undefined for a normal admin User session, so `!!isStaff` cleanly distinguishes them.
        isStaff: user.isStaff ?? decoded?.isStaff,
        isDistributor: user.isDistributor ?? decoded?.isDistributor ?? false,
      };
    } catch {
      return null;
    }
  },

  setUser(user: any) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // ---- Auth State ----
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = this.getAccessToken();
    if (!token) return false;
    // Even if the access token is expired, we might still be able to refresh
    // So just check that a token exists and the auth flag is set
    return window.localStorage.getItem(AUTH_KEY) === "1";
  },

  // ---- Decode JWT for components ----
  decodeToken(): any | null {
    const token = this.getAccessToken();
    return token ? parseJwt(token) : null;
  },

  // ---- Logout ----
  logout() {
    // Call logout endpoint (fire-and-forget) — a distributor (DealerStaff login) has its own
    // logout endpoint and cookie, same reasoning as the refresh split below.
    const token = this.getAccessToken();
    const isStaff = this.getUser()?.isStaff;
    fetch(`${API_BASE}${isStaff ? "/dealer-staff/logout" : "/auth/logout"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    }).catch(() => {});

    this.clearSession();
    this.broadcastLogout();
    window.location.replace(isStaff ? "/distributor-login" : "/login");
  },

  // ---- Session Expiry (forced by refresh failure) ----
  expireSession() {
    const isStaff = this.getUser()?.isStaff;
    this.clearSession();
    this.broadcastLogout();
    toast.error("Your session has expired. Please sign in again.", {
      duration: 5000,
    });
    // Small delay to allow the toast to render
    setTimeout(() => {
      window.location.replace(isStaff ? "/distributor-login" : "/login");
    }, 300);
  },

  // ---- Clear all auth state ----
  clearSession() {
    if (typeof window === "undefined") return;
    this.cancelProactiveRefresh();
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    // Clear any session storage auth artifacts
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}pending-email`);
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}pre-auth-token`);
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}trust-device`);
  },

  // ---- Cross-tab broadcast ----
  broadcastLogout() {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "logout" });
    }
  },

  broadcastLogin() {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: "login" });
    }
  },

  // ---- Proactive Refresh ----
  scheduleProactiveRefresh(token: string) {
    this.cancelProactiveRefresh();
    const expiry = getTokenExpiry(token);
    if (!expiry) return;

    // Refresh 2 minutes before expiry
    const refreshIn = expiry - Date.now() - 2 * 60 * 1000;
    if (refreshIn <= 0) return; // Already close to or past expiry

    // Decoded from the token being scheduled, not this.getUser() — this can run for a token
    // that hasn't been paired with a setUser() call yet, and a distributor's refresh cookie
    // (dealerRefreshToken) is only accepted by the dealer-staff endpoint, not the admin one.
    const isStaff = parseJwt(token)?.isStaff;
    refreshTimer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}${isStaff ? "/dealer-staff/refresh" : "/auth/refresh"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data?.accessToken) {
            this.setAccessToken(data.data.accessToken); // This re-schedules the next refresh
          }
        }
      } catch {
        // Proactive refresh failed silently — the interceptor will handle on next request
      }
    }, refreshIn);
  },

  cancelProactiveRefresh() {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  },

  // ---- Initialize listeners ----
  init() {
    // Cross-tab BroadcastChannel listener
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        if (event.data?.type === "logout") {
          this.clearSession();
          toast.info("You have been signed out from another tab.");
          setTimeout(() => window.location.replace("/login"), 300);
        }
      };
    }

    // Fallback: storage event listener for cross-tab sync
    window.addEventListener("storage", (event) => {
      if (event.key === AUTH_KEY && event.newValue === null) {
        // Auth flag was removed in another tab
        this.clearSession();
        window.location.replace("/login");
      }
    });

    // Schedule proactive refresh if a token already exists
    const token = this.getAccessToken();
    if (token) {
      this.scheduleProactiveRefresh(token);
    }
  },
};

// Auto-initialize when module loads in the browser
if (typeof window !== "undefined") {
  session.init();
}
