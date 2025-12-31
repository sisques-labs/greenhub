import { PlantEntity } from "@/core/plant-context/domain/entities/plant/plant.entity";
import { IBaseWriteRepository } from "@/shared/domain/interfaces/base-write-repository.interface";

export const PLANT_WRITE_REPOSITORY_TOKEN = Symbol("PlantWriteRepository");

/**
 * Write repository interface for Plant aggregate.
 * Extends IBaseWriteRepository with additional query methods.
 */
export interface IPlantWriteRepository
	extends IBaseWriteRepository<PlantEntity> {
	/**
	 * Finds all plants by growing unit ID.
	 *
	 * @param growingUnitId - The growing unit ID to search for
	 * @returns Promise that resolves to an array of PlantEntity instances
	 */
	findByGrowingUnitId(growingUnitId: string): Promise<PlantEntity[]>;
}
