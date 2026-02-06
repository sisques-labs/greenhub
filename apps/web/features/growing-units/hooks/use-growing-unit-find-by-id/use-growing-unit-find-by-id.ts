import { useQuery } from '@tanstack/react-query';
import { growingUnitsApiClient } from '../../api/growing-units-api.client';

/**
 * Hook for fetching a single growing unit by ID using TanStack Query
 * Replaces SDK's useGrowingUnits().findById with API client
 */
export function useGrowingUnitFindById(id: string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['growing-units', 'detail', id],
    queryFn: () => growingUnitsApiClient.findById({ id }),
    enabled: enabled && !!id,
  });

  return {
    growingUnit: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
