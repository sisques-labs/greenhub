import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PlantViewModelFindByIdQuery } from '@/core/plant-context/application/queries/plant/plant-view-model-find-by-id/plant-view-model-find-by-id.query';
import { AssertPlantViewModelExistsService } from '@/core/plant-context/application/services/plant/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';

/**
 * Handles the PlantViewModelFindByIdQuery and retrieves
 * a PlantViewModel instance by its unique identifier.
 *
 * @remarks
 * This CQRS QueryHandler performs the following operations:
 * - Logs the execution of the query.
 * - Retrieves the plant view model by its id from the service.
 */
@QueryHandler(PlantViewModelFindByIdQuery)
export class PlantViewModelFindByIdQueryHandler
	implements IQueryHandler<PlantViewModelFindByIdQuery>
{
	private readonly logger = new Logger(
		PlantViewModelFindByIdQueryHandler.name,
	);

	constructor(
		private readonly assertPlantViewModelExistsService: AssertPlantViewModelExistsService,
	) {}

	/**
	 * Executes the PlantViewModelFindByIdQuery.
	 *
	 * @param query - The query containing the identifier of the plant view model.
	 * @returns A promise that resolves to the found PlantViewModel.
	 *
	 * @throws {PlantNotFoundException} If a plant view model with the specified ID does not exist.
	 */
	async execute(
		query: PlantViewModelFindByIdQuery,
	): Promise<PlantViewModel> {
		this.logger.log(
			`Executing plant view model find by id query: ${query.id.value}`,
		);

		// 01: Find the plant view model by id
		return await this.assertPlantViewModelExistsService.execute(
			query.id.value,
		);
	}
}

