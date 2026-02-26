import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { PlantUpdatedEvent } from '@/core/plant-context/application/events/plant/plant-updated/plant-updated.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import {
	IPlantReadRepository,
	PLANT_READ_REPOSITORY_TOKEN,
} from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

/**
 * Event handler for PlantUpdatedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant is updated,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(PlantUpdatedEvent)
export class PlantUpdatedEventHandler
	implements IEventHandler<PlantUpdatedEvent>
{
	private readonly logger = new Logger(PlantUpdatedEventHandler.name);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
		@Inject(PLANT_READ_REPOSITORY_TOKEN)
		private readonly plantReadRepository: IPlantReadRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly growingUnitViewModelBuilder: GrowingUnitViewModelBuilder,
		private readonly plantViewModelBuilder: PlantViewModelBuilder,
		private readonly queryBus: QueryBus,
		private readonly assertPlantExistsInGrowingUnitService: AssertPlantExistsInGrowingUnitService,
	) {}

	/**
	 * Handles the PlantUpdatedEvent event by updating the growing unit view model.
	 *
	 * @param event - The PlantUpdatedEvent event to handle
	 */
	async handle(event: PlantUpdatedEvent) {
		try {
			this.logger.log(`Handling plant updated event: ${event.entityId}`);

			this.logger.debug(
				`Plant updated event data: ${JSON.stringify(event.data)}`,
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

			// 05: Create the updated plant view model
			const plantViewModel: PlantViewModel = this.plantViewModelBuilder
				.reset()
				.fromEntity(plantEntity)
				.withGrowingUnitId(growingUnitAggregate.id.value)
				.withLocation(locationViewModel)
				.withGrowingUnit(growingUnitReference)
				.build();

			// 06: Create the updated growing unit view model from the aggregate
			const growingUnitViewModel: GrowingUnitViewModel =
				this.growingUnitViewModelBuilder
					.reset()
					.fromAggregate(growingUnitAggregate)
					.withLocation(locationViewModel)
					.build();

			// 07: Save both view models
			await Promise.all([
				this.plantReadRepository.save(plantViewModel),
				this.growingUnitReadRepository.save(growingUnitViewModel),
			]);
		} catch (error) {
			this.logger.error(
				`Failed to handle plant updated event: ${event.entityId}`,
				error,
			);
		}
	}
}
