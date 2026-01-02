import { Inject, Injectable, Logger } from '@nestjs/common';

import { PlantNotFoundException } from '@/core/plant-context/application/exceptions/plant/plant-not-found/plant-not-found.exception';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for asserting that a plant view model exists in the read repository.
 *
 * @remarks
 * This service provides a method to assert the existence of a plant view model
 * by its unique identifier. If the view model does not exist, an exception is thrown.
 */
@Injectable()
export class AssertPlantViewModelExistsService
	implements IBaseService<string, PlantViewModel>
{
	private readonly logger = new Logger(
		AssertPlantViewModelExistsService.name,
	);

	constructor(
		@Inject(PLANT_READ_REPOSITORY_TOKEN)
		private readonly plantReadRepository: IPlantReadRepository,
	) {}

	/**
	 * Asserts that a plant view model exists by its ID.
	 *
	 * @param id - The unique identifier of the plant.
	 * @returns The PlantViewModel if found.
	 * @throws {PlantNotFoundException} If the plant view model does not exist.
	 */
	async execute(id: string): Promise<PlantViewModel> {
		this.logger.log(`Asserting plant view model exists by id: ${id}`);

		// 01: Find the plant view model by id
		const existingPlantViewModel =
			await this.plantReadRepository.findById(id);

		// 02: If the plant view model does not exist, throw an error
		if (!existingPlantViewModel) {
			this.logger.error(`Plant view model not found by id: ${id}`);
			throw new PlantNotFoundException(id);
		}

		return existingPlantViewModel;
	}
}

