"use client";
import { useAsyncState } from "../../react/hooks/use-async-state.js";
import { useSDKContext } from "../../react/index.js";
import type {
	LocationFindByCriteriaInput,
	LocationFindByIdInput,
	LocationResponse,
	PaginatedLocationResult,
} from "../index.js";

/**
 * Hook for location operations
 */
export function useLocations() {
	const sdk = useSDKContext();
	const findByCriteria = useAsyncState<
		PaginatedLocationResult,
		[LocationFindByCriteriaInput?]
	>((input?: LocationFindByCriteriaInput) => sdk.locations.findByCriteria(input));

	const findById = useAsyncState<LocationResponse | null, [LocationFindByIdInput]>(
		(input: LocationFindByIdInput) => sdk.locations.findById(input),
	);

	return {
		findByCriteria: {
			...findByCriteria,
			fetch: findByCriteria.execute,
		},
		findById: {
			...findById,
			fetch: findById.execute,
		},
	};
}

