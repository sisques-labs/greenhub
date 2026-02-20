import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

import { PlantSpeciesFindAllQuery } from './plant-species-find-all.query';

/**
 * Handles the {@link PlantSpeciesFindAllQuery} and retrieves all
 * {@link PlantSpeciesViewModel} instances.
 */
@QueryHandler(PlantSpeciesFindAllQuery)
export class PlantSpeciesFindAllQueryHandler
	implements IQueryHandler<PlantSpeciesFindAllQuery>
{
	private readonly logger = new Logger(PlantSpeciesFindAllQueryHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	async execute(): Promise<PlantSpeciesViewModel[]> {
		this.logger.log('Executing plant species find all query');

		// 01: Retrieve all plant species view models
		return await this.plantSpeciesReadRepository.findAll();
	}
}
