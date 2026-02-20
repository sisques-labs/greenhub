import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

import { PlantSpeciesFindByDifficultyQuery } from './plant-species-find-by-difficulty.query';

/**
 * Handles the {@link PlantSpeciesFindByDifficultyQuery} and retrieves
 * {@link PlantSpeciesViewModel} instances matching the specified difficulty level.
 */
@QueryHandler(PlantSpeciesFindByDifficultyQuery)
export class PlantSpeciesFindByDifficultyQueryHandler
	implements IQueryHandler<PlantSpeciesFindByDifficultyQuery>
{
	private readonly logger = new Logger(
		PlantSpeciesFindByDifficultyQueryHandler.name,
	);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	async execute(
		query: PlantSpeciesFindByDifficultyQuery,
	): Promise<PlantSpeciesViewModel[]> {
		this.logger.log(
			`Executing plant species find by difficulty query: ${query.difficulty.value}`,
		);

		// 01: Retrieve plant species by difficulty
		return await this.plantSpeciesReadRepository.findByDifficulty(
			query.difficulty,
		);
	}
}
