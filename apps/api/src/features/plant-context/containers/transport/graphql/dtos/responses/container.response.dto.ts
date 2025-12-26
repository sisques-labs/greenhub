import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('ContainerPlantResponseDto')
export class ContainerPlantResponseDto {
  @Field(() => String, { description: 'The id of the plant' })
  id: string;

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

  @Field(() => Date, {
    description: 'The created at timestamp of the plant',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'The updated at timestamp of the plant',
  })
  updatedAt: Date;
}

@ObjectType('ContainerResponseDto')
export class ContainerResponseDto {
  @Field(() => String, { description: 'The id of the container' })
  id: string;

  @Field(() => String, { description: 'The name of the container' })
  name: string;

  @Field(() => String, { description: 'The type of the container' })
  type: string;

  @Field(() => [ContainerPlantResponseDto], {
    description: 'The plants in the container',
  })
  plants: ContainerPlantResponseDto[];

  @Field(() => Number, {
    description: 'The number of plants in the container',
  })
  numberOfPlants: number;

  @Field(() => Date, {
    description: 'The created at timestamp of the container',
  })
  createdAt: Date;

  @Field(() => Date, {
    description: 'The updated at timestamp of the container',
  })
  updatedAt: Date;
}

@ObjectType('PaginatedContainerResultDto')
export class PaginatedContainerResultDto extends BasePaginatedResultDto {
  @Field(() => [ContainerResponseDto], {
    description: 'The containers in the current page',
  })
  items: ContainerResponseDto[];
}
