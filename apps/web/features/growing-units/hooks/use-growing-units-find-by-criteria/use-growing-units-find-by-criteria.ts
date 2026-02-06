import { useQuery } from '@tanstack/react-query';
import { growingUnitsApiClient } from '../../api/growing-units-api.client';
import type { GrowingUnitFindByCriteriaInput } from '../../api/types';

/**
 * Hook for fetching growing units by criteria using TanStack Query
 * Replaces SDK's useGrowingUnits().findByCriteria with API client
 */
export function useGrowingUnitsFindByCriteria(
  input?: GrowingUnitFindByCriteriaInput,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: ['growing-units', 'list', input],
    queryFn: () => growingUnitsApiClient.findByCriteria(input),
    enabled,
  });

  return {
    growingUnits: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
