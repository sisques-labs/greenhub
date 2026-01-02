import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PlantDeletedEvent } from '@/core/plant-context/application/events/plant/plant-deleted/plant-deleted.event';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';

/**
 * Event handler for PlantDeletedEvent.
 *
 * @remarks
 * This handler deletes the plant view model when a plant is deleted,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantDeletedEvent)
export class PlantDeletedEventHandler
	implements IEventHandler<PlantDeletedEvent>
{
	private readonly logger = new Logger(PlantDeletedEventHandler.name);

	constructor(
		@Inject(PLANT_READ_REPOSITORY_TOKEN)
		private readonly plantReadRepository: IPlantReadRepository,
	) {}

	/**
	 * Handles the PlantDeletedEvent event by deleting the plant view model.
	 *
	 * @param event - The PlantDeletedEvent event to handle
	 */
	async handle(event: PlantDeletedEvent) {
		this.logger.log(`Handling plant deleted event: ${event.entityId}`);

		this.logger.debug(
			`Plant deleted event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Delete the plant view model
		await this.plantReadRepository.delete(event.entityId);
	}
}
