import { Column, Entity, Index } from 'typeorm';

import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { BaseTypeormEntity } from '@/shared/infrastructure/database/typeorm/entities/base-typeorm.entity';

@Entity('plant_species')
export class PlantSpeciesTypeormEntity extends BaseTypeormEntity {
	@Column({ type: 'varchar', length: 100 })
	commonName: string;

	@Column({ type: 'varchar', length: 150, unique: true })
	@Index()
	scientificName: string;

	@Column({ type: 'varchar', length: 100, nullable: true })
	family: string | null;

	@Column({ type: 'text', nullable: true })
	description: string | null;

	@Column({ type: 'enum', enum: PlantSpeciesCategoryEnum })
	category: PlantSpeciesCategoryEnum;

	@Column({ type: 'enum', enum: PlantSpeciesDifficultyEnum })
	difficulty: PlantSpeciesDifficultyEnum;

	@Column({ type: 'enum', enum: PlantSpeciesGrowthRateEnum })
	growthRate: PlantSpeciesGrowthRateEnum;

	@Column({ type: 'enum', enum: PlantSpeciesLightRequirementsEnum })
	lightRequirements: PlantSpeciesLightRequirementsEnum;

	@Column({ type: 'enum', enum: PlantSpeciesWaterRequirementsEnum })
	waterRequirements: PlantSpeciesWaterRequirementsEnum;

	@Column({ type: 'jsonb', nullable: true })
	temperatureRange: { min: number; max: number } | null;

	@Column({ type: 'enum', enum: PlantSpeciesHumidityRequirementsEnum })
	humidityRequirements: PlantSpeciesHumidityRequirementsEnum;

	@Column({ type: 'enum', enum: PlantSpeciesSoilTypeEnum })
	soilType: PlantSpeciesSoilTypeEnum;

	@Column({ type: 'jsonb', nullable: true })
	phRange: { min: number; max: number } | null;

	@Column({ type: 'jsonb', nullable: true })
	matureSize: { height: number; width: number } | null;

	@Column({ type: 'integer', nullable: true })
	growthTime: number | null;

	@Column({ type: 'jsonb', nullable: true })
	tags: string[] | null;

	@Column({ type: 'boolean', default: false })
	isVerified: boolean;

	@Column({ type: 'uuid', nullable: true })
	contributorId: string | null;
}
