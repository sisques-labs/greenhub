"use client";
import { useAsyncState } from "../../react/hooks/use-async-state.js";
import { useSDKContext } from "../../react/index.js";
import type { MutationResponse } from "../../shared/types/index.js";
import type {
	CreateLocationInput,
	DeleteLocationInput,
	LocationFindByCriteriaInput,
	LocationFindByIdInput,
	LocationResponse,
	PaginatedLocationResult,
	UpdateLocationInput,
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

	const create = useAsyncState<MutationResponse, [CreateLocationInput]>(
		(input: CreateLocationInput) => sdk.locations.create(input),
	);

	const update = useAsyncState<MutationResponse, [UpdateLocationInput]>(
		(input: UpdateLocationInput) => sdk.locations.update(input),
	);

	const remove = useAsyncState<MutationResponse, [DeleteLocationInput]>(
		(input: DeleteLocationInput) => sdk.locations.delete(input),
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
		create: {
			...create,
			mutate: create.execute,
		},
		update: {
			...update,
			mutate: update.execute,
		},
		delete: {
			...remove,
			mutate: remove.execute,
		},
	};
}

