import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

import { PlantSpeciesSearchQuery } from './plant-species-search.query';

/**
 * Handles the {@link PlantSpeciesSearchQuery} and performs a full-text search
 * on {@link PlantSpeciesViewModel} instances.
 */
@QueryHandler(PlantSpeciesSearchQuery)
export class PlantSpeciesSearchQueryHandler
	implements IQueryHandler<PlantSpeciesSearchQuery>
{
	private readonly logger = new Logger(PlantSpeciesSearchQueryHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	async execute(query: PlantSpeciesSearchQuery): Promise<PlantSpeciesViewModel[]> {
		this.logger.log(
			`Executing plant species search query: ${query.query}`,
		);

		// 01: Perform full-text search on plant species
		return await this.plantSpeciesReadRepository.search(query.query);
	}
}
