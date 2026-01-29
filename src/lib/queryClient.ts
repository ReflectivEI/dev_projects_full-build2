// ⚠️ PLATFORM CONTRACT — DO NOT MODIFY WITHOUT API VERSIONING
// API base is driven by VITE_WORKER_URL and contracts must match cloudflare-worker-api.md.
// Last updated: 2026-01-02T02:15:00Z - Force browser cache refresh
import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { isMockApiEnabled, mockApiRequest, getMockSessionId } from "./mockApi";

// Get the API base URL from highest-priority runtime sources.
// Production priority: window.WORKER_URL (runtime override) -> VITE_WORKER_URL (build-time) -> VITE_API_BASE_URL -> fallback.
// Development is deterministic via Vite proxy rules (see vite.config.ts), so the browser always calls same-origin `/api/*`.
const RUNTIME_BASE =
  typeof window !== "undefined" && (window as any)?.WORKER_URL
    ? (window as any).WORKER_URL
    : undefined;

// ALWAYS use the worker URL (even in dev mode) since we don't have a local backend
const API_BASE_URL =
  RUNTIME_BASE ||
  import.meta.env.VITE_WORKER_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev";

// Debug: Log the API base URL (FORCE REFRESH v2)
console.log('🔧 [QueryClient] API_BASE_URL:', API_BASE_URL);
console.log('🔧 [QueryClient] import.meta.env.DEV:', import.meta.env.DEV);
console.log('🔧 [QueryClient] import.meta.env.VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 [QueryClient] RUNTIME_BASE:', RUNTIME_BASE);
console.log('🔧 [QueryClient] Cache buster: 2026-01-02T02:15:00Z');

// Persist and forward session ids so the worker keeps a stable conversation session.
const SESSION_STORAGE_KEY = "reflectivai-session-id";
export const SESSION_ID_EVENT = "reflectivai:session-id";
let SESSION_ID: string | undefined =
  typeof window !== "undefined"
    ? window.localStorage.getItem(SESSION_STORAGE_KEY) || undefined
    : undefined;

let sessionInitPromise: Promise<string> | null = null;

export function getSessionId(): string | undefined {
  if (isMockApiEnabled()) {
    return getMockSessionId();
  }
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
    console.log('[buildUrl] No API_BASE_URL, returning path as-is:', path);
    return path;
  }
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${base}${cleanPath}`;
  console.log('[buildUrl] Built URL:', fullUrl, 'from path:', path);
  return fullUrl;
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
  // Use mock API on GitHub Pages
  if (isMockApiEnabled()) {
    const mockRes = await mockApiRequest(method, url, data);
    return new Response(JSON.stringify(mockRes.data), {
      status: mockRes.status,
      headers: mockRes.headers
    });
  }

  if (!getSessionId()) {
    await ensureSessionId();
  }
  const fullUrl = buildUrl(url);
  const isExternalApi = !!API_BASE_URL;

  const res = await fetch(fullUrl, {
    method,
    headers: getHeaders(!!data),
    body: data ? JSON.stringify(data) : undefined,
    // Only include credentials for same-origin requests (not for external APIs)
    credentials: isExternalApi ? "omit" : "include",
  });

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
      const path = queryKey.join("/") as string;
      console.log('🔍 [getQueryFn] Executing query for path:', path);

      // Use mock API on GitHub Pages
      if (isMockApiEnabled()) {
        console.log('🔍 [getQueryFn] Using mock API');
        const mockRes = await mockApiRequest('GET', path);
        return mockRes.data;
      }
      console.log('🔍 [getQueryFn] Using real API, calling buildUrl...');

      if (!getSessionId()) {
        await ensureSessionId();
      }
      const fullUrl = buildUrl(path);
      const isExternalApi = !!API_BASE_URL;
      console.log('🔍 [getQueryFn] About to fetch:', fullUrl);

      console.log('🚨 [getQueryFn] BEFORE FETCH - URL:', fullUrl);
      console.log('🚨 [getQueryFn] BEFORE FETCH - Headers:', getHeaders(false));
      console.log('🚨 [getQueryFn] BEFORE FETCH - Credentials:', isExternalApi ? "omit" : "include");
      
      const res = await fetch(fullUrl, {
        headers: getHeaders(false),
        credentials: isExternalApi ? "omit" : "include",
      });
      
      console.log('🚨 [getQueryFn] AFTER FETCH - Status:', res.status);
      console.log('🚨 [getQueryFn] AFTER FETCH - URL:', res.url);
      console.log('🚨 [getQueryFn] AFTER FETCH - OK:', res.ok);

      const nextSession = res.headers.get("x-session-id");
      setSessionId(nextSession);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const jsonData = await res.json();
      console.log('🚨 [getQueryFn] Response JSON:', jsonData);
      return jsonData;
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
