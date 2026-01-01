import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PlantCreatedEvent } from '@/core/plant-context/application/events/plant/plant-created/plant-created.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';

/**
 * Event handler for GrowingUnitPlantAddedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant is added,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantCreatedEvent)
export class PlantCreatedEventHandler
	implements IEventHandler<PlantCreatedEvent>
{
	private readonly logger = new Logger(PlantCreatedEventHandler.name);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
	) {}

	/**
	 * Handles the GrowingUnitPlantAddedEvent event by updating the growing unit view model.
	 *
	 * @param event - The GrowingUnitPlantAddedEvent event to handle
	 */
	async handle(event: PlantCreatedEvent) {
		this.logger.log(`Handling plant created event: ${event.entityId}`);

		this.logger.debug(
			`Plant created event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Get the growing unit aggregate to have the complete state
		const growingUnitAggregate =
			await this.assertGrowingUnitExistsService.execute(
				event.data.growingUnitId,
			);

		// 02: Create the updated growing unit view model from the aggregate
		const growingUnitViewModel: GrowingUnitViewModel =
			this.growingUnitViewModelFactory.fromAggregate(growingUnitAggregate);

		// 03: Save the updated growing unit view model
		await this.growingUnitReadRepository.save(growingUnitViewModel);
	}
}
