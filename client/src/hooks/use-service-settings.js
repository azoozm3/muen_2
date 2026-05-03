import { useQuery } from "@tanstack/react-query";
import { liveQueryOptions } from "@/lib/liveQuery";

export function useServiceSettings() {
  return useQuery({
    queryKey: ["/api/service-settings"],
    ...liveQueryOptions(),
  });
}
