// ⚠️ PLATFORM CONTRACT — DO NOT MODIFY WITHOUT API VERSIONING
// API base is driven by VITE_WORKER_URL and contracts must match cloudflare-worker-api.md.
import { QueryClient, QueryFunction } from "@tanstack/react-query";


// DEBUG: Check if window.WORKER_URL is being read
if (typeof window !== "undefined") {
  console.log("[ReflectivAI] window.WORKER_URL =", (window as any)?.WORKER_URL);
}
// Get the API base URL from highest-priority runtime sources.
// Production priority: window.WORKER_URL (runtime override) -> VITE_WORKER_URL (build-time) -> VITE_API_BASE_URL -> fallback.
// Development is deterministic via Vite proxy rules (see vite.config.ts), so the browser always calls same-origin `/api/*`.
const RUNTIME_BASE =
  typeof window !== "undefined" && (window as any)?.WORKER_URL
    ? (window as any).WORKER_URL
    : undefined;

const API_BASE_URL = import.meta.env.DEV
  ? undefined
  : (
      RUNTIME_BASE ||
      import.meta.env.VITE_WORKER_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev"
    );

// P0 DIAGNOSTIC: Production environment check
if (!import.meta.env.DEV) {
  console.log("[P0 ENV] 🔍 Environment Variables:");
  console.log("  - MODE:", import.meta.env.MODE);
  console.log("  - DEV:", import.meta.env.DEV);
  console.log("  - PROD:", import.meta.env.PROD);
  console.log("  - VITE_WORKER_URL:", import.meta.env.VITE_WORKER_URL || "❌ NOT SET");
  console.log("  - VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL || "❌ NOT SET");
  console.log("  - window.WORKER_URL:", RUNTIME_BASE || "❌ NOT SET");
  console.log("[P0 ENV] 🎯 Resolved Configuration:");
  console.log("  - Final API_BASE_URL:", API_BASE_URL || "(using local /api)");
  console.log("  - Sample URL:", buildUrl("/api/health"));
  console.log("  - isExternalApi:", !!API_BASE_URL);
}

console.log("[ReflectivAI] Final API_BASE_URL:", API_BASE_URL);

// Persist and forward session ids so the worker keeps a stable conversation session.
const SESSION_STORAGE_KEY = "reflectivai-session-id";
export const SESSION_ID_EVENT = "reflectivai:session-id";
let SESSION_ID: string | undefined =
  typeof window !== "undefined"
    ? window.localStorage.getItem(SESSION_STORAGE_KEY) || undefined
    : undefined;

let sessionInitPromise: Promise<string> | null = null;

export function getSessionId(): string | undefined {
  return SESSION_ID;
}

function setSessionId(next?: string | null) {
  if (!next) return;
  if (SESSION_ID) return;
  SESSION_ID = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SESSION_STORAGE_KEY, next);
    window.dispatchEvent(new Event(SESSION_ID_EVENT));
  }
}

async function ensureSessionId(): Promise<string | null> {
  if (SESSION_ID) return SESSION_ID;
  if (typeof window === "undefined") return null;

  if (!sessionInitPromise) {
    sessionInitPromise = (async () => {
      const fullUrl = buildUrl("/health");
      const isExternalApi = !!API_BASE_URL;

      const res = await fetch(fullUrl, {
        method: "GET",
        headers: getHeaders(false),
        credentials: isExternalApi ? "omit" : "include",
      });

      const nextSession = res.headers.get("x-session-id");
      if (!nextSession) {
        throw new Error("Missing x-session-id from session init response");
      }

      setSessionId(nextSession);
      return nextSession;
    })().finally(() => {
      sessionInitPromise = null;
    });
  }

  try {
    return await sessionInitPromise;
  } catch {
    return null;
  }
}

// Get optional API key for external backends that require authentication
const API_KEY = import.meta.env.VITE_API_KEY || "";

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

function getHeaders(includeContentType: boolean = false): HeadersInit {
  const headers: HeadersInit = {};

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  const sessionId = getSessionId();
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  // Add API key header if configured (for external backends like Cloudflare Workers)
  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }

  return headers;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (!getSessionId()) {
    await ensureSessionId();
  }
  const fullUrl = buildUrl(url);
  const isExternalApi = !!API_BASE_URL;

  // P0 DIAGNOSTIC: Log every API request in production
  if (!import.meta.env.DEV) {
    console.log(`[P0 API] ${method} ${fullUrl}`);
    console.log(`[P0 API] isExternalApi:`, isExternalApi);
    console.log(`[P0 API] credentials:`, isExternalApi ? "omit" : "include");
  }

  const res = await fetch(fullUrl, {
    method,
    headers: getHeaders(!!data),
    body: data ? JSON.stringify(data) : undefined,
    // Only include credentials for same-origin requests (not for external APIs)
    credentials: isExternalApi ? "omit" : "include",
  });

  // P0 DIAGNOSTIC: Log response details
  if (!import.meta.env.DEV) {
    console.log(`[P0 API] Response status:`, res.status, res.statusText);
    console.log(`[P0 API] Response headers:`, Object.fromEntries(res.headers.entries()));
    // Clone response to read body without consuming it
    const clonedRes = res.clone();
    const bodyText = await clonedRes.text();
    console.log(`[P0 API] Response body (first 500 chars):`, bodyText.substring(0, 500));
  }

  const nextSession = res.headers.get("x-session-id");
  setSessionId(nextSession);

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      if (!getSessionId()) {
        await ensureSessionId();
      }
      const path = queryKey.join("/") as string;
      const fullUrl = buildUrl(path);
      const isExternalApi = !!API_BASE_URL;

      const res = await fetch(fullUrl, {
        headers: getHeaders(false),
        credentials: isExternalApi ? "omit" : "include",
      });

      const nextSession = res.headers.get("x-session-id");
      setSessionId(nextSession);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Export for debugging/status checking
export function getApiConfig() {
  return {
    baseUrl: API_BASE_URL || "(using local backend)",
    hasApiKey: !!API_KEY,
  };
}
