import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LocationCreateCommand } from '@/core/location-context/application/commands/location/location-create/location-create.command';
import { LocationCreatedEvent } from '@/core/location-context/application/events/location/location-created/location-created.event';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationAggregateFactory } from '@/core/location-context/domain/factories/aggregates/location-aggregate/location-aggregate.factory';
import {
	ILocationWriteRepository,
	LOCATION_WRITE_REPOSITORY_TOKEN,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Command handler for creating a new location.
 *
 * @remarks
 * This handler orchestrates the creation of a location aggregate, saves it to the write repository,
 * and publishes domain events.
 */
@CommandHandler(LocationCreateCommand)
export class LocationCreateCommandHandler
	implements ICommandHandler<LocationCreateCommand>
{
	private readonly logger = new Logger(LocationCreateCommandHandler.name);

	constructor(
		@Inject(LOCATION_WRITE_REPOSITORY_TOKEN)
		private readonly locationWriteRepository: ILocationWriteRepository,
		private readonly locationAggregateFactory: LocationAggregateFactory,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
	) {}

	/**
	 * Executes the location create command
	 *
	 * @param command - The command to execute
	 * @returns The created location id
	 */
	async execute(command: LocationCreateCommand): Promise<string> {
		this.logger.log(`Executing location create command: ${command}`);

		// 01: Create the location entity
		const location = this.locationAggregateFactory.create({
			...command,
		});

		// 02: Save the location entity
		await this.locationWriteRepository.save(location);

		// 03: Publish the LocationCreatedEvent
		await this.publishIntegrationEventsService.execute(
			new LocationCreatedEvent(
				{
					aggregateRootId: location.id.value,
					aggregateRootType: LocationAggregate.name,
					entityId: location.id.value,
					entityType: LocationAggregate.name,
					eventType: LocationCreatedEvent.name,
				},
				{
					id: location.id.value,
					name: location.name.value,
					type: location.type.value,
					description: location.description?.value ?? null,
					parentLocationId: null,
				},
			),
		);

		// 04: Return the location id
		return location.id.value;
	}
}
