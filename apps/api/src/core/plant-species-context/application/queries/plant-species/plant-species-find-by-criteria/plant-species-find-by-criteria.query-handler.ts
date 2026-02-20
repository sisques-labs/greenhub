import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

import { PlantSpeciesFindByCriteriaQuery } from './plant-species-find-by-criteria.query';

/**
 * Handles the {@link PlantSpeciesFindByCriteriaQuery} and retrieves
 * {@link PlantSpeciesViewModel} instances matching the specified criteria.
 */
@QueryHandler(PlantSpeciesFindByCriteriaQuery)
export class PlantSpeciesFindByCriteriaQueryHandler
	implements IQueryHandler<PlantSpeciesFindByCriteriaQuery>
{
	private readonly logger = new Logger(
		PlantSpeciesFindByCriteriaQueryHandler.name,
	);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	async execute(
		query: PlantSpeciesFindByCriteriaQuery,
	): Promise<PaginatedResult<PlantSpeciesViewModel>> {
		this.logger.log(
			`Executing plant species find by criteria query: ${JSON.stringify(query.criteria)}`,
		);

		// 01: Retrieve plant species view models matching the criteria
		return await this.plantSpeciesReadRepository.findByCriteria(query.criteria);
	}
}
