import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { AssertLocationViewModelExistsService } from '@/core/location-context/application/services/location/assert-location-view-model-exists/assert-location-view-model-exists.service';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';

/**
 * Handles the {@link LocationViewModelFindByIdQuery} and retrieves
 * a {@link LocationViewModel} instance by its unique identifier.
 *
 * @remarks
 * This CQRS QueryHandler performs the following operations:
 * - Logs the execution of the query.
 * - Retrieves the location view model by its id from the service.
 */
@QueryHandler(LocationViewModelFindByIdQuery)
export class LocationViewModelFindByIdQueryHandler
	implements IQueryHandler<LocationViewModelFindByIdQuery>
{
	/**
	 * Logger instance for the handler.
	 */
	private readonly logger = new Logger(
		LocationViewModelFindByIdQueryHandler.name,
	);

	/**
	 * Instantiates the query handler.
	 *
	 * @param assertLocationViewModelExistsService -
	 * Service responsible for ensuring a view model exists by ID.
	 */
	constructor(
		private readonly assertLocationViewModelExistsService: AssertLocationViewModelExistsService,
	) {}

	/**
	 * Executes the {@link LocationViewModelFindByIdQuery}.
	 *
	 * @param query - The query containing the identifier of the location view model.
	 * @returns A promise that resolves to the found {@link LocationViewModel}.
	 *
	 * @throws {LocationNotFoundException} If a location view model with the specified ID does not exist.
	 */
	async execute(
		query: LocationViewModelFindByIdQuery,
	): Promise<LocationViewModel> {
		this.logger.log(
			`Executing location view model find by id query: ${query.id.value}`,
		);

		// 01: Find the location view model by id
		return await this.assertLocationViewModelExistsService.execute(
			query.id.value,
		);
	}
}

