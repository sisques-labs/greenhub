import { LocationViewModelFindByIdQuery } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query';
import { GrowingUnitCreatedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-created/growing-unit-created.event';
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
 * Event handler for GrowingUnitCreatedEvent.
 *
 * @remarks
 * This handler creates a new growing unit view model when a growing unit is created,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitCreatedEvent)
export class GrowingUnitCreatedEventHandler
	implements IEventHandler<GrowingUnitCreatedEvent>
{
	private readonly logger = new Logger(GrowingUnitCreatedEventHandler.name);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly growingUnitViewModelBuilder: GrowingUnitViewModelBuilder,
		private readonly queryBus: QueryBus,
	) {}

	/**
	 * Handles the GrowingUnitCreatedEvent event by creating a new growing unit view model.
	 *
	 * @param event - The GrowingUnitCreatedEvent event to handle
	 */
	async handle(event: GrowingUnitCreatedEvent) {
		try {
			this.logger.log(`Handling growing unit created event: ${event.entityId}`);

			this.logger.debug(
				`Growing unit created event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Get the growing unit aggregate to have the complete state
			const growingUnitAggregate =
				await this.assertGrowingUnitExistsService.execute(event.entityId);

			const locationViewModel = await this.queryBus.execute(
				new LocationViewModelFindByIdQuery({
					id: growingUnitAggregate.locationId.value,
				}),
			);

			// 02: Create the growing unit view model from the aggregate
			const growingUnitViewModel: GrowingUnitViewModel =
				this.growingUnitViewModelBuilder
					.reset()
					.fromAggregate(growingUnitAggregate)
					.withLocation(locationViewModel)
					.build();

			// 03: Save the growing unit view model
			await this.growingUnitReadRepository.save(growingUnitViewModel);
		} catch (error) {
			this.logger.error(
				`Failed to handle growing unit created event: ${event.entityId}`,
				error,
			);
		}
	}
}
