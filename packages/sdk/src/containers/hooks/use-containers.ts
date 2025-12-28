'use client';
import { useAsyncState } from '../../react/hooks/use-async-state.js';
import { useSDKContext } from '../../react/index.js';
import type { MutationResponse } from '../../shared/types/index.js';
import type {
  CreateContainerInput,
  UpdateContainerInput,
  DeleteContainerInput,
  PaginatedContainerResult,
  ContainerFindByCriteriaInput,
  ContainerFindByIdInput,
  ContainerResponse,
} from '../index.js';

/**
 * Hook for container operations
 */
export function useContainers() {
  const sdk = useSDKContext();
  const findByCriteria = useAsyncState<
    PaginatedContainerResult,
    [ContainerFindByCriteriaInput?]
  >((input?: ContainerFindByCriteriaInput) =>
    sdk.containers.findByCriteria(input),
  );

  const findById = useAsyncState<ContainerResponse, [ContainerFindByIdInput]>(
    (input: ContainerFindByIdInput) => sdk.containers.findById(input),
  );

  const create = useAsyncState<MutationResponse, [CreateContainerInput]>(
    (input: CreateContainerInput) => sdk.containers.create(input),
  );

  const update = useAsyncState<MutationResponse, [UpdateContainerInput]>(
    (input: UpdateContainerInput) => sdk.containers.update(input),
  );

  const remove = useAsyncState<MutationResponse, [DeleteContainerInput]>(
    (input: DeleteContainerInput) => sdk.containers.delete(input),
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
