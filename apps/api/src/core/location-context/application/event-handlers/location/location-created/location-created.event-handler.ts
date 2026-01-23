import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { LocationCreatedEvent } from '@/core/location-context/application/events/location/location-created/location-created.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationViewModelBuilder } from '@/core/location-context/domain/builders/view-models/location-view-model/location-view-model.builder';
import {
	ILocationReadRepository,
	LOCATION_READ_REPOSITORY_TOKEN,
} from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';

/**
 * Event handler for LocationCreatedEvent.
 *
 * @remarks
 * This handler creates a new location view model when a location is created,
 * ensuring the read model is synchronized with the write model.
 */
@EventsHandler(LocationCreatedEvent)
export class LocationCreatedEventHandler
	implements IEventHandler<LocationCreatedEvent>
{
	private readonly logger = new Logger(LocationCreatedEventHandler.name);

	constructor(
		@Inject(LOCATION_READ_REPOSITORY_TOKEN)
		private readonly locationReadRepository: ILocationReadRepository,
		private readonly assertLocationExistsService: AssertLocationExistsService,
		private readonly locationViewModelBuilder: LocationViewModelBuilder,
	) {}

	/**
	 * Handles the LocationCreatedEvent event by creating a new location view model.
	 *
	 * @param event - The LocationCreatedEvent event to handle
	 */
	async handle(event: LocationCreatedEvent) {
		this.logger.log(`Handling location created event: ${event.entityId}`);

		this.logger.debug(
			`Location created event data: ${JSON.stringify(event.data)}`,
		);

		// 01: Get the location aggregate to have the complete state
		const locationAggregate = await this.assertLocationExistsService.execute(
			event.entityId,
		);

		// 02: Create the location view model from the aggregate
		const locationViewModel: LocationViewModel =
			this.locationViewModelBuilder.fromAggregate(locationAggregate).build();

		// 03: Save the location view model
		await this.locationReadRepository.save(locationViewModel);
	}
}
