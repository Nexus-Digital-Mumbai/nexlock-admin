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

import { session } from "./session";

const API_BASE = import.meta.env.VITE_API_URL || "https://nexlock-backend.onrender.com/api/v1";

// ---------- Refresh mutex ----------

type QueuedRequest = {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  retry: () => Promise<any>;
};

let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

function processQueue(error: Error | null) {
  const queue = [...refreshQueue];
  refreshQueue = [];
  queue.forEach(({ resolve, reject, retry }) => {
    if (error) {
      reject(error);
    } else {
      retry().then(resolve).catch(reject);
    }
  });
}

// ---------- Core request function ----------

async function request<T = any>(
  path: string,
  options: RequestInit & { _isRetry?: boolean } = {}
): Promise<T> {
  const token = session.getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: "include", // Send HttpOnly cookies
    });

    // Handle 401 — attempt silent refresh (but not on auth endpoints)
    if (res.status === 401 && !options._isRetry && !isAuthEndpoint(path)) {
      return handleUnauthorized(() => request<T>(path, { ...options, _isRetry: true }));
    }

    const data = await res.json();

    if (!res.ok) {
      // Map error responses to user-friendly messages
      throw new ApiClientError(
        getUserFriendlyMessage(res.status, data.message),
        res.status,
        data
      );
    }

    return data;
  } catch (err) {
    if (err instanceof ApiClientError) {
      throw err;
    }
    // Network-level errors
    throw new ApiClientError(
      "Unable to connect to the server. Please check your connection.",
      0,
      null
    );
  }
}

// ---------- Silent refresh handler ----------

function handleUnauthorized<T>(retry: () => Promise<T>): Promise<T> {
  if (isRefreshing) {
    // Queue this request until the in-flight refresh completes
    return new Promise<T>((resolve, reject) => {
      refreshQueue.push({ resolve, reject, retry });
    });
  }

  isRefreshing = true;

  return new Promise<T>((resolve, reject) => {
    refreshQueue.push({ resolve, reject, retry });

    // Perform the refresh — a distributor session (DealerStaff login, session.isStaff) carries a
    // differently-named refresh cookie (dealerRefreshToken, not refreshToken) verified by a
    // different endpoint, so it must not hit the admin User's /auth/refresh at all.
    fetch(`${API_BASE}${refreshEndpoint()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Send the HttpOnly refresh token cookie
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Refresh failed");
        }
        const data = await res.json();
        if (data.success && data.data?.accessToken) {
          session.setAccessToken(data.data.accessToken);
          isRefreshing = false;
          processQueue(null);
        } else {
          throw new Error("Refresh failed");
        }
      })
      .catch((err) => {
        isRefreshing = false;
        session.expireSession();
        processQueue(err);
      });
  });
}

// ---------- Helpers ----------

function isAuthEndpoint(path: string): boolean {
  const authPaths = ["/auth/login", "/auth/refresh", "/auth/logout", "/dealer-staff/login", "/dealer-staff/refresh", "/dealer-staff/logout"];
  return authPaths.some((ap) => path.startsWith(ap));
}

function refreshEndpoint(): string {
  return session.getUser()?.isStaff ? "/dealer-staff/refresh" : "/auth/refresh";
}

function getUserFriendlyMessage(status: number, serverMessage?: string): string {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return serverMessage || "The requested resource was not found.";
  if (status === 409) return serverMessage || "A conflict occurred. Please try again.";
  if (status === 422) return serverMessage || "Please check your input and try again.";
  if (status === 423) return serverMessage || "Account is temporarily locked.";
  if (status >= 500) return "Something went wrong. Please try again later.";
  // For 4xx — use server message if available, otherwise generic
  return serverMessage || "An unexpected error occurred.";
}

// ---------- Custom error class ----------

export class ApiClientError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.data = data;
  }
}

// ---------- Public API ----------

export const apiClient = {
  get: <T = any>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T = any>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),

  put: <T = any>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),

  patch: <T = any>(path: string, body?: any, options?: RequestInit) =>
    request<T>(path, { ...options, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),

  delete: <T = any>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
