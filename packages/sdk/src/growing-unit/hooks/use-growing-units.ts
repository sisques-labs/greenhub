'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  CreateGrowingUnitInput,
  DeleteGrowingUnitInput,
  GrowingUnitFindByCriteriaInput,
  GrowingUnitFindByIdInput,
  GrowingUnitResponse,
  PaginatedGrowingUnitResult,
  PlantAddInput,
  PlantRemoveInput,
  UpdateGrowingUnitInput,
} from '../index.js';

/**
 * Hook for growing unit operations
 */
export function useGrowingUnits() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedGrowingUnitResult,
    [GrowingUnitFindByCriteriaInput?]
  >((input?: GrowingUnitFindByCriteriaInput) =>
    sdk.growingUnits.findByCriteria(input),
  );

  const findById = useAsyncState<
    GrowingUnitResponse | null,
    [GrowingUnitFindByIdInput]
  >((input: GrowingUnitFindByIdInput) => sdk.growingUnits.findById(input));

  const create = useAsyncState<MutationResponse, [CreateGrowingUnitInput]>(
    (input: CreateGrowingUnitInput) => sdk.growingUnits.create(input),
  );

  const update = useAsyncState<MutationResponse, [UpdateGrowingUnitInput]>(
    (input: UpdateGrowingUnitInput) => sdk.growingUnits.update(input),
  );

  const remove = useAsyncState<MutationResponse, [DeleteGrowingUnitInput]>(
    (input: DeleteGrowingUnitInput) => sdk.growingUnits.delete(input),
  );

  const plantAdd = useAsyncState<MutationResponse, [PlantAddInput]>(
    (input: PlantAddInput) => sdk.growingUnits.plantAdd(input),
  );

  const plantRemove = useAsyncState<MutationResponse, [PlantRemoveInput]>(
    (input: PlantRemoveInput) => sdk.growingUnits.plantRemove(input),
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
    plantAdd: {
      ...plantAdd,
      mutate: plantAdd.execute,
    },
    plantRemove: {
      ...plantRemove,
      mutate: plantRemove.execute,
    },
  };
}
