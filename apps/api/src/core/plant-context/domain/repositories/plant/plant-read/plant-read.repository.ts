import type { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import type { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const PLANT_READ_REPOSITORY_TOKEN = Symbol('PlantReadRepository');

/**
 * Type alias for the plant read repository.
 * This repository handles read operations (queries) for plants.
 *
 * @type IPlantReadRepository
 */
export type IPlantReadRepository = IBaseReadRepository<PlantViewModel>;
