import { usePlants } from "@repo/sdk";
import { useEffect, useRef } from "react";

/**
 * Hook that provides plant find by ID functionality
 * Uses SDK directly since backend handles all validation
 */
export function usePlantFindById(id: string, options?: { enabled?: boolean }) {
	const { findById } = usePlants();
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
		plant: findById.data || null,
		isLoading: findById.loading,
		error: findById.error,
		refetch: () => {
			previousIdRef.current = null;
			findById.fetch({ id });
		},
	};
}
