import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { LocationUpdateCommand } from '@/core/location-context/application/commands/location/location-update/location-update.command';
import { LocationUpdatedEvent } from '@/core/location-context/application/events/location/location-updated/location-updated.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import {
	ILocationWriteRepository,
	LOCATION_WRITE_REPOSITORY_TOKEN,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Handles the {@link LocationUpdateCommand} to update an existing location entity.
 *
 * @remarks
 * This command handler locates an existing location aggregate, applies any provided updates,
 * saves the aggregate to the repository, and publishes any resulting domain events.
 */
@CommandHandler(LocationUpdateCommand)
export class LocationUpdateCommandHandler
	implements ICommandHandler<LocationUpdateCommand>
{
	/**
	 * Logger instance for the handler.
	 */
	private readonly logger = new Logger(LocationUpdateCommandHandler.name);

	/**
	 * Creates a new instance of {@link LocationUpdateCommandHandler}.
	 *
	 * @param locationWriteRepository - The write repository for persisting location aggregates.
	 * @param eventBus - The event bus for publishing domain events.
	 * @param assertLocationExistsService - Service that ensures the target entity exists.
	 * @param publishIntegrationEventsService - Service for publishing integration events.
	 */
	constructor(
		@Inject(LOCATION_WRITE_REPOSITORY_TOKEN)
		private readonly locationWriteRepository: ILocationWriteRepository,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
		private readonly assertLocationExistsService: AssertLocationExistsService,
		private eventBus: EventBus,
	) {}

	/**
	 * Executes the {@link LocationUpdateCommand}, updating the specified location and
	 * persisting changes.
	 *
	 * @param command - The update command containing the location id and candidate changes.
	 * @returns A promise that resolves when the update operation and event publication are complete.
	 */
	async execute(command: LocationUpdateCommand): Promise<void> {
		this.logger.log(
			`Executing update location command by id: ${command.id.value}`,
		);

		// 01: Assert that the location exists by its id.
		const existingLocation = await this.assertLocationExistsService.execute(
			command.id.value,
		);

		// 02: Update location properties if new values are provided.
		if (command.name !== undefined) {
			existingLocation.changeName(command.name);
		}

		if (command.type !== undefined) {
			existingLocation.changeType(command.type);
		}

		if (command.description !== undefined) {
			existingLocation.changeDescription(command.description);
		}

		// 03: Save the location entity
		await this.locationWriteRepository.save(existingLocation);

		// 04: Publish all domain events
		await this.eventBus.publishAll(existingLocation.getUncommittedEvents());
		await existingLocation.commit();

		// 05: Publish the integration event for the LocationUpdatedEvent
		await this.publishIntegrationEventsService.execute(
			new LocationUpdatedEvent(
				{
					aggregateRootId: existingLocation.id.value,
					aggregateRootType: LocationAggregate.name,
					entityId: existingLocation.id.value,
					entityType: LocationAggregate.name,
					eventType: LocationUpdatedEvent.name,
				},
				{
					id: existingLocation.id.value,
					name: existingLocation.name.value,
					type: existingLocation.type.value,
					description: existingLocation.description?.value ?? null,
					parentLocationId: null,
				},
			),
		);
	}
}
