import { PlantSpeciesDeleteCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-delete/plant-species-delete.command';
import { AssertPlantSpeciesExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-exists/assert-plant-species-exists.service';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import {
	IPlantSpeciesWriteRepository,
	PLANT_SPECIES_WRITE_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

/**
 * Command handler for deleting a plant species.
 *
 * @remarks
 * This handler orchestrates the soft deletion of a plant species aggregate.
 * It validates that the plant species exists before proceeding with deletion,
 * removes it from the write repository, and publishes domain events.
 *
 * @throws {PlantSpeciesNotFoundException} When the plant species does not exist
 */
@CommandHandler(PlantSpeciesDeleteCommand)
export class PlantSpeciesDeleteCommandHandler
	extends BaseCommandHandler<PlantSpeciesDeleteCommand, PlantSpeciesAggregate>
	implements ICommandHandler<PlantSpeciesDeleteCommand>
{
	private readonly logger = new Logger(PlantSpeciesDeleteCommandHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_WRITE_REPOSITORY_TOKEN)
		private readonly plantSpeciesWriteRepository: IPlantSpeciesWriteRepository,
		private readonly assertPlantSpeciesExistsService: AssertPlantSpeciesExistsService,
		eventBus: EventBus,
	) {
		super(eventBus);
	}

	/**
	 * Executes the plant species delete command.
	 *
	 * @param command - The command to execute
	 * @returns void
	 * @throws {PlantSpeciesNotFoundException} When the plant species does not exist
	 */
	async execute(command: PlantSpeciesDeleteCommand): Promise<void> {
		this.logger.log(
			`Executing delete plant species command by id: ${command.id.value}`,
		);

		// 01: Find the plant species by id
		const existingPlantSpecies: PlantSpeciesAggregate =
			await this.assertPlantSpeciesExistsService.execute(command.id.value);

		// 02: Call aggregate behavior to mark as deleted
		existingPlantSpecies.delete();

		// 03: Delete the plant species from the repository
		await this.plantSpeciesWriteRepository.delete(
			existingPlantSpecies.id.value,
		);

		// 04: Publish the domain events
		await this.publishEvents(existingPlantSpecies);
	}
}
