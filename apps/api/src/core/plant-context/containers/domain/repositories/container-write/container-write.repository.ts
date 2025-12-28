import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const CONTAINER_WRITE_REPOSITORY_TOKEN = Symbol(
  'ContainerWriteRepository',
);

/**
 * Type alias for the container write repository.
 * This repository handles write operations (create, update, delete) for containers.
 *
 * @type ContainerWriteRepository
 */
export type ContainerWriteRepository = IBaseWriteRepository<ContainerAggregate>;
