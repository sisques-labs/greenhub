import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const PLANT_READ_REPOSITORY_TOKEN = Symbol('PlantReadRepository');

/**
 * Read repository interface for Plant view model.
 * Extends IBaseReadRepository with additional query methods.
 */
export interface PlantReadRepository
  extends IBaseReadRepository<PlantViewModel> {
  /**
   * Finds all plant view models by container ID.
   *
   * @param containerId - The container ID to search for
   * @returns Promise that resolves to an array of PlantViewModel instances
   */
  findByContainerId(containerId: string): Promise<PlantViewModel[]>;
}
