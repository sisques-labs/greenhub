import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationDeletedEvent } from '@/core/location-context/application/events/location/location-deleted/location-deleted.event';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import {
	LOCATION_WRITE_REPOSITORY_TOKEN,
	ILocationWriteRepository,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Command handler for deleting a location.
 *
 * @remarks
 * This handler orchestrates the deletion of a location aggregate, removes it from the write repository,
 * and publishes domain events.
 */
@CommandHandler(LocationDeleteCommand)
export class LocationDeleteCommandHandler
	implements ICommandHandler<LocationDeleteCommand>
{
	private readonly logger = new Logger(LocationDeleteCommandHandler.name);

	constructor(
		@Inject(LOCATION_WRITE_REPOSITORY_TOKEN)
		private readonly locationWriteRepository: ILocationWriteRepository,
		private readonly assertLocationExistsService: AssertLocationExistsService,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
	) {}

	/**
	 * Executes the location delete command.
	 *
	 * @param command - The command to execute
	 * @returns void
	 */
	async execute(command: LocationDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing delete location command by id: ${command.id.value}`,
		);

		// 01: Find the location by id
		const existingLocation: LocationAggregate =
			await this.assertLocationExistsService.execute(command.id.value);

		// 02: Delete the location entity
		await this.locationWriteRepository.delete(existingLocation.id.value);

		// 03: Publish the integration event LocationDeletedEvent
		await this.publishIntegrationEventsService.execute(
			new LocationDeletedEvent(
				{
					aggregateRootId: existingLocation.id.value,
					aggregateRootType: LocationAggregate.name,
					entityId: existingLocation.id.value,
					entityType: LocationAggregate.name,
					eventType: LocationDeletedEvent.name,
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

