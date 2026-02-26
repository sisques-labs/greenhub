import { PlantSpeciesUpdatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-updated/plant-species-updated.event';
import { AssertPlantSpeciesExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-exists/assert-plant-species-exists.service';
import { PlantSpeciesViewModelBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-view-model.builder';
import {
	IPlantSpeciesReadRepository,
	PLANT_SPECIES_READ_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

/**
 * Event handler for PlantSpeciesUpdatedEvent.
 *
 * @remarks
 * This handler updates the plant species view model when a plant species is updated,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantSpeciesUpdatedEvent)
export class PlantSpeciesUpdatedEventHandler
	implements IEventHandler<PlantSpeciesUpdatedEvent>
{
	private readonly logger = new Logger(PlantSpeciesUpdatedEventHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
		private readonly assertPlantSpeciesExistsService: AssertPlantSpeciesExistsService,
		private readonly plantSpeciesViewModelBuilder: PlantSpeciesViewModelBuilder,
	) {}

	/**
	 * Handles the PlantSpeciesUpdatedEvent event by updating the plant species view model.
	 *
	 * @param event - The PlantSpeciesUpdatedEvent event to handle
	 */
	async handle(event: PlantSpeciesUpdatedEvent) {
		try {
			this.logger.log(`Handling plant species updated event: ${event.entityId}`);

			this.logger.debug(
				`Plant species updated event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Get the plant species aggregate to have the complete state
			const plantSpeciesAggregate =
				await this.assertPlantSpeciesExistsService.execute(event.entityId);

			// 02: Rebuild the plant species view model from the aggregate
			const plantSpeciesViewModel: PlantSpeciesViewModel =
				this.plantSpeciesViewModelBuilder
					.reset()
					.fromAggregate(plantSpeciesAggregate)
					.build();

			// 03: Save the updated plant species view model
			await this.plantSpeciesReadRepository.save(plantSpeciesViewModel);
		} catch (error) {
			this.logger.error(
				`Failed to handle plant species updated event: ${event.entityId}`,
				error,
			);
		}
	}
}
