import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AssertPlantSpeciesViewModelExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-view-model-exists/assert-plant-species-view-model-exists.service';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

import { PlantSpeciesFindByIdQuery } from './plant-species-find-by-id.query';

/**
 * Handles the {@link PlantSpeciesFindByIdQuery} and retrieves
 * a {@link PlantSpeciesViewModel} instance by its unique identifier.
 */
@QueryHandler(PlantSpeciesFindByIdQuery)
export class PlantSpeciesFindByIdQueryHandler
	implements IQueryHandler<PlantSpeciesFindByIdQuery>
{
	private readonly logger = new Logger(PlantSpeciesFindByIdQueryHandler.name);

	constructor(
		private readonly assertPlantSpeciesViewModelExistsService: AssertPlantSpeciesViewModelExistsService,
	) {}

	async execute(query: PlantSpeciesFindByIdQuery): Promise<PlantSpeciesViewModel> {
		this.logger.log(
			`Executing plant species find by id query: ${query.id.value}`,
		);

		// 01: Find the plant species view model by id
		return await this.assertPlantSpeciesViewModelExistsService.execute(
			query.id.value,
		);
	}
}
