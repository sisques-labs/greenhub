import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { GrowingUnitPlantAddedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
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
 * Event handler for GrowingUnitPlantAddedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant is added to a growing unit,
 * ensuring the read model is synchronized with the write model. This event is triggered
 * when a plant is added to a growing unit (including during transplant operations).
 */
@EventsHandler(GrowingUnitPlantAddedEvent)
export class GrowingUnitPlantAddedEventHandler
	implements IEventHandler<GrowingUnitPlantAddedEvent>
{
	private readonly logger = new Logger(GrowingUnitPlantAddedEventHandler.name);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
		@Inject(PLANT_READ_REPOSITORY_TOKEN)
		private readonly plantReadRepository: IPlantReadRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly assertPlantExistsInGrowingUnitService: AssertPlantExistsInGrowingUnitService,
		private readonly growingUnitViewModelBuilder: GrowingUnitViewModelBuilder,
		private readonly plantViewModelBuilder: PlantViewModelBuilder,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Handles the GrowingUnitPlantAddedEvent event by updating the growing unit view model.
	 *
	 * @param event - The GrowingUnitPlantAddedEvent event to handle
	 */
	async handle(event: GrowingUnitPlantAddedEvent) {
		this.logger.log(
			`Handling growing unit plant added event: ${event.entityId}`,
		);

		this.logger.debug(
			`Growing unit plant added event data: ${JSON.stringify(event.data)}`,
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

		// 04: Create the updated plant view model
		const plantViewModel: PlantViewModel = this.plantViewModelBuilder
			.reset()
			.fromEntity(plantEntity)
			.withGrowingUnitId(growingUnitAggregate.id.value)
			.build();

		// 05: Create the updated growing unit view model from the aggregate
		const growingUnitViewModel: GrowingUnitViewModel =
			this.growingUnitViewModelBuilder
				.reset()
				.fromAggregate(growingUnitAggregate)
				.withLocation(locationViewModel)
				.build();

		// 06: Save both view models
		await Promise.all([
			this.plantReadRepository.save(plantViewModel),
			this.growingUnitReadRepository.save(growingUnitViewModel),
		]);
	}
}
