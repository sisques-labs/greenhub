import { Inject, Injectable, Logger } from '@nestjs/common';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesNotFoundException } from '@/core/plant-species-context/domain/exceptions/plant-species-not-found/plant-species-not-found.exception';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for asserting that a plant species view model exists in the read repository.
 *
 * @remarks
 * This service provides a method to assert the existence of a plant species view model
 * by its unique identifier. If the view model does not exist, an exception is thrown.
 *
 * @public
 */
@Injectable()
export class AssertPlantSpeciesViewModelExistsService
	implements IBaseService<string, PlantSpeciesViewModel>
{
	private readonly logger = new Logger(
		AssertPlantSpeciesViewModelExistsService.name,
	);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	/**
	 * Asserts that a plant species view model exists by its ID.
	 *
	 * @param id - The unique identifier of the plant species.
	 * @returns The {@link PlantSpeciesViewModel} if found.
	 * @throws {@link PlantSpeciesNotFoundException} If the plant species view model does not exist.
	 */
	async execute(id: string): Promise<PlantSpeciesViewModel> {
		this.logger.log(`Asserting plant species view model exists by id: ${id}`);

		// 01: Find the plant species view model by id
		const existingPlantSpeciesViewModel =
			await this.plantSpeciesReadRepository.findById(id);

		// 02: If the plant species view model does not exist, throw an error
		if (!existingPlantSpeciesViewModel) {
			this.logger.error(`Plant species view model not found by id: ${id}`);
			throw new PlantSpeciesNotFoundException(id);
		}

		return existingPlantSpeciesViewModel;
	}
}
