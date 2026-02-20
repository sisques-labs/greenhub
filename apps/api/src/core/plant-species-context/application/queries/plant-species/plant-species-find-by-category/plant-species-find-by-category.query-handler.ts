import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

import { PlantSpeciesFindByCategoryQuery } from './plant-species-find-by-category.query';

/**
 * Handles the {@link PlantSpeciesFindByCategoryQuery} and retrieves
 * {@link PlantSpeciesViewModel} instances matching the specified category.
 */
@QueryHandler(PlantSpeciesFindByCategoryQuery)
export class PlantSpeciesFindByCategoryQueryHandler
	implements IQueryHandler<PlantSpeciesFindByCategoryQuery>
{
	private readonly logger = new Logger(
		PlantSpeciesFindByCategoryQueryHandler.name,
	);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	async execute(
		query: PlantSpeciesFindByCategoryQuery,
	): Promise<PlantSpeciesViewModel[]> {
		this.logger.log(
			`Executing plant species find by category query: ${query.category.value}`,
		);

		// 01: Retrieve plant species by category
		return await this.plantSpeciesReadRepository.findByCategory(query.category);
	}
}
