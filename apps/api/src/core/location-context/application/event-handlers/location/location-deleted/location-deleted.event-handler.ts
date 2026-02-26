import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LocationDeletedEvent } from '@/core/location-context/application/events/location/location-deleted/location-deleted.event';
import {
	LOCATION_READ_REPOSITORY_TOKEN,
	ILocationReadRepository,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';

/**
 * Event handler for LocationDeletedEvent.
 *
 * @remarks
 * This handler deletes the location view model when a location is deleted,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(LocationDeletedEvent)
export class LocationDeletedEventHandler
	implements IEventHandler<LocationDeletedEvent>
{
	private readonly logger = new Logger(LocationDeletedEventHandler.name);

	constructor(
		@Inject(LOCATION_READ_REPOSITORY_TOKEN)
		private readonly locationReadRepository: ILocationReadRepository,
	) {}

	/**
	 * Handles the LocationDeletedEvent event by deleting the location view model.
	 *
	 * @param event - The LocationDeletedEvent event to handle
	 */
	async handle(event: LocationDeletedEvent) {
		try {
			this.logger.log(`Handling location deleted event: ${event.entityId}`);

			this.logger.debug(
				`Location deleted event data: ${JSON.stringify(event.data)}`,
			);

			// 01: Delete the location view model
			await this.locationReadRepository.delete(event.entityId);
		} catch (error) {
			this.logger.error(
				`Failed to handle location deleted event: ${event.entityId}`,
				error,
			);
		}
	}
}

