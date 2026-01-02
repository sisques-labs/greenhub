import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GrowingUnitViewModelFindByLocationIdQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-location-id/growing-unit-view-model-find-by-location-id.query';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';

/**
 * Handles the {@link GrowingUnitViewModelFindByLocationIdQuery} and retrieves
 * an array of {@link GrowingUnitViewModel} instances by location ID.
 *
 * @remarks
 * This CQRS QueryHandler performs the following operations:
 * - Logs the execution of the query.
 * - Retrieves the growing unit view models by location id from the repository.
 *
 * @public
 */
@QueryHandler(GrowingUnitViewModelFindByLocationIdQuery)
export class GrowingUnitViewModelFindByLocationIdQueryHandler
	implements IQueryHandler<GrowingUnitViewModelFindByLocationIdQuery>
{
	/**
	 * @internal
	 * Logger instance for the handler.
	 */
	private readonly logger = new Logger(
		GrowingUnitViewModelFindByLocationIdQueryHandler.name,
	);

	/**
	 * Instantiates the query handler.
	 *
	 * @param growingUnitReadRepository -
	 * Repository responsible for reading growing unit view models.
	 */
	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
	) {}

	/**
	 * Executes the {@link GrowingUnitViewModelFindByLocationIdQuery}.
	 *
	 * @param query - The query containing the location identifier.
	 * @returns A promise that resolves to an array of found {@link GrowingUnitViewModel}.
	 */
	async execute(
		query: GrowingUnitViewModelFindByLocationIdQuery,
	): Promise<GrowingUnitViewModel[]> {
		this.logger.log(
			`Executing growing unit view model find by location id query: ${query.locationId.value}`,
		);

		// 01: Find the growing unit view models by location id
		return await this.growingUnitReadRepository.findByLocationId(
			query.locationId.value,
		);
	}
}
