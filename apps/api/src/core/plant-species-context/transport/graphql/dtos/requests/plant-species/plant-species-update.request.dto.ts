import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import {
	PlantSpeciesMatureSizeInputDto,
	PlantSpeciesPhRangeInputDto,
	PlantSpeciesTemperatureRangeInputDto,
} from '@/core/plant-species-context/transport/graphql/dtos/requests/plant-species/plant-species-create.request.dto';

@InputType('PlantSpeciesUpdateRequestDto')
export class PlantSpeciesUpdateRequestDto {
	@Field(() => String, {
		description: 'The id of the plant species to update',
	})
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@Field(() => String, {
		nullable: true,
		description: 'The common name of the plant species',
	})
	@IsString()
	@IsOptional()
	commonName?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The scientific name of the plant species',
	})
	@IsString()
	@IsOptional()
	scientificName?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The family of the plant species',
	})
	@IsString()
	@IsOptional()
	family?: string;

	@Field(() => String, {
		nullable: true,
		description: 'A description of the plant species',
	})
	@IsString()
	@IsOptional()
	description?: string;

	@Field(() => PlantSpeciesCategoryEnum, {
		nullable: true,
		description: 'The category of the plant species',
	})
	@IsEnum(PlantSpeciesCategoryEnum)
	@IsOptional()
	category?: PlantSpeciesCategoryEnum;

	@Field(() => PlantSpeciesDifficultyEnum, {
		nullable: true,
		description: 'The difficulty level of the plant species',
	})
	@IsEnum(PlantSpeciesDifficultyEnum)
	@IsOptional()
	difficulty?: PlantSpeciesDifficultyEnum;

	@Field(() => PlantSpeciesGrowthRateEnum, {
		nullable: true,
		description: 'The growth rate of the plant species',
	})
	@IsEnum(PlantSpeciesGrowthRateEnum)
	@IsOptional()
	growthRate?: PlantSpeciesGrowthRateEnum;

	@Field(() => PlantSpeciesLightRequirementsEnum, {
		nullable: true,
		description: 'The light requirements of the plant species',
	})
	@IsEnum(PlantSpeciesLightRequirementsEnum)
	@IsOptional()
	lightRequirements?: PlantSpeciesLightRequirementsEnum;

	@Field(() => PlantSpeciesWaterRequirementsEnum, {
		nullable: true,
		description: 'The water requirements of the plant species',
	})
	@IsEnum(PlantSpeciesWaterRequirementsEnum)
	@IsOptional()
	waterRequirements?: PlantSpeciesWaterRequirementsEnum;

	@Field(() => PlantSpeciesTemperatureRangeInputDto, {
		nullable: true,
		description: 'The temperature range the plant species can tolerate',
	})
	@ValidateNested()
	@Type(() => PlantSpeciesTemperatureRangeInputDto)
	@IsOptional()
	temperatureRange?: PlantSpeciesTemperatureRangeInputDto;

	@Field(() => PlantSpeciesHumidityRequirementsEnum, {
		nullable: true,
		description: 'The humidity requirements of the plant species',
	})
	@IsEnum(PlantSpeciesHumidityRequirementsEnum)
	@IsOptional()
	humidityRequirements?: PlantSpeciesHumidityRequirementsEnum;

	@Field(() => PlantSpeciesSoilTypeEnum, {
		nullable: true,
		description: 'The preferred soil type of the plant species',
	})
	@IsEnum(PlantSpeciesSoilTypeEnum)
	@IsOptional()
	soilType?: PlantSpeciesSoilTypeEnum;

	@Field(() => PlantSpeciesPhRangeInputDto, {
		nullable: true,
		description: 'The pH range the plant species prefers',
	})
	@ValidateNested()
	@Type(() => PlantSpeciesPhRangeInputDto)
	@IsOptional()
	phRange?: PlantSpeciesPhRangeInputDto;

	@Field(() => PlantSpeciesMatureSizeInputDto, {
		nullable: true,
		description: 'The mature size of the plant species',
	})
	@ValidateNested()
	@Type(() => PlantSpeciesMatureSizeInputDto)
	@IsOptional()
	matureSize?: PlantSpeciesMatureSizeInputDto;

	@Field(() => Int, {
		nullable: true,
		description: 'The growth time in days',
	})
	@IsNumber()
	@IsOptional()
	growthTime?: number;

	@Field(() => [String], {
		nullable: true,
		description: 'Tags associated with the plant species',
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags?: string[];
}
