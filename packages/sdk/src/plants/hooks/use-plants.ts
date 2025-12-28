'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  CreatePlantInput,
  UpdatePlantInput,
  DeletePlantInput,
  ChangePlantStatusInput,
  PaginatedPlantResult,
  PlantFindByCriteriaInput,
  PlantFindByIdInput,
  PlantResponse,
} from '../index.js';

/**
 * Hook for plant operations
 */
export function usePlants() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedPlantResult,
    [PlantFindByCriteriaInput?]
  >((input?: PlantFindByCriteriaInput) => sdk.plants.findByCriteria(input));

  const findById = useAsyncState<PlantResponse, [PlantFindByIdInput]>(
    (input: PlantFindByIdInput) => sdk.plants.findById(input),
  );

  const create = useAsyncState<MutationResponse, [CreatePlantInput]>(
    (input: CreatePlantInput) => sdk.plants.create(input),
  );

  const update = useAsyncState<MutationResponse, [UpdatePlantInput]>(
    (input: UpdatePlantInput) => sdk.plants.update(input),
  );

  const remove = useAsyncState<MutationResponse, [DeletePlantInput]>(
    (input: DeletePlantInput) => sdk.plants.delete(input),
  );

  const changeStatus = useAsyncState<
    MutationResponse,
    [ChangePlantStatusInput]
  >((input: ChangePlantStatusInput) => sdk.plants.changeStatus(input));

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
    changeStatus: {
      ...changeStatus,
      mutate: changeStatus.execute,
    },
  };
}
