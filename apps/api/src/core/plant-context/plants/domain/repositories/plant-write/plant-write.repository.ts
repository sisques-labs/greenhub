import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const PLANT_WRITE_REPOSITORY_TOKEN = Symbol('PlantWriteRepository');

/**
 * Write repository interface for Plant aggregate.
 * Extends IBaseWriteRepository with additional query methods.
 */
export interface PlantWriteRepository
  extends IBaseWriteRepository<PlantAggregate> {
  /**
   * Finds all plants by container ID.
   *
   * @param containerId - The container ID to search for
   * @returns Promise that resolves to an array of PlantAggregate instances
   */
  findByContainerId(containerId: string): Promise<PlantAggregate[]>;
}
