// ⚠️ PLATFORM CONTRACT — DO NOT MODIFY WITHOUT API VERSIONING
// API base is driven by VITE_WORKER_URL and contracts must match cloudflare-worker-api.md.
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// CRITICAL: Vite's dead code elimination is too aggressive
// We MUST use a pattern that survives minification and tree-shaking
// Using globalThis prevents Vite from inlining or removing this code
const getWorkerUrl = () => {
  if (typeof globalThis !== 'undefined' && (globalThis as any).WORKER_URL) {
    return (globalThis as any).WORKER_URL;
  }
  if (typeof window !== 'undefined' && (window as any).WORKER_URL) {
    return (window as any).WORKER_URL;
  }
  return null;
};

// Force runtime evaluation by using a dynamic property access
const API_BASE_URL = (() => {
  // Development: use Vite proxy
  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log('[queryClient] DEV mode - using proxy');
    return undefined;
  }
  
  // Production: check runtime first
  const runtimeUrl = getWorkerUrl();
  if (runtimeUrl) {
    console.log('[queryClient] Using runtime WORKER_URL:', runtimeUrl);
    return runtimeUrl;
  }
  
  // Fallback to hardcoded URL
  const fallback = 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev';
  console.log('[queryClient] Using fallback URL:', fallback);
  return fallback;
})();

console.log('[queryClient] Final API_BASE_URL:', API_BASE_URL);

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

async function ensureSessionId(): Promise<string> {
  if (SESSION_ID) return SESSION_ID;
  if (sessionInitPromise) return sessionInitPromise;

  sessionInitPromise = (async () => {
    try {
      const res = await fetch(buildUrl("/api/session/init"), {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("session_init_failed");
      const data = await res.json();
      setSessionId(data.sessionId);
      return data.sessionId;
    } catch (err) {
      sessionInitPromise = null;
      throw err;
    }
  })();

  return sessionInitPromise;
}

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
  if (SESSION_ID) {
    headers["x-session-id"] = SESSION_ID;
  }
  return headers;
}

export async function ln(
  method: string,
  path: string,
  data?: any
): Promise<Response> {
  await ensureSessionId();
  const fullUrl = buildUrl(path);
  const isExternalApi = !!API_BASE_URL;

  const res = await fetch(fullUrl, {
    method,
    headers: getHeaders(!!data),
    body: data ? JSON.stringify(data) : undefined,
    credentials: isExternalApi ? "omit" : "include",
  });

  const newSessionId = res.headers.get("x-session-id");
  if (newSessionId) {
    setSessionId(newSessionId);
  }

  return res;
}

const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  await ensureSessionId();
  const path = Array.isArray(queryKey) ? queryKey[0] : queryKey;
  if (typeof path !== "string") {
    throw new Error("Query key must be a string or start with a string");
  }

  const fullUrl = buildUrl(path);
  const isExternalApi = !!API_BASE_URL;

  const res = await fetch(fullUrl, {
    headers: getHeaders(false),
    credentials: isExternalApi ? "omit" : "include",
  });

  const newSessionId = res.headers.get("x-session-id");
  if (newSessionId) {
    setSessionId(newSessionId);
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 10,
      retry: 1,
    },
  },
});

export function getQueryClientConfig() {
  return {
    baseUrl: API_BASE_URL || "(using local backend)",
  };
}
