import { PlantSpeciesCreatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-created/plant-species-created.event';
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
 * Event handler for PlantSpeciesCreatedEvent.
 *
 * @remarks
 * This handler creates a new plant species view model when a plant species is created,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantSpeciesCreatedEvent)
export class PlantSpeciesCreatedEventHandler
	implements IEventHandler<PlantSpeciesCreatedEvent>
{
	private readonly logger = new Logger(PlantSpeciesCreatedEventHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_READ_REPOSITORY_TOKEN)
		private readonly plantSpeciesReadRepository: IPlantSpeciesReadRepository,
		private readonly assertPlantSpeciesExistsService: AssertPlantSpeciesExistsService,
		private readonly plantSpeciesViewModelBuilder: PlantSpeciesViewModelBuilder,
	) {}

	/**
	 * Handles the PlantSpeciesCreatedEvent event by creating a new plant species view model.
	 *
	 * @param event - The PlantSpeciesCreatedEvent event to handle
	 */
	async handle(event: PlantSpeciesCreatedEvent) {
		this.logger.log(`Handling plant species created event: ${event.entityId}`);

		this.logger.debug(
			`Plant species created event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Get the plant species aggregate to have the complete state
		const plantSpeciesAggregate =
			await this.assertPlantSpeciesExistsService.execute(event.entityId);

		// 02: Create the plant species view model from the aggregate
		const plantSpeciesViewModel: PlantSpeciesViewModel =
			this.plantSpeciesViewModelBuilder
				.reset()
				.fromAggregate(plantSpeciesAggregate)
				.build();

		// 03: Save the plant species view model
		await this.plantSpeciesReadRepository.save(plantSpeciesViewModel);
	}
}
