import { useGrowingUnits } from '@repo/sdk';
import { useEffect, useRef } from 'react';

/**
 * Hook that provides growing unit find by id functionality
 * Uses SDK directly since backend handles all validation
 */
export function useGrowingUnitFindById(
	id: string,
	options?: { enabled?: boolean },
) {
	const { findById } = useGrowingUnits();
	const enabled = options?.enabled !== false;
	const previousIdRef = useRef<string | null>(null);

	useEffect(() => {
		if (enabled && id) {
			// Only fetch if id has actually changed
			if (previousIdRef.current !== id) {
				previousIdRef.current = id;
				findById.fetch({ id });
			}
		}
	}, [enabled, id, findById]);

	return {
		growingUnit: findById.data || null,
		isLoading: findById.loading,
		error: findById.error,
		refetch: () => {
			previousIdRef.current = null;
			findById.fetch({ id });
		},
	};
}
