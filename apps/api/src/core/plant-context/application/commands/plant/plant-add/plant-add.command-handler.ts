import { PlantAddCommand } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitPlantAddedEvent } from '@/core/plant-context/domain/events/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { GrowingUnitFullCapacityException } from '@/core/plant-context/domain/exceptions/growing-unit/growing-unit-full-capacity/growing-unit-full-capacity.exception';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import {
	GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
	IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { PublishDomainEventsService } from '@/shared/application/services/publish-domain-events/publish-domain-events.service';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

/**
 * Handles the {@link PlantAddCommand} to add a new plant to a growing unit.
 *
 * @remarks
 * This command handler locates the growing unit aggregate, creates a new plant entity,
 * adds it to the growing unit (if capacity allows), saves the aggregate, and publishes domain events.
 *
 * @public
 */
@CommandHandler(PlantAddCommand)
export class PlantAddCommandHandler
	implements ICommandHandler<PlantAddCommand>
{
	/**
	 * Logger instance for the handler.
	 */
	private readonly logger = new Logger(PlantAddCommandHandler.name);

	/**
	 * Creates a new instance of {@link PlantAddCommandHandler}.
	 *
	 * @param growingUnitWriteRepository - The write repository for persisting growing unit aggregates.
	 * @param assertGrowingUnitExistsService - Service that ensures the growing unit exists.
	 * @param plantEntityFactory - Factory for creating plant entities.
	 * @param publishIntegrationEventsService - Service for publishing integration events.
	 * @param publishDomainEventsService - Service for publishing domain events.
	 */
	constructor(
		@Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
		private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
		private readonly assertGrowingUnitExistsService: AssertGrowingUnitExistsService,
		private readonly plantEntityFactory: PlantEntityFactory,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
		private readonly publishDomainEventsService: PublishDomainEventsService,
	) {}

	/**
	 * Executes the {@link PlantAddCommand}, adding a plant to the growing unit and persisting changes.
	 *
	 * @param command - The command containing the growing unit id and plant data.
	 * @returns A promise that resolves to the created plant id when the operation and event publication are complete.
	 */
	async execute(command: PlantAddCommand): Promise<string> {
		this.logger.log(
			`Executing add plant command to growing unit: ${command.growingUnitId.value}`,
		);

		// 01: Find the growing unit aggregate (aggregate root)
		const growingUnitAggregate: GrowingUnitAggregate =
			await this.assertGrowingUnitExistsService.execute(
				command.growingUnitId.value,
			);

		// 02: Check if the growing unit has capacity
		if (!growingUnitAggregate.hasCapacity()) {
			this.logger.error(
				`Growing unit ${command.growingUnitId.value} is at full capacity`,
			);
			throw new GrowingUnitFullCapacityException(command.growingUnitId.value);
		}

		const plantEntity: PlantEntity = this.plantEntityFactory.create({
			id: command.id,
			name: command.name,
			species: command.species,
			plantedDate: command.plantedDate,
			notes: command.notes,
			status: command.status,
		});

		// 04: Add the plant to the growing unit aggregate
		growingUnitAggregate.addPlant(plantEntity);

		// 05: Save the growing unit aggregate
		await this.growingUnitWriteRepository.save(growingUnitAggregate);

		// 06: Publish all domain events
		await this.publishDomainEventsService.execute(
			growingUnitAggregate.getUncommittedEvents(),
		);
		await growingUnitAggregate.commit();

		// 07: Publish the PlantCreatedEvent integration event
		await this.publishIntegrationEventsService.execute(
			// TODO: Use an integration event instead of a domain event
			new GrowingUnitPlantAddedEvent(
				{
					aggregateRootId: growingUnitAggregate.id.value,
					aggregateRootType: GrowingUnitAggregate.name,
					entityId: plantEntity.id.value,
					entityType: PlantEntity.name,
					eventType: GrowingUnitPlantAddedEvent.name,
				},
				{
					plant: plantEntity.toPrimitives(),
				},
			),
		);

		// 08: Return the created plant id
		return command.id.value;
	}
}
