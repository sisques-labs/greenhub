import { useQuery } from "@tanstack/react-query";
import { locationsApiClient } from "../../api/locations-api.client";

/**
 * Hook that fetches all locations without pagination
 * Useful for dropdowns and selectors
 * Uses TanStack Query instead of SDK
 */
export function useLocationsList() {
  const query = useQuery({
    queryKey: ["locations", "list", { page: 1, perPage: 1000 }],
    queryFn: () => locationsApiClient.findByCriteria({ page: 1, perPage: 1000 }),
  });

  return {
    locations: query.data?.items || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
