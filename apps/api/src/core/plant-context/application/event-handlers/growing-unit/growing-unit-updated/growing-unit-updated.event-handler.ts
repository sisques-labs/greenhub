import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GrowingUnitUpdatedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-updated/growing-unit-updated.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitViewModelFactory } from '@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';

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
		private readonly growingUnitViewModelFactory: GrowingUnitViewModelFactory,
	) {}

	/**
	 * Handles the GrowingUnitUpdatedEvent event by updating a growing unit view model.
	 *
	 * @param event - The GrowingUnitUpdatedEvent event to handle
	 */
	async handle(event: GrowingUnitUpdatedEvent) {
		this.logger.log(`Handling growing unit updated event: ${event.entityId}`);

		this.logger.debug(
			`Growing unit updated event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Get the growing unit aggregate to have the complete state
		const growingUnitAggregate =
			await this.assertGrowingUnitExistsService.execute(event.entityId);

		// 02: Update the growing unit view model from the aggregate
		const growingUnitViewModel: GrowingUnitViewModel =
			this.growingUnitViewModelFactory.fromAggregate(growingUnitAggregate);

		// 03: Save the updated growing unit view model
		await this.growingUnitReadRepository.save(growingUnitViewModel);
	}
}
