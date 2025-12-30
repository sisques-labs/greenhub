import { useUsers } from '@repo/sdk';
import { useEffect } from 'react';

/**
 * Hook that provides user find by id functionality
 * Uses SDK directly since backend handles all validation
 */
export function useUserFindById(id: string, options?: { enabled?: boolean }) {
  const { findById } = useUsers();
  const enabled = options?.enabled !== false;

  useEffect(() => {
    if (enabled && id) {
      findById.fetch({ id });
    }
  }, [enabled, id, findById.fetch]);

  return {
    user: findById.data || null,
    isLoading: findById.loading,
    error: findById.error,
    refetch: () => {
      if (id) {
        findById.fetch({ id });
      }
    },
  };
}
