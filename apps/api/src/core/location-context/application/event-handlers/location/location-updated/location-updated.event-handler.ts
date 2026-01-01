import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LocationUpdatedEvent } from '@/core/location-context/application/events/location/location-updated/location-updated.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationViewModelFactory } from '@/core/location-context/domain/factories/view-models/location-view-model/location-view-model.factory';
import {
	ILocationReadRepository,
	LOCATION_READ_REPOSITORY_TOKEN,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';

/**
 * Event handler for LocationUpdatedEvent.
 *
 * @remarks
 * This handler updates a location view model when a location is updated,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(LocationUpdatedEvent)
export class LocationUpdatedEventHandler
	implements IEventHandler<LocationUpdatedEvent>
{
	private readonly logger = new Logger(LocationUpdatedEventHandler.name);

	constructor(
		@Inject(LOCATION_READ_REPOSITORY_TOKEN)
		private readonly locationReadRepository: ILocationReadRepository,
		private readonly assertLocationExistsService: AssertLocationExistsService,
		private readonly locationViewModelFactory: LocationViewModelFactory,
	) {}

	/**
	 * Handles the LocationUpdatedEvent event by updating a location view model.
	 *
	 * @param event - The LocationUpdatedEvent event to handle
	 */
	async handle(event: LocationUpdatedEvent) {
		this.logger.log(`Handling location updated event: ${event.entityId}`);

		this.logger.debug(
			`Location updated event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Get the location aggregate to have the complete state
		const locationAggregate = await this.assertLocationExistsService.execute(
			event.entityId,
		);

		// 02: Get existing view model to preserve calculated fields
		const existingViewModel = await this.locationReadRepository.findById(
			event.entityId,
		);

		// 03: Create the location view model from the aggregate
		// Preserve calculated fields from existing view model if it exists
		const locationViewModel: LocationViewModel =
			this.locationViewModelFactory.fromAggregate(locationAggregate);

		// 04: Save the updated location view model
		await this.locationReadRepository.save(locationViewModel);
	}
}
