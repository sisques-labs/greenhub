import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LocationFindByIdQuery } from '@/core/location-context/application/queries/location/location-find-by-id/location-find-by-id.query';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';

/**
 * Query handler for finding a location by its ID.
 *
 * @remarks
 * Handles the {@link LocationFindByIdQuery} query and attempts to retrieve
 * a {@link LocationAggregate} from the data source using the provided ID.
 *
 * This handler uses {@link AssertLocationExistsService} to verify existence and fetch
 * the corresponding location aggregate.
 */
@QueryHandler(LocationFindByIdQuery)
export class LocationFindByIdQueryHandler
	implements IQueryHandler<LocationFindByIdQuery>
{
	/**
	 * Logger instance for logging handler actions.
	 */
	private readonly logger = new Logger(LocationFindByIdQueryHandler.name);

	/**
	 * Creates a new instance of the LocationFindByIdQueryHandler class.
	 *
	 * @param assertLocationExistsService - Service responsible for verifying and retrieving location aggregates.
	 */
	constructor(
		private readonly assertLocationExistsService: AssertLocationExistsService,
	) {}

	/**
	 * Executes the {@link LocationFindByIdQuery} to retrieve a location by its ID.
	 *
	 * @param query - The {@link LocationFindByIdQuery} containing the ID of the location.
	 * @returns A promise that resolves to the {@link LocationAggregate} if found.
	 * @throws Will rethrow any errors encountered during service execution.
	 */
	async execute(
		query: LocationFindByIdQuery,
	): Promise<LocationAggregate> {
		this.logger.log(
			`Executing location find by id query: ${query.id.value}`,
		);

		// 01: Find the location by id using the assertion service
		return await this.assertLocationExistsService.execute(query.id.value);
	}
}

