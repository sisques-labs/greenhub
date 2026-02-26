import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { GrowingUnitPlantRemovedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
/**
 * Event handler for GrowingUnitPlantRemovedEvent.
 *
 * @remarks
 * This handler updates the growing unit view model when a plant is removed from a growing unit,
 * ensuring the read model is synchronized with the write model. This event is triggered
 * when a plant is removed from a growing unit (including during transplant operations).
 *
 * Note: This handler only updates the growing unit view model. The plant view model is not updated here
 * because:
 * - If it's a transplant, the GrowingUnitPlantAddedEvent will update the plant's growingUnitId
 * - If the plant is actually deleted, the PlantDeletedEvent will handle the deletion
 */
@EventsHandler(GrowingUnitPlantRemovedEvent)
export class GrowingUnitPlantRemovedEventHandler
	implements IEventHandler<GrowingUnitPlantRemovedEvent>
{
	private readonly logger = new Logger(
		GrowingUnitPlantRemovedEventHandler.name,
	);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly growingUnitViewModelBuilder: GrowingUnitViewModelBuilder,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Handles the GrowingUnitPlantRemovedEvent event by updating the growing unit view model.
	 *
	 * @param event - The GrowingUnitPlantRemovedEvent event to handle
	 */
	async handle(event: GrowingUnitPlantRemovedEvent) {
		try {
			this.logger.log(
				`Handling growing unit plant removed event: ${event.entityId}`,
			);

			this.logger.debug(
				`Growing unit plant removed event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Get the growing unit aggregate to have the complete state
			const growingUnitAggregate =
				await this.assertGrowingUnitExistsService.execute(event.aggregateRootId);

			// 02: Get the location view model
			const locationViewModel = await this.queryBus.execute(
				new LocationViewModelFindByIdQuery({
					id: growingUnitAggregate.locationId.value,
				}),
			);

			// 03: Create the updated growing unit view model from the aggregate
			const growingUnitViewModel: GrowingUnitViewModel =
				this.growingUnitViewModelBuilder
					.reset()
					.fromAggregate(growingUnitAggregate)
					.withLocation(locationViewModel)
					.build();

			// 04: Save the updated growing unit view model
			// Note: We don't update the plant view model here because:
			// - If it's a transplant, GrowingUnitPlantAddedEvent will update the plant's growingUnitId
			// - If the plant is actually deleted, PlantDeletedEvent will handle the deletion
			await this.growingUnitReadRepository.save(growingUnitViewModel);
		} catch (error) {
			this.logger.error(
				`Failed to handle growing unit plant removed event: ${event.entityId}`,
				error,
			);
		}
	}
}
