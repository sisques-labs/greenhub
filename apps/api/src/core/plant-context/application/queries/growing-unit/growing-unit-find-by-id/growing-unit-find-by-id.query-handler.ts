import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GrowingUnitFindByIdQuery } from "@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.query";
import { AssertGrowingUnitExistsService } from "@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service";
import { GrowingUnitAggregate } from "@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate";

/**
 * Query handler for finding a growing unit by its ID.
 *
 * @remarks
 * Handles the {@link GrowingUnitFindByIdQuery} query and attempts to retrieve
 * a {@link GrowingUnitAggregate} from the data source using the provided ID.
 *
 * This handler uses {@link AssertGrowingUnitExistsService} to verify existence and fetch
 * the corresponding growing unit aggregate.
 */
@QueryHandler(GrowingUnitFindByIdQuery)
export class GrowingUnitFindByIdQueryHandler
	implements IQueryHandler<GrowingUnitFindByIdQuery>
{
	/**
	 * Logger instance for logging handler actions.
	 */
	private readonly logger = new Logger(GrowingUnitFindByIdQueryHandler.name);

	/**
	 * Creates a new instance of the GrowingUnitFindByIdQueryHandler class.
	 *
	 * @param assertGrowingUnitExistsService - Service responsible for verifying and retrieving growing unit aggregates.
	 */
	constructor(
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
	) {}

	/**
	 * Executes the {@link GrowingUnitFindByIdQuery} to retrieve a growing unit by its ID.
	 *
	 * @param query - The {@link GrowingUnitFindByIdQuery} containing the ID of the growing unit.
	 * @returns A promise that resolves to the {@link GrowingUnitAggregate} if found.
	 * @throws Will rethrow any errors encountered during service execution.
	 */
	async execute(
		query: GrowingUnitFindByIdQuery,
	): Promise<GrowingUnitAggregate> {
		this.logger.log(
			`Executing growing unit find by id query: ${query.id.value}`,
		);

		// 01: Find the growing unit by id using the assertion service
		return await this.assertGrowingUnitExistsService.execute(query.id.value);
	}
}
