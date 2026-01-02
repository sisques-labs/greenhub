import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GrowingUnitFindByLocationIdQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-location-id/growing-unit-find-by-location-id.query';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import {
	GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
	IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';

/**
 * Query handler for finding growing units by location ID.
 *
 * @remarks
 * Handles the {@link GrowingUnitFindByLocationIdQuery} query and attempts to retrieve
 * an array of {@link GrowingUnitAggregate} from the data source using the provided location ID.
 */
@QueryHandler(GrowingUnitFindByLocationIdQuery)
export class GrowingUnitFindByLocationIdQueryHandler
	implements IQueryHandler<GrowingUnitFindByLocationIdQuery>
{
	/**
	 * Logger instance for logging handler actions.
	 */
	private readonly logger = new Logger(
		GrowingUnitFindByLocationIdQueryHandler.name,
	);

	/**
	 * Creates a new instance of the GrowingUnitFindByLocationIdQueryHandler class.
	 *
	 * @param growingUnitWriteRepository - Write repository for growing units, injected via NestJS DI.
	 */
	constructor(
		@Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
		private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
	) {}

	/**
	 * Executes the {@link GrowingUnitFindByLocationIdQuery} to retrieve growing units by location ID.
	 *
	 * @param query - The {@link GrowingUnitFindByLocationIdQuery} containing the location ID.
	 * @returns A promise that resolves to an array of {@link GrowingUnitAggregate} if found.
	 */
	async execute(
		query: GrowingUnitFindByLocationIdQuery,
	): Promise<GrowingUnitAggregate[]> {
		this.logger.log(
			`Executing growing unit find by location id query: ${query.locationId.value}`,
		);

		// 01: Find the growing units by location id
		return await this.growingUnitWriteRepository.findByLocationId(
			query.locationId.value,
		);
	}
}

