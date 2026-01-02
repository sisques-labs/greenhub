import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { PlantUpdateCommand } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command';
import { PlantUpdatedEvent } from '@/core/plant-context/application/events/plant/plant-updated/plant-updated.event';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import {
	GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
	IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Handles the {@link GrowingUnitUpdateCommand} to update an existing growing unit (container) entity.
 *
 * @remarks
 * This command handler locates an existing growing unit aggregate, applies any provided updates,
 * saves the aggregate to the repository, and publishes any resulting domain events.
 *
 * @public
 */
@CommandHandler(PlantUpdateCommand)
export class PlantUpdateCommandHandler
	implements ICommandHandler<PlantUpdateCommand>
{
	/**
	 * Logger instance for the handler.
	 */
	private readonly logger = new Logger(PlantUpdateCommandHandler.name);

	/**
	 * Creates a new instance of {@link PlantUpdateCommandHandler}.
	 *
	 * @param growingUnitWriteRepository - The write repository for persisting growing unit aggregates.
	 * @param eventBus - The event bus for publishing domain events.
	 * @param assertGrowingUnitExistsService - Service that ensures the target entity exists.
	 * @param assertPlantExistsInGrowingUnitService - Service that ensures the plant exists in the growing unit.
	 * @param publishIntegrationEventsService - Service for publishing integration events.
	 */
	constructor(
		@Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
		private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
		private readonly eventBus: EventBus,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly assertPlantExistsInGrowingUnitService: AssertPlantExistsInGrowingUnitService,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
	) {}

	/**
	 * Executes the {@link GrowingUnitUpdateCommand}, updating the specified growing unit and
	 * persisting changes.
	 *
	 * @param command - The update command containing the growing unit id and candidate changes.
	 * @returns A promise that resolves when the update operation and event publication are complete.
	 */
	async execute(command: PlantUpdateCommand): Promise<void> {
		this.logger.log(
			`Executing update plant command by id: ${command.id.value}`,
		);

		// 02: Find the growing unit aggregate (aggregate root)
		const growingUnitAggregate: GrowingUnitAggregate =
			await this.assertGrowingUnitExistsService.execute(
				command.growingUnitId.value,
			);

		// 03: Assert that the plant exists in the growing unit
		const existingPlantEntity: PlantEntity =
			await this.assertPlantExistsInGrowingUnitService.execute({
				growingUnitAggregate,
				plantId: command.id.value,
			});

		// 03: Update the growing unit aggregate (aggregate root)
		if (command.name !== undefined) {
			growingUnitAggregate.changePlantName(command.id.value, command.name);
		}

		if (command.species !== undefined) {
			growingUnitAggregate.changePlantSpecies(
				command.id.value,
				command.species,
			);
		}

		if (command.plantedDate !== undefined) {
			growingUnitAggregate.changePlantPlantedDate(
				command.id.value,
				command.plantedDate,
			);
		}

		if (command.notes !== undefined) {
			growingUnitAggregate.changePlantNotes(command.id.value, command.notes);
		}

		if (command.status !== undefined) {
			growingUnitAggregate.changePlantStatus(command.id.value, command.status);
		}

		// 03: Save the growing unit entity
		await this.growingUnitWriteRepository.save(growingUnitAggregate);

		// 04: Publish all events
		await this.eventBus.publishAll(growingUnitAggregate.getUncommittedEvents());
		await growingUnitAggregate.commit();

		// 05: Publish the integration event PlantUpdatedEvent
		await this.publishIntegrationEventsService.execute(
			new PlantUpdatedEvent(
				{
					aggregateRootId: growingUnitAggregate.id.value,
					aggregateRootType: GrowingUnitAggregate.name,
					entityId: existingPlantEntity.id.value,
					entityType: PlantEntity.name,
					eventType: PlantUpdatedEvent.name,
				},
				existingPlantEntity.toPrimitives(),
			),
		);
	}
}
