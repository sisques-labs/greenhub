import type { PlantFindByCriteriaInput } from "@repo/sdk";
import { usePlants } from "@repo/sdk";
import { useEffect, useMemo, useRef } from "react";

/**
 * Hook that provides plants find by criteria functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantsFindByCriteria(
	input?: PlantFindByCriteriaInput,
	options?: { enabled?: boolean },
) {
	const { findByCriteria } = usePlants();
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
		plants: findByCriteria.data || null,
		isLoading: findByCriteria.loading,
		error: findByCriteria.error,
		refetch: () => {
			previousInputRef.current = null;
			findByCriteria.fetch(input);
		},
	};
}


