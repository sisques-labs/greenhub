import { useQuery } from "@tanstack/react-query";
import { locationsApiClient } from "../../api/locations-api.client";
import type { LocationFindByCriteriaInput } from "../../api/types";

/**
 * Hook that provides locations find by criteria functionality using TanStack Query
 * Replaces SDK's useLocations().findByCriteria with API client
 */
export function useLocationsFindByCriteria(
  input?: LocationFindByCriteriaInput,
  options?: { enabled?: boolean }
) {
  const query = useQuery({
    queryKey: ["locations", "list", input],
    queryFn: () => locationsApiClient.findByCriteria(input),
    enabled: options?.enabled !== false,
  });

  return {
    locations: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
