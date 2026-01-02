import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

import { FindPlantsByCriteriaQuery } from './find-plants-by-criteria.query';

/**
 * Handles the FindPlantsByCriteriaQuery by retrieving plant view models
 * matching the specified criteria. Returns a paginated result set.
 *
 * @remarks
 * Implements the IQueryHandler interface for this specific query, using the injected
 * read repository for plants.
 */
@QueryHandler(FindPlantsByCriteriaQuery)
export class FindPlantsByCriteriaQueryHandler
	implements IQueryHandler<FindPlantsByCriteriaQuery>
{
	private readonly logger = new Logger(FindPlantsByCriteriaQueryHandler.name);

	constructor(
		@Inject(PLANT_READ_REPOSITORY_TOKEN)
		private readonly plantReadRepository: IPlantReadRepository,
	) {}

	/**
	 * Executes the FindPlantsByCriteriaQuery query.
	 *
	 * @param query - The query object containing the criteria for filtering plants.
	 * @returns A PaginatedResult of PlantViewModel matching the criteria.
	 */
	async execute(
		query: FindPlantsByCriteriaQuery,
	): Promise<PaginatedResult<PlantViewModel>> {
		this.logger.log(
			`Executing find plants by criteria query: ${JSON.stringify(query.criteria)}`,
		);

		// 01: Find plants by criteria
		return await this.plantReadRepository.findByCriteria(query.criteria);
	}
}


