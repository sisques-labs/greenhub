import { PlantSpeciesDeletedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-deleted/plant-species-deleted.event';
import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantSpeciesDeletedEvent.
 *
 * @remarks
 * This handler deletes the plant species view model when a plant species is deleted,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantSpeciesDeletedEvent)
export class PlantSpeciesDeletedEventHandler
	implements IEventHandler<PlantSpeciesDeletedEvent>
{
	private readonly logger = new Logger(PlantSpeciesDeletedEventHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
	) {}

	/**
	 * Handles the PlantSpeciesDeletedEvent event by deleting the plant species view model.
	 *
	 * @param event - The PlantSpeciesDeletedEvent event to handle
	 */
	async handle(event: PlantSpeciesDeletedEvent) {
		try {
			this.logger.log(`Handling plant species deleted event: ${event.entityId}`);

			this.logger.debug(
				`Plant species deleted event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Delete the plant species view model
			await this.plantSpeciesReadRepository.delete(event.entityId);
		} catch (error) {
			this.logger.error(
				`Failed to handle plant species deleted event: ${event.entityId}`,
				error,
			);
		}
	}
}
