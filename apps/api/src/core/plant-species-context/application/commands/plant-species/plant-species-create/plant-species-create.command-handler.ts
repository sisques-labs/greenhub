import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PlantSpeciesCreateCommand } from '@/core/plant-species-context/application/commands/plant-species/plant-species-create/plant-species-create.command';
import { PlantSpeciesScientificNameAlreadyInUseException } from '@/core/plant-species-context/application/exceptions/plant-species/plant-species-scientific-name-already-in-use/plant-species-scientific-name-already-in-use.exception';
import { PlantSpeciesCreatedEvent } from '@/core/plant-species-context/application/events/plant-species/plant-species-created/plant-species-created.event';
import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesAggregateBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-aggregate.builder';
import {
	IPlantSpeciesWriteRepository,
	PLANT_SPECIES_WRITE_REPOSITORY_TOKEN,
} from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';

/**
 * Command handler for creating a new plant species.
 *
 * @remarks
 * This handler orchestrates the creation of a plant species aggregate, validates
 * uniqueness of the scientific name, saves it to the write repository, and publishes domain events.
 */
@CommandHandler(PlantSpeciesCreateCommand)
export class PlantSpeciesCreateCommandHandler
	implements ICommandHandler<PlantSpeciesCreateCommand>
{
	private readonly logger = new Logger(PlantSpeciesCreateCommandHandler.name);

	constructor(
		@Inject(PLANT_SPECIES_WRITE_REPOSITORY_TOKEN)
		private readonly plantSpeciesWriteRepository: IPlantSpeciesWriteRepository,
		private readonly plantSpeciesAggregateBuilder: PlantSpeciesAggregateBuilder,
		private readonly publishIntegrationEventsService: PublishIntegrationEventsService,
	) {}

	/**
	 * Executes the plant species create command.
	 *
	 * @param command - The command to execute
	 * @returns The created plant species id
	 */
	async execute(command: PlantSpeciesCreateCommand): Promise<string> {
		this.logger.log(`Executing plant species create command`);

		// 01: Validate that the scientific name is unique
		const existingByScientificName =
			await this.plantSpeciesWriteRepository.findByScientificName(
				command.scientificName,
			);

		if (existingByScientificName) {
			this.logger.warn(
				`Plant species with scientific name "${command.scientificName.value}" already exists`,
			);
			throw new PlantSpeciesScientificNameAlreadyInUseException(
				command.scientificName.value,
			);
		}

		// 02: Build the plant species aggregate
		const builder = this.plantSpeciesAggregateBuilder.reset();

		builder.withId(command.id).withCommonName(command.commonName).withScientificName(command.scientificName).withCategory(command.category).withDifficulty(command.difficulty).withGrowthRate(command.growthRate).withLightRequirements(command.lightRequirements).withWaterRequirements(command.waterRequirements);

		if (command.family) {
			builder.withFamily(command.family);
		}

		if (command.description) {
			builder.withDescription(command.description);
		}

		if (command.temperatureRange) {
			builder.withTemperatureRange(command.temperatureRange);
		}

		if (command.humidityRequirements) {
			builder.withHumidityRequirements(command.humidityRequirements);
		}

		if (command.soilType) {
			builder.withSoilType(command.soilType);
		}

		if (command.phRange) {
			builder.withPhRange(command.phRange);
		}

		if (command.matureSize) {
			builder.withMatureSize(command.matureSize);
		}

		if (command.growthTime) {
			builder.withGrowthTime(command.growthTime);
		}

		if (command.tags) {
			builder.withTags(command.tags);
		}

		if (command.contributorId) {
			builder.withContributorId(command.contributorId);
		}

		const plantSpecies = builder.build();

		// 03: Save the plant species aggregate
		await this.plantSpeciesWriteRepository.save(plantSpecies);

		// 04: Publish the PlantSpeciesCreatedEvent
		await this.publishIntegrationEventsService.execute(
			new PlantSpeciesCreatedEvent(
				{
					aggregateRootId: plantSpecies.id.value,
					aggregateRootType: PlantSpeciesAggregate.name,
					entityId: plantSpecies.id.value,
					entityType: PlantSpeciesAggregate.name,
					eventType: PlantSpeciesCreatedEvent.name,
				},
				{ ...plantSpecies.toPrimitives() },
			),
		);

		// 05: Return the plant species id
		return plantSpecies.id.value;
	}
}
