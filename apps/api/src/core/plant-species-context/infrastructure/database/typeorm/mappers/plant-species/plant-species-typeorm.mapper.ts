import { Injectable, Logger } from '@nestjs/common';

import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { PlantSpeciesAggregateBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-aggregate.builder';
import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { PlantSpeciesTypeormEntity } from '@/core/plant-species-context/infrastructure/database/typeorm/entities/plant-species-typeorm.entity';

/**
 * Mapper for converting between PlantSpeciesTypeormEntity database entities and PlantSpeciesAggregate domain objects.
 *
 * @remarks
 * This mapper handles the transformation between the infrastructure layer (PlantSpeciesTypeormEntity)
 * and the domain layer (PlantSpeciesAggregate), ensuring proper conversion of value objects and primitives.
 */
@Injectable()
export class PlantSpeciesTypeormMapper {
	private readonly logger = new Logger(PlantSpeciesTypeormMapper.name);

	constructor(
		private readonly plantSpeciesAggregateBuilder: PlantSpeciesAggregateBuilder,
	) {}

	/**
	 * Converts a TypeORM entity to a plant species aggregate.
	 *
	 * @param entity - The TypeORM entity to convert
	 * @returns The plant species aggregate
	 */
	toDomainEntity(entity: PlantSpeciesTypeormEntity): PlantSpeciesAggregate {
		this.logger.log(
			`Converting TypeORM entity to domain entity with id ${entity.id}`,
		);

		return this.plantSpeciesAggregateBuilder
			.reset()
			.fromPrimitives({
				id: entity.id,
				commonName: entity.commonName,
				scientificName: entity.scientificName,
				family: entity.family ?? '',
				description: entity.description ?? '',
				category: entity.category,
				difficulty: entity.difficulty,
				growthRate: entity.growthRate,
				lightRequirements: entity.lightRequirements,
				waterRequirements: entity.waterRequirements,
				temperatureRange: entity.temperatureRange ?? { min: 0, max: 0 },
				humidityRequirements: entity.humidityRequirements,
				soilType: entity.soilType,
				phRange: entity.phRange ?? { min: 0, max: 0 },
				matureSize: entity.matureSize ?? { height: 0, width: 0 },
				growthTime: entity.growthTime ?? 0,
				tags: entity.tags ?? [],
				isVerified: entity.isVerified,
				contributorId: entity.contributorId,
				createdAt: entity.createdAt,
				updatedAt: entity.updatedAt,
				deletedAt: entity.deletedAt,
			})
			.build();
	}

	/**
	 * Converts a plant species aggregate to a TypeORM entity.
	 *
	 * @param aggregate - The plant species aggregate to convert
	 * @returns The TypeORM entity
	 */
	toTypeormEntity(aggregate: PlantSpeciesAggregate): PlantSpeciesTypeormEntity {
		this.logger.log(
			`Converting domain entity with id ${aggregate.id.value} to TypeORM entity`,
		);

		const primitives = aggregate.toPrimitives();

		const entity = new PlantSpeciesTypeormEntity();

		entity.id = primitives.id;
		entity.commonName = primitives.commonName;
		entity.scientificName = primitives.scientificName;
		entity.family = primitives.family;
		entity.description = primitives.description;
		entity.category = primitives.category as PlantSpeciesCategoryEnum;
		entity.difficulty = primitives.difficulty as PlantSpeciesDifficultyEnum;
		entity.growthRate = primitives.growthRate as PlantSpeciesGrowthRateEnum;
		entity.lightRequirements =
			primitives.lightRequirements as PlantSpeciesLightRequirementsEnum;
		entity.waterRequirements =
			primitives.waterRequirements as PlantSpeciesWaterRequirementsEnum;
		entity.temperatureRange = primitives.temperatureRange;
		entity.humidityRequirements =
			primitives.humidityRequirements as PlantSpeciesHumidityRequirementsEnum;
		entity.soilType = primitives.soilType as PlantSpeciesSoilTypeEnum;
		entity.phRange = primitives.phRange;
		entity.matureSize = primitives.matureSize;
		entity.growthTime = primitives.growthTime;
		entity.tags = primitives.tags;
		entity.isVerified = primitives.isVerified;
		entity.contributorId = primitives.contributorId;

		return entity;
	}
}
