import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { NumericRangeResponseDto } from '@/shared/transport/graphql/dtos/responses/numeric-range/numeric-range.dto';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantSpeciesTemperatureRangeResponseDto')
export class PlantSpeciesTemperatureRangeResponseDto extends NumericRangeResponseDto {}

@ObjectType('PlantSpeciesPhRangeResponseDto')
export class PlantSpeciesPhRangeResponseDto extends NumericRangeResponseDto {}

@ObjectType('PlantSpeciesMatureSizeResponseDto')
export class PlantSpeciesMatureSizeResponseDto {
	@Field(() => Float, { description: 'Mature height in centimeters' })
	height: number;

	@Field(() => Float, { description: 'Mature width in centimeters' })
	width: number;
}

@ObjectType('PlantSpeciesResponseDto')
export class PlantSpeciesResponseDto {
	@Field(() => String, { description: 'The id of the plant species' })
	id: string;

	@Field(() => String, { description: 'The common name of the plant species' })
	commonName: string;

	@Field(() => String, {
		description: 'The scientific name of the plant species',
	})
	scientificName: string;

	@Field(() => String, {
		nullable: true,
		description: 'The family of the plant species',
	})
	family?: string | null;

	@Field(() => String, {
		nullable: true,
		description: 'A description of the plant species',
	})
	description?: string | null;

	@Field(() => String, { description: 'The category of the plant species' })
	category: string;

	@Field(() => String, {
		description: 'The difficulty level of the plant species',
	})
	difficulty: string;

	@Field(() => String, { description: 'The growth rate of the plant species' })
	growthRate: string;

	@Field(() => String, {
		description: 'The light requirements of the plant species',
	})
	lightRequirements: string;

	@Field(() => String, {
		description: 'The water requirements of the plant species',
	})
	waterRequirements: string;

	@Field(() => PlantSpeciesTemperatureRangeResponseDto, {
		nullable: true,
		description: 'The temperature range the plant species can tolerate',
	})
	temperatureRange?: PlantSpeciesTemperatureRangeResponseDto | null;

	@Field(() => String, {
		nullable: true,
		description: 'The humidity requirements of the plant species',
	})
	humidityRequirements?: string | null;

	@Field(() => String, {
		nullable: true,
		description: 'The preferred soil type of the plant species',
	})
	soilType?: string | null;

	@Field(() => PlantSpeciesPhRangeResponseDto, {
		nullable: true,
		description: 'The pH range the plant species prefers',
	})
	phRange?: PlantSpeciesPhRangeResponseDto | null;

	@Field(() => PlantSpeciesMatureSizeResponseDto, {
		nullable: true,
		description: 'The mature size of the plant species',
	})
	matureSize?: PlantSpeciesMatureSizeResponseDto | null;

	@Field(() => Int, {
		nullable: true,
		description: 'The growth time in days',
	})
	growthTime?: number | null;

	@Field(() => [String], {
		nullable: true,
		description: 'Tags associated with the plant species',
	})
	tags?: string[] | null;

	@Field(() => Boolean, {
		description: 'Whether the plant species has been verified',
	})
	isVerified: boolean;

	@Field(() => String, {
		nullable: true,
		description: 'The id of the contributor who added the plant species',
	})
	contributorId?: string | null;

	@Field(() => Date, {
		description: 'The created at timestamp of the plant species',
	})
	createdAt: Date;

	@Field(() => Date, {
		description: 'The updated at timestamp of the plant species',
	})
	updatedAt: Date;
}

@ObjectType('PaginatedPlantSpeciesResultDto')
export class PaginatedPlantSpeciesResultDto extends BasePaginatedResultDto {
	@Field(() => [PlantSpeciesResponseDto], {
		description: 'The plant species in the current page',
	})
	items: PlantSpeciesResponseDto[];
}
