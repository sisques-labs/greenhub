import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { GrowingUnitDeletedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import {
	GROWING_UNIT_READ_REPOSITORY_TOKEN,
	IGrowingUnitReadRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';

/**
 * Event handler for GrowingUnitDeletedEvent.
 *
 * @remarks
 * This handler deletes the growing unit view model when a growing unit is deleted,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(GrowingUnitDeletedEvent)
export class GrowingUnitDeletedEventHandler
	implements IEventHandler<GrowingUnitDeletedEvent>
{
	private readonly logger = new Logger(GrowingUnitDeletedEventHandler.name);

	constructor(
		@Inject(GROWING_UNIT_READ_REPOSITORY_TOKEN)
		private readonly growingUnitReadRepository: IGrowingUnitReadRepository,
	) {}

	/**
	 * Handles the GrowingUnitDeletedEvent event by deleting the growing unit view model.
	 *
	 * @param event - The GrowingUnitDeletedEvent event to handle
	 */
	async handle(event: GrowingUnitDeletedEvent) {
		try {
			this.logger.log(`Handling growing unit deleted event: ${event.entityId}`);

			this.logger.debug(
				`Growing unit deleted event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Delete the growing unit view model
			await this.growingUnitReadRepository.delete(event.entityId);
		} catch (error) {
			this.logger.error(
				`Failed to handle growing unit deleted event: ${event.entityId}`,
				error,
			);
		}
	}
}
