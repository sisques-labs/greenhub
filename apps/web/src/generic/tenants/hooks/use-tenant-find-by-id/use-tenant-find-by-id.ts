import { useTenants } from "@repo/sdk";
import { useEffect } from "react";

/**
 * Hook that provides tenant find by id functionality
 * Uses SDK directly since backend handles all validation
 */
export function useTenantFindById(id: string, options?: { enabled?: boolean }) {
	const { findById } = useTenants();
	const enabled = options?.enabled !== false;

	useEffect(() => {
		if (enabled && id) {
			findById.fetch({ id });
		}
	}, [enabled, id, findById.fetch]);

	return {
		tenant: findById.data || null,
		isLoading: findById.loading,
		error: findById.error,
		refetch: () => {
			if (id) {
				findById.fetch({ id });
			}
		},
	};
}

