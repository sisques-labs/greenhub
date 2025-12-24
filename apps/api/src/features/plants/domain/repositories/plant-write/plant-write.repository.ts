import { PlantAggregate } from '@/features/plants/domain/aggregates/plant.aggregate';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const PLANT_WRITE_REPOSITORY_TOKEN = Symbol('PlantWriteRepository');

/**
 * Type alias for the plant write repository.
 * This repository handles write operations (create, update, delete) for plants.
 *
 * @type PlantWriteRepository
 */
export type PlantWriteRepository = IBaseWriteRepository<PlantAggregate>;
