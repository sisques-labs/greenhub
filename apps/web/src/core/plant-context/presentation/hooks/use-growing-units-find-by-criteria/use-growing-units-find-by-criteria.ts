import type { GrowingUnitFindByCriteriaInput } from '@repo/sdk';
import { useGrowingUnits } from '@repo/sdk';
import { useEffect, useRef } from 'react';

/**
 * Hook that provides growing units find by criteria functionality
 * Uses SDK directly since backend handles all validation
 */
export function useGrowingUnitsFindByCriteria(
  input?: GrowingUnitFindByCriteriaInput,
  options?: { enabled?: boolean },
) {
  const { findByCriteria } = useGrowingUnits();
  const enabled = options?.enabled !== false;
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (enabled && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      findByCriteria.fetch(input);
    }
  }, [enabled, input]);

  return {
    growingUnits: findByCriteria.data || null,
    isLoading: findByCriteria.loading,
    error: findByCriteria.error,
    refetch: () => {
      hasFetchedRef.current = false;
      findByCriteria.fetch(input);
    },
  };
}
