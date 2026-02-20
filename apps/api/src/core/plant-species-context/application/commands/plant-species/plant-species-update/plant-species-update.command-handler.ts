import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { PlantSpeciesUpdateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-update/plant-species-update.command';
import { PlantSpeciesScientificNameAlreadyInUseException } from '@/core/plant-species-context/application/exceptions/plant-species/plant-species-scientific-name-already-in-use/plant-species-scientific-name-already-in-use.exception';
import { PlantSpeciesUpdatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-updated/plant-species-updated.event';
import { AssertPlantSpeciesExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-exists/assert-plant-species-exists.service';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import {
	IPlantSpeciesWriteRepository,
	PLANT_SPECIES_WRITE_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { BaseCommandHandler } from '@/shared/application/commands/base/base-command.handler';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Handles the {@link PlantSpeciesUpdateCommand} to update an existing plant species entity.
 *
 * @remarks
 * This command handler locates an existing plant species aggregate, applies any provided updates,
 * saves the aggregate to the repository, and publishes any resulting domain events.
 */
@CommandHandler(PlantSpeciesUpdateCommand)
export class PlantSpeciesUpdateCommandHandler
	extends BaseCommandHandler<PlantSpeciesUpdateCommand, PlantSpeciesAggregate>
	implements ICommandHandler<PlantSpeciesUpdateCommand>
{
	private readonly logger = new Logger(PlantSpeciesUpdateCommandHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_WRITE_REPOSITORY_TOKEN)
		private readonly plantSpeciesWriteRepository: IPlantSpeciesWriteRepository,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
		private readonly assertPlantSpeciesExistsService: AssertPlantSpeciesExistsService,
		eventBus: EventBus,
	) {
		super(eventBus);
	}

	/**
	 * Executes the {@link PlantSpeciesUpdateCommand}, updating the specified plant species and
	 * persisting changes.
	 *
	 * @param command - The update command containing the plant species id and candidate changes.
	 * @returns A promise that resolves when the update operation and event publication are complete.
	 */
	async execute(command: PlantSpeciesUpdateCommand): Promise<void> {
		this.logger.log(
			`Executing update plant species command by id: ${command.id.value}`,
		);

		// 01: Assert that the plant species exists by its id.
		const existingPlantSpecies =
			await this.assertPlantSpeciesExistsService.execute(command.id.value);

		// 02: If scientific name is being updated, validate it is unique
		if (command.scientificName !== undefined) {
			const existingByScientificName =
				await this.plantSpeciesWriteRepository.findByScientificName(
					command.scientificName,
				);

			if (
				existingByScientificName &&
				existingByScientificName.id.value !== command.id.value
			) {
				this.logger.warn(
					`Plant species with scientific name "${command.scientificName.value}" already exists`,
				);
				throw new PlantSpeciesScientificNameAlreadyInUseException(
					command.scientificName.value,
				);
			}
		}

		// 03: Update plant species properties if new values are provided.
		if (command.commonName !== undefined) {
			existingPlantSpecies.changeCommonName(command.commonName);
		}

		if (command.scientificName !== undefined) {
			existingPlantSpecies.changeScientificName(command.scientificName);
		}

		if (command.family !== undefined) {
			existingPlantSpecies.changeFamily(command.family);
		}

		if (command.description !== undefined) {
			existingPlantSpecies.changeDescription(command.description);
		}

		if (command.category !== undefined) {
			existingPlantSpecies.changeCategory(command.category);
		}

		if (command.difficulty !== undefined) {
			existingPlantSpecies.changeDifficulty(command.difficulty);
		}

		if (command.growthRate !== undefined) {
			existingPlantSpecies.changeGrowthRate(command.growthRate);
		}

		if (command.lightRequirements !== undefined) {
			existingPlantSpecies.changeLightRequirements(command.lightRequirements);
		}

		if (command.waterRequirements !== undefined) {
			existingPlantSpecies.changeWaterRequirements(command.waterRequirements);
		}

		if (command.temperatureRange !== undefined) {
			existingPlantSpecies.changeTemperatureRange(command.temperatureRange);
		}

		if (command.humidityRequirements !== undefined) {
			existingPlantSpecies.changeHumidityRequirements(
				command.humidityRequirements,
			);
		}

		if (command.soilType !== undefined) {
			existingPlantSpecies.changeSoilType(command.soilType);
		}

		if (command.phRange !== undefined) {
			existingPlantSpecies.changePhRange(command.phRange);
		}

		if (command.matureSize !== undefined) {
			existingPlantSpecies.changeMatureSize(command.matureSize);
		}

		if (command.growthTime !== undefined) {
			existingPlantSpecies.changeGrowthTime(command.growthTime);
		}

		if (command.tags !== undefined) {
			existingPlantSpecies.changeTags(command.tags);
		}

		// 04: Save the plant species aggregate
		await this.plantSpeciesWriteRepository.save(existingPlantSpecies);

		// 05: Publish all domain events
		await this.publishEvents(existingPlantSpecies);

		// 06: Publish the integration event for the PlantSpeciesUpdatedEvent
		await this.publishIntegrationEventsService.execute(
			new PlantSpeciesUpdatedEvent(
				{
					aggregateRootId: existingPlantSpecies.id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: existingPlantSpecies.id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesUpdatedEvent.name,
				},
				{ ...existingPlantSpecies.toPrimitives() },
			),
		);
	}
}
