export const LIVE_QUERY_INTERVAL = 10000;
export const LIVE_QUERY_STALE_TIME = 5000;

export function liveQueryOptions(overrides = {}) {
  return {
    staleTime: LIVE_QUERY_STALE_TIME,
    refetchInterval: LIVE_QUERY_INTERVAL,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    placeholderData: (previousData) => previousData,
    ...overrides,
  };
}

export function staticQueryOptions(overrides = {}) {
  return {
    meta: { live: false, ...(overrides.meta || {}) },
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    ...overrides,
  };
}
