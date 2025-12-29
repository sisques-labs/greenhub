import { usePlants } from '@repo/sdk';
import { useEffect } from 'react';

/**
 * Hook that provides plant find by id functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantFindById(id: string, options?: { enabled?: boolean }) {
  const { findById } = usePlants();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled && id) {
      findById.fetch({ id });
    }
  }, [enabled, id]);

  return {
    plant: findById.data || null,
    isLoading: findById.loading,
    error: findById.error,
    refetch: () => {
      if (id) {
        findById.fetch({ id });
      }
    },
  };
}
