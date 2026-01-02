import { useLocations } from '@repo/sdk';
import { useEffect, useMemo, useRef } from 'react';

/**
 * Hook that fetches all locations without pagination
 * Useful for dropdowns and selectors
 */
export function useLocationsList() {
	const { findByCriteria } = useLocations();
	const inputString = useMemo(
		() => JSON.stringify({ pagination: { page: 1, perPage: 1000 } }),
		[],
	);
	const previousInputRef = useRef<string | null>(null);

	useEffect(() => {
		// Only fetch if input has actually changed
		if (previousInputRef.current !== inputString) {
			previousInputRef.current = inputString;
			findByCriteria.fetch({
				pagination: { page: 1, perPage: 1000 },
			});
		}
	}, [inputString, findByCriteria]);

	return {
		locations: findByCriteria.data?.items || [],
		isLoading: findByCriteria.loading,
		error: findByCriteria.error,
		refetch: () => {
			previousInputRef.current = null;
			findByCriteria.fetch({
				pagination: { page: 1, perPage: 1000 },
			});
		},
	};
}
