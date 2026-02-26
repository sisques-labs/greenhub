import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { PlantCreatedEvent } from '@/core/plant-context/application/events/plant/plant-created/plant-created.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

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
		private readonly plantViewModelBuilder: PlantViewModelBuilder,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly assertPlantExistsInGrowingUnitService: AssertPlantExistsInGrowingUnitService,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Handles the PlantCreatedEvent event by creating a new plant view model.
	 *
	 * @param event - The PlantCreatedEvent event to handle
	 */
	async handle(event: PlantCreatedEvent) {
		try {
			this.logger.log(`Handling plant created event: ${event.entityId}`);

			this.logger.debug(
				`Plant created event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Get the growing unit aggregate to have the complete state
			const growingUnitAggregate =
				await this.assertGrowingUnitExistsService.execute(event.aggregateRootId);

			// 02: Get the plant entity from the growing unit aggregate
			const plantEntity =
				await this.assertPlantExistsInGrowingUnitService.execute({
					growingUnitAggregate,
					plantId: event.entityId,
				});

			// 03: Get the location view model
			const locationViewModel = await this.queryBus.execute(
				new LocationViewModelFindByIdQuery({
					id: growingUnitAggregate.locationId.value,
				}),
			);

			// 04: Create the growing unit reference with basic information
			const growingUnitReference = {
				id: growingUnitAggregate.id.value,
				name: growingUnitAggregate.name.value,
				type: growingUnitAggregate.type.value,
				capacity: growingUnitAggregate.capacity.value,
			};

			// 05: Create the plant view model with all information
			const plantViewModel: PlantViewModel = this.plantViewModelBuilder
				.reset()
				.fromEntity(plantEntity)
				.withGrowingUnitId(growingUnitAggregate.id.value)
				.withLocation(locationViewModel)
				.withGrowingUnit(growingUnitReference)
				.build();

			// 06: Save the plant view model
			await this.plantReadRepository.save(plantViewModel);
		} catch (error) {
			this.logger.error(
				`Failed to handle plant created event: ${event.entityId}`,
				error,
			);
		}
	}
}
