import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const CONTAINER_READ_REPOSITORY_TOKEN = Symbol(
  'ContainerReadRepository',
);

/**
 * Type alias for the container read repository.
 * This repository handles read operations (queries) for containers.
 *
 * @type ContainerReadRepository
 */
export type ContainerReadRepository = IBaseReadRepository<ContainerViewModel>;
