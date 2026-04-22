import { QueryClient } from "@tanstack/react-query";
import { LIVE_QUERY_INTERVAL, LIVE_QUERY_STALE_TIME } from "@/lib/liveQuery";

let csrfTokenCache = null;

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function readJsonResponse(response, fallbackMessage = "Request failed") {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }
  return payload;
}

async function getCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;

  const res = await fetch("/api/auth/csrf-token", { credentials: "include" });
  if (!res.ok) return null;
  const payload = await res.json().catch(() => null);
  csrfTokenCache = payload?.csrfToken || null;
  return csrfTokenCache;
}

export function updateCsrfToken(token) {
  csrfTokenCache = token || null;
}

export async function apiRequest(method, url, data) {
  const headers = data ? { "Content-Type": "application/json" } : {};
  if (!["GET", "HEAD", "OPTIONS"].includes(String(method).toUpperCase())) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) {
      headers["x-csrf-token"] = csrfToken;
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    csrfTokenCache = null;
  }

  await throwIfResNotOk(res);
  return res;
}

export async function fetchJson(url, fallbackMessage = "Failed to load data") {
  const response = await fetch(url, { credentials: "include" });
  return readJsonResponse(response, fallbackMessage);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url] = queryKey;
        const res = await fetch(url, { credentials: "include" });

        if (res.status === 401) {
          return null;
        }

        await throwIfResNotOk(res);
        const payload = await res.json();
        if (url === "/api/auth/me" && payload?.csrfToken) {
          updateCsrfToken(payload.csrfToken);
        }
        return payload;
      },
      staleTime: LIVE_QUERY_STALE_TIME,
      gcTime: 10 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchIntervalInBackground: true,
      refetchInterval: (query) => (query.meta?.live === false ? false : LIVE_QUERY_INTERVAL),
      placeholderData: (previousData) => previousData,
    },
    mutations: {
      retry: false,
    },
  },
});
