import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

import { LocationFindByCriteriaQuery } from './location-find-by-criteria.query';

/**
 * Handles the {@link LocationFindByCriteriaQuery} by retrieving location view models
 * matching the specified criteria. Returns a paginated result set.
 *
 * @remarks
 * Implements the {@link IQueryHandler} interface for this specific query, using the injected
 * read repository for locations.
 *
 * @see LocationViewModel
 * @see PaginatedResult
 */
@QueryHandler(LocationFindByCriteriaQuery)
export class LocationFindByCriteriaQueryHandler
	implements IQueryHandler<LocationFindByCriteriaQuery>
{
	/**
	 * Standard NestJS logger, scoped to this handler.
	 */
	private readonly logger = new Logger(
		LocationFindByCriteriaQueryHandler.name,
	);

	/**
	 * Constructor for LocationFindByCriteriaQueryHandler.
	 *
	 * @param locationReadRepository - The repository instance used to access location data.
	 */
	constructor(
		@Inject(LOCATION_READ_REPOSITORY_TOKEN)
		private readonly locationReadRepository: ILocationReadRepository,
	) {}

	/**
	 * Executes the {@link LocationFindByCriteriaQuery} query.
	 *
	 * @param query - The query object containing the criteria for filtering locations.
	 * @returns A {@link PaginatedResult} of {@link LocationViewModel} matching the criteria.
	 */
	async execute(
		query: LocationFindByCriteriaQuery,
	): Promise<PaginatedResult<LocationViewModel>> {
		this.logger.log(
			`Executing location find by criteria query: ${JSON.stringify(query.criteria)}`,
		);

		// 01: Find locations by criteria
		return await this.locationReadRepository.findByCriteria(query.criteria);
	}
}

