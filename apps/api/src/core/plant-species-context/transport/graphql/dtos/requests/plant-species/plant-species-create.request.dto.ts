import { PlantSpeciesCategoryEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-category/plant-species-category.enum';
import { PlantSpeciesDifficultyEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-difficulty/plant-species-difficulty.enum';
import { PlantSpeciesGrowthRateEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-growth-rate/plant-species-growth-rate.enum';
import { PlantSpeciesHumidityRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-humidity-requirements/plant-species-humidity-requirements.enum';
import { PlantSpeciesLightRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-light-requirements/plant-species-light-requirements.enum';
import { PlantSpeciesSoilTypeEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-soil-type/plant-species-soil-type.enum';
import { PlantSpeciesWaterRequirementsEnum } from '@/core/plant-species-context/domain/enums/plant-species/plant-species-water-requirements/plant-species-water-requirements.enum';
import { NumericRangeInputDto } from '@/shared/transport/graphql/dtos/requests/numeric-range/numeric-range.input';
import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
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

@InputType('PlantSpeciesTemperatureRangeInput')
export class PlantSpeciesTemperatureRangeInputDto extends NumericRangeInputDto {}

@InputType('PlantSpeciesPhRangeInput')
export class PlantSpeciesPhRangeInputDto extends NumericRangeInputDto {}

@InputType('PlantSpeciesMatureSizeInput')
export class PlantSpeciesMatureSizeInputDto {
	@Field(() => Float, { description: 'Mature height in centimeters' })
	@IsNumber()
	height: number;

	@Field(() => Float, { description: 'Mature width in centimeters' })
	@IsNumber()
	width: number;
}

@InputType('PlantSpeciesCreateRequestDto')
export class PlantSpeciesCreateRequestDto {
	@Field(() => String, { description: 'The common name of the plant species' })
	@IsString()
	@IsNotEmpty()
	commonName: string;

	@Field(() => String, {
		description: 'The scientific name of the plant species',
	})
	@IsString()
	@IsNotEmpty()
	scientificName: string;

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
		description: 'The category of the plant species',
	})
	@IsEnum(PlantSpeciesCategoryEnum)
	@IsNotEmpty()
	category: PlantSpeciesCategoryEnum;

	@Field(() => PlantSpeciesDifficultyEnum, {
		description: 'The difficulty level of the plant species',
	})
	@IsEnum(PlantSpeciesDifficultyEnum)
	@IsNotEmpty()
	difficulty: PlantSpeciesDifficultyEnum;

	@Field(() => PlantSpeciesGrowthRateEnum, {
		description: 'The growth rate of the plant species',
	})
	@IsEnum(PlantSpeciesGrowthRateEnum)
	@IsNotEmpty()
	growthRate: PlantSpeciesGrowthRateEnum;

	@Field(() => PlantSpeciesLightRequirementsEnum, {
		description: 'The light requirements of the plant species',
	})
	@IsEnum(PlantSpeciesLightRequirementsEnum)
	@IsNotEmpty()
	lightRequirements: PlantSpeciesLightRequirementsEnum;

	@Field(() => PlantSpeciesWaterRequirementsEnum, {
		description: 'The water requirements of the plant species',
	})
	@IsEnum(PlantSpeciesWaterRequirementsEnum)
	@IsNotEmpty()
	waterRequirements: PlantSpeciesWaterRequirementsEnum;

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

	@Field(() => String, {
		nullable: true,
		description: 'The id of the contributor who added the plant species',
	})
	@IsUUID()
	@IsOptional()
	contributorId?: string;

	@Field(() => Boolean, {
		nullable: true,
		description: 'Whether the plant species has been verified',
	})
	@IsBoolean()
	@IsOptional()
	isVerified?: boolean;
}
