import { QueryClient } from "@tanstack/react-query";
import { LIVE_QUERY_INTERVAL, LIVE_QUERY_STALE_TIME } from "@/lib/liveQuery";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method, url, data) {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
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
        return res.json();
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
