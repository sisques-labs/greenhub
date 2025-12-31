"use client";
import { useAsyncState } from "../../react/hooks/use-async-state.js";
import { useSDKContext } from "../../react/index.js";
import type { MutationResponse } from "../../shared/types/index.js";
import type {
	PlantFindByIdInput,
	PlantResponse,
	PlantTransplantInput,
	UpdatePlantInput,
} from "../index.js";

/**
 * Hook for plant operations
 */
export function usePlants() {
	const sdk = useSDKContext();
	const findById = useAsyncState<PlantResponse | null, [PlantFindByIdInput]>(
		(input: PlantFindByIdInput) => sdk.plants.findById(input),
	);

	const update = useAsyncState<MutationResponse, [UpdatePlantInput]>(
		(input: UpdatePlantInput) => sdk.plants.update(input),
	);

	const transplant = useAsyncState<MutationResponse, [PlantTransplantInput]>(
		(input: PlantTransplantInput) => sdk.plants.transplant(input),
	);

	return {
		findById: {
			...findById,
			fetch: findById.execute,
		},
		update: {
			...update,
			mutate: update.execute,
		},
		transplant: {
			...transplant,
			mutate: transplant.execute,
		},
	};
}
