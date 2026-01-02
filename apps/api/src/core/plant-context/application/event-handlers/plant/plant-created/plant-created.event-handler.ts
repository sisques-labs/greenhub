import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PlantCreatedEvent } from '@/core/plant-context/application/events/plant/plant-created/plant-created.event';
import { PlantViewModelFactory } from '@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';

/**
 * Event handler for PlantCreatedEvent.
 *
 * @remarks
 * This handler creates a new plant view model when a plant is created,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantCreatedEvent)
export class PlantCreatedEventHandler
	implements IEventHandler<PlantCreatedEvent>
{
	private readonly logger = new Logger(PlantCreatedEventHandler.name);

	constructor(
		@Inject(PLANT_READ_REPOSITORY_TOKEN)
		private readonly plantReadRepository: IPlantReadRepository,
		private readonly plantViewModelFactory: PlantViewModelFactory,
	) {}

	/**
	 * Handles the PlantCreatedEvent event by creating a new plant view model.
	 *
	 * @param event - The PlantCreatedEvent event to handle
	 */
	async handle(event: PlantCreatedEvent) {
		this.logger.log(`Handling plant created event: ${event.entityId}`);

		this.logger.debug(
			`Plant created event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Create the plant view model
		const plantViewModel: PlantViewModel =
			this.plantViewModelFactory.fromPrimitives(event.data);

		// 02: Save the plant view model
		await this.plantReadRepository.save(plantViewModel);
	}
}
