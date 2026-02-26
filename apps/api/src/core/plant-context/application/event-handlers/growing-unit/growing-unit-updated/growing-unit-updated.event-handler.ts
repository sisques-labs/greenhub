import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { GrowingUnitUpdatedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-updated/growing-unit-updated.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';

/**
 * Event handler for GrowingUnitUpdatedEvent.
 *
 * @remarks
 * This handler updates a growing unit view model when a growing unit is updated,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitUpdatedEvent)
export class GrowingUnitUpdatedEventHandler
	implements IEventHandler<GrowingUnitUpdatedEvent>
{
	private readonly logger = new Logger(GrowingUnitUpdatedEventHandler.name);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly growingUnitViewModelBuilder: GrowingUnitViewModelBuilder,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Handles the GrowingUnitUpdatedEvent event by updating a growing unit view model.
	 *
	 * @param event - The GrowingUnitUpdatedEvent event to handle
	 */
	async handle(event: GrowingUnitUpdatedEvent) {
		try {
			this.logger.log(`Handling growing unit updated event: ${event.entityId}`);

			this.logger.debug(
				`Growing unit updated event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Get the growing unit aggregate to have the complete state
			const growingUnitAggregate =
				await this.assertGrowingUnitExistsService.execute(event.entityId);

			const locationViewModel = await this.queryBus.execute(
				new LocationViewModelFindByIdQuery({
					id: growingUnitAggregate.locationId.value,
				}),
			);

			// 02: Update the growing unit view model from the aggregate
			const growingUnitViewModel: GrowingUnitViewModel =
				this.growingUnitViewModelBuilder
					.reset()
					.fromAggregate(growingUnitAggregate)
					.withLocation(locationViewModel)
					.build();

			// 03: Save the updated growing unit view model
			await this.growingUnitReadRepository.save(growingUnitViewModel);
		} catch (error) {
			this.logger.error(
				`Failed to handle growing unit updated event: ${event.entityId}`,
				error,
			);
		}
	}
}
