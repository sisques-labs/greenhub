import { LocationDeleteCommand } from '@/core/location-context/application/commands/location/location-delete/location-delete.command';
import { LocationHasDependentGrowingUnitsException } from '@/core/location-context/application/exceptions/location/location-has-dependent-growing-units/location-has-dependent-growing-units.exception';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import {
	ILocationWriteRepository,
	LOCATION_WRITE_REPOSITORY_TOKEN,
} from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { GrowingUnitFindByLocationIdQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-location-id/growing-unit-find-by-location-id.query';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';
import { Inject, Logger } from '@nestjs/common';
import {
	CommandHandler,
	EventBus,
	ICommandHandler,
	QueryBus,
} from '@nestjs/cqrs';

/**
 * Command handler for deleting a location.
 *
 * @remarks
 * This handler orchestrates the deletion of a location aggregate. It validates that the location
 * has no dependent growing units before proceeding with deletion. If growing units are found,
 * it throws a LocationHasDependentGrowingUnitsException. On successful validation, it removes
 * the location from the write repository and publishes domain events.
 *
 * @throws {LocationNotFoundException} When the location does not exist
 * @throws {LocationHasDependentGrowingUnitsException} When the location has dependent growing units
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
		private readonly queryBus: QueryBus,
		eventBus: EventBus,
	) {
		super(eventBus);
	}

	/**
	 * Executes the location delete command.
	 *
	 * @param command - The command to execute
	 * @returns void
	 * @throws {LocationNotFoundException} When the location does not exist
	 * @throws {LocationHasDependentGrowingUnitsException} When the location has dependent growing units
	 */
	async execute(command: LocationDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing delete location command by id: ${command.id.value}`,
		);

		// 01: Find the location by id
		const existingLocation: LocationAggregate =
			await this.assertLocationExistsService.execute(command.id.value);

		// 02: Check for dependent growing units
		const growingUnits = await this.queryBus.execute(
			new GrowingUnitFindByLocationIdQuery({
				locationId: existingLocation.id.value,
			}),
		);

		if (growingUnits.length > 0) {
			this.logger.warn(
				`Cannot delete location ${command.id.value}. It has ${growingUnits.length} dependent growing units.`,
			);
			throw new LocationHasDependentGrowingUnitsException(
				existingLocation.id.value,
				growingUnits.length,
			);
		}

		// 02: Call aggregate behavior to mark as deleted
		existingLocation.delete();

		// 03: Delete the location from the repository
		await this.locationWriteRepository.delete(existingLocation.id.value);

		// 04: Publish the domain events
		await this.publishEvents(existingLocation);
	}
}
