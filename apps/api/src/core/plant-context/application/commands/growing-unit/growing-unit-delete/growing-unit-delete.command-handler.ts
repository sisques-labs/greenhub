import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GrowingUnitDeleteCommand } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command';
import { GrowingUnitDeletedEvent } from '@/core/plant-context/application/events/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import {
	GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
	IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Command handler for deleting a growing unit.
 *
 * @remarks
 * This handler orchestrates the deletion of a growing unit aggregate, removes it from the write repository,
 * and publishes domain events.
 */
@CommandHandler(GrowingUnitDeleteCommand)
export class GrowingUnitDeleteCommandHandler
	implements ICommandHandler<GrowingUnitDeleteCommand>
{
	private readonly logger = new Logger(GrowingUnitDeleteCommandHandler.name);

	constructor(
		@Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
		private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
	) {}

	/**
	 * Executes the growing unit delete command.
	 *
	 * @param command - The command to execute
	 * @returns void
	 */
	async execute(command: GrowingUnitDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing delete growing unit command by id: ${command.id.value}`,
		);

		// 01: Find the growing unit by id
		const existingGrowingUnit: GrowingUnitAggregate =
			await this.assertGrowingUnitExistsService.execute(command.id.value);

		// 02: Delete the growing unit
		existingGrowingUnit.delete();

		// 03: Delete the growing unit entity
		await this.growingUnitWriteRepository.delete(existingGrowingUnit.id.value);

		// 04: Publish all events
		await this.publishIntegrationEventsService.execute(
			new GrowingUnitDeletedEvent(
				{
					aggregateRootId: existingGrowingUnit.id.value,
					aggregateRootType: GrowingUnitAggregate.name,
					entityId: existingGrowingUnit.id.value,
					entityType: GrowingUnitAggregate.name,
					eventType: GrowingUnitDeletedEvent.name,
				},
				existingGrowingUnit.toPrimitives(),
			),
		);
	}
}
