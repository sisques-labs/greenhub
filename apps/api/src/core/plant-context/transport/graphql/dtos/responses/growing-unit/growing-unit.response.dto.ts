import { Field, ObjectType } from '@nestjs/graphql';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';

@ObjectType('GrowingUnitDimensionsResponseDto')
export class GrowingUnitDimensionsResponseDto {
	@Field(() => Number, { description: 'The length of the growing unit' })
	length: number;

	@Field(() => Number, { description: 'The width of the growing unit' })
	width: number;

	@Field(() => Number, { description: 'The height of the growing unit' })
	height: number;

	@Field(() => String, {
		description: 'The unit of measurement for dimensions',
	})
	unit: string;
}

@ObjectType('GrowingUnitResponseDto')
export class GrowingUnitResponseDto {
	@Field(() => String, { description: 'The id of the growing unit' })
	id: string;

	@Field(() => String, { description: 'The name of the growing unit' })
	name: string;

	@Field(() => String, { description: 'The type of the growing unit' })
	type: string;

	@Field(() => Number, { description: 'The capacity of the growing unit' })
	capacity: number;

	@Field(() => GrowingUnitDimensionsResponseDto, {
		nullable: true,
		description: 'The dimensions of the growing unit',
	})
	dimensions?: GrowingUnitDimensionsResponseDto | null;

	@Field(() => [PlantResponseDto], {
		description: 'The plants in the growing unit',
	})
	plants: PlantResponseDto[];

	@Field(() => Number, {
		description: 'The number of plants in the growing unit',
	})
	numberOfPlants: number;

	@Field(() => Number, {
		description: 'The remaining capacity of the growing unit',
	})
	remainingCapacity: number;

	@Field(() => Number, {
		description: 'The volume of the growing unit in cubic units',
	})
	volume: number;

	@Field(() => Date, {
		description: 'The created at timestamp of the growing unit',
	})
	createdAt: Date;

	@Field(() => Date, {
		description: 'The updated at timestamp of the growing unit',
	})
	updatedAt: Date;
}

@ObjectType('PaginatedGrowingUnitResultDto')
export class PaginatedGrowingUnitResultDto extends BasePaginatedResultDto {
	@Field(() => [GrowingUnitResponseDto], {
		description: 'The growing units in the current page',
	})
	items: GrowingUnitResponseDto[];
}
