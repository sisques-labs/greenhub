import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import {
	ILocationWriteRepository,
	LOCATION_WRITE_REPOSITORY_TOKEN,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

/**
 * Command handler for deleting a location.
 *
 * @remarks
 * This handler orchestrates the deletion of a location aggregate, removes it from the write repository,
 * and publishes domain events.
 */
@CommandHandler(LocationDeleteCommand)
export class LocationDeleteCommandHandler
	extends BaseCommandHandler<LocationDeleteCommand, LocationAggregate>
	implements ICommandHandler<LocationDeleteCommand>
{
	private readonly logger = new Logger(LocationDeleteCommandHandler.name);

	constructor(
		@Inject(LOCATION_WRITE_REPOSITORY_TOKEN)
		private readonly locationWriteRepository: ILocationWriteRepository,
		private readonly assertLocationExistsService: AssertLocationExistsService,
		eventBus: EventBus,
	) {
		super(eventBus);
	}

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

		// 02: Call aggregate behavior to mark as deleted
		existingLocation.delete();

		// 03: Delete the location entity from repository
		await this.locationWriteRepository.delete(existingLocation.id.value);

		// 04: Publish the domain events
		await this.publishEvents(existingLocation);
	}
}
