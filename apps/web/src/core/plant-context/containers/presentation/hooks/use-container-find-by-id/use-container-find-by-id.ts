import { useContainers } from '@repo/sdk';
import { useEffect } from 'react';

/**
 * Hook that provides container find by id functionality
 * Uses SDK directly since backend handles all validation
 */
export function useContainerFindById(
  id: string,
  options?: { enabled?: boolean },
) {
  const { findById } = useContainers();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled && id) {
      findById.fetch({ id });
    }
  }, [enabled, id, findById.fetch]);

  return {
    container: findById.data || null,
    isLoading: findById.loading,
    error: findById.error,
    refetch: () => {
      if (id) {
        findById.fetch({ id });
      }
    },
  };
}
