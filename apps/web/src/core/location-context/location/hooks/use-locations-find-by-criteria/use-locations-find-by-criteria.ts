import type { LocationFindByCriteriaInput } from "@repo/sdk";
import { useLocations } from "@repo/sdk";
import { useEffect, useMemo, useRef } from "react";

/**
 * Hook that provides locations find by criteria functionality
 * Uses SDK directly since backend handles all validation
 */
export function useLocationsFindByCriteria(
	input?: LocationFindByCriteriaInput,
	options?: { enabled?: boolean },
) {
	const { findByCriteria } = useLocations();
	const enabled = options?.enabled !== false;
	const inputString = useMemo(() => JSON.stringify(input || {}), [input]);
	const previousInputRef = useRef<string | null>(null);

	useEffect(() => {
		if (enabled) {
			// Only fetch if input has actually changed
			if (previousInputRef.current !== inputString) {
				previousInputRef.current = inputString;
				findByCriteria.fetch(input);
			}
		}
	}, [enabled, inputString, input, findByCriteria]);

	return {
		locations: findByCriteria.data || null,
		isLoading: findByCriteria.loading,
		error: findByCriteria.error,
		refetch: () => {
			previousInputRef.current = null;
			findByCriteria.fetch(input);
		},
	};
}

