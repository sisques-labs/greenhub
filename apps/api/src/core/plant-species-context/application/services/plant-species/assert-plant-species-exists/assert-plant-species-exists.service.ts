import { PlantSpeciesNotFoundException } from '@/core/plant-species-context/application/exceptions/plant-species/plant-species-not-found/plant-species-not-found.exception';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import {
	IPlantSpeciesWriteRepository,
	PLANT_SPECIES_WRITE_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * Service responsible for asserting that a plant species exists in the write repository.
 * Throws an appropriate exception if the plant species is not found.
 *
 * @implements {IBaseService<string, PlantSpeciesAggregate>}
 */
@Injectable()
export class AssertPlantSpeciesExistsService
	implements IBaseService<string, PlantSpeciesAggregate>
{
	private readonly logger = new Logger(AssertPlantSpeciesExistsService.name);

	constructor(
		@Inject(PLANT_SPECIES_WRITE_REPOSITORY_TOKEN)
		private readonly plantSpeciesWriteRepository: IPlantSpeciesWriteRepository,
	) {}

	/**
	 * Asserts that a plant species exists by its ID.
	 *
	 * @param id - The unique identifier for the plant species.
	 * @returns A promise that resolves to the {@link PlantSpeciesAggregate} if found.
	 * @throws {@link PlantSpeciesApplicationNotFoundException} if the plant species does not exist.
	 */
	async execute(id: string): Promise<PlantSpeciesAggregate> {
		this.logger.log(`Asserting plant species exists by id: ${id}`);

		// 01: Find the plant species by id
		const existingPlantSpecies =
			await this.plantSpeciesWriteRepository.findById(id);

		// 02: If the plant species does not exist, throw an error
		if (!existingPlantSpecies) {
			this.logger.error(`Plant species not found by id: ${id}`);
			throw new PlantSpeciesNotFoundException(id);
		}

		return existingPlantSpecies;
	}
}
