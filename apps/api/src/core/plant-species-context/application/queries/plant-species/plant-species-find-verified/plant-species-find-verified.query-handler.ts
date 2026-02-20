import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';

import { PlantSpeciesFindVerifiedQuery } from './plant-species-find-verified.query';

/**
 * Handles the {@link PlantSpeciesFindVerifiedQuery} and retrieves only
 * verified {@link PlantSpeciesViewModel} instances.
 */
@QueryHandler(PlantSpeciesFindVerifiedQuery)
export class PlantSpeciesFindVerifiedQueryHandler
	implements IQueryHandler<PlantSpeciesFindVerifiedQuery>
{
	private readonly logger = new Logger(
		PlantSpeciesFindVerifiedQueryHandler.name,
	);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	async execute(): Promise<PlantSpeciesViewModel[]> {
		this.logger.log('Executing plant species find verified query');

		// 01: Retrieve all verified plant species view models
		return await this.plantSpeciesReadRepository.findVerified();
	}
}
