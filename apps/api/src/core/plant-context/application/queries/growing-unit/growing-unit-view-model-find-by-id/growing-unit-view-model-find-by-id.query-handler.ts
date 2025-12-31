import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GrowingUnitViewModelFindByIdQuery } from "@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query";
import { AssertGrowingUnitViewModelExistsService } from "@/core/plant-context/application/services/growing-unit/assert-growing-unit-view-model-exists/assert-growing-unit-view-model-exists.service";
import { GrowingUnitViewModel } from "@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model";

/**
 * Handles the {@link GrowingUnitViewModelFindByIdQuery} and retrieves
 * a {@link GrowingUnitViewModel} instance by its unique identifier.
 *
 * @remarks
 * This CQRS QueryHandler performs the following operations:
 * - Logs the execution of the query.
 * - Retrieves the growing unit view model by its id from the service.
 *
 * @public
 */
@QueryHandler(GrowingUnitViewModelFindByIdQuery)
export class GrowingUnitViewModelFindByIdQueryHandler
	implements IQueryHandler<GrowingUnitViewModelFindByIdQuery>
{
	/**
	 * @internal
	 * Logger instance for the handler.
	 */
	private readonly logger = new Logger(
		GrowingUnitViewModelFindByIdQueryHandler.name,
	);

	/**
	 * Instantiates the query handler.
	 *
	 * @param assertGrowingUnitViewModelExistsService -
	 * Service responsible for ensuring a view model exists by ID.
	 */
	constructor(
		private readonly assertGrowingUnitViewModelExistsService: AssertGrowingUnitViewModelExistsService,
	) {}

	/**
	 * Executes the {@link GrowingUnitViewModelFindByIdQuery}.
	 *
	 * @param query - The query containing the identifier of the growing unit view model.
	 * @returns A promise that resolves to the found {@link GrowingUnitViewModel}.
	 *
	 * @throws {NotFoundException} If a growing unit view model with the specified ID does not exist.
	 */
	async execute(
		query: GrowingUnitViewModelFindByIdQuery,
	): Promise<GrowingUnitViewModel> {
		this.logger.log(
			`Executing growing unit view model find by id query: ${query.id.value}`,
		);

		// Retrieve and return the growing unit view model by id
		return await this.assertGrowingUnitViewModelExistsService.execute(
			query.id.value,
		);
	}
}
