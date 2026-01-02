import { Field, ObjectType } from '@nestjs/graphql';

import { GrowingUnitLocationResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/location/location.response.dto';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { PlantGrowingUnitReferenceDto } from './plant-growing-unit-reference.response.dto';

@ObjectType('PlantResponseDto')
export class PlantResponseDto {
	@Field(() => String, { description: 'The id of the plant' })
	id: string;

	@Field(() => String, {
		nullable: true,
		description: 'The id of the growing unit containing the plant',
	})
	growingUnitId?: string | null;

	@Field(() => String, { description: 'The name of the plant' })
	name: string;

	@Field(() => String, { description: 'The species of the plant' })
	species: string;

	@Field(() => Date, {
		nullable: true,
		description: 'The date when the plant was planted',
	})
	plantedDate?: Date | null;

	@Field(() => String, {
		nullable: true,
		description: 'Additional notes about the plant',
	})
	notes?: string | null;

	@Field(() => String, { description: 'The status of the plant' })
	status: string;

	@Field(() => GrowingUnitLocationResponseDto, {
		nullable: true,
		description: 'The location where the plant is located',
	})
	location?: GrowingUnitLocationResponseDto;

	@Field(() => PlantGrowingUnitReferenceDto, {
		nullable: true,
		description:
			'The growing unit containing the plant (basic information only)',
	})
	growingUnit?: PlantGrowingUnitReferenceDto;

	@Field(() => Date, {
		description: 'The created at timestamp of the plant',
	})
	createdAt: Date;

	@Field(() => Date, {
		description: 'The updated at timestamp of the plant',
	})
	updatedAt: Date;
}

@ObjectType('PaginatedPlantResultDto')
export class PaginatedPlantResultDto extends BasePaginatedResultDto {
	@Field(() => [PlantResponseDto], {
		description: 'The plants in the current page',
	})
	items: PlantResponseDto[];
}
