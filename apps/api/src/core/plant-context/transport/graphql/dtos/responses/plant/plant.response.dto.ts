import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('PlantResponseDto')
export class PlantResponseDto {
  @Field(() => String, { description: 'The id of the plant' })
  id: string;

  @Field(() => String, {
    description: 'The id of the growing unit containing the plant',
  })
  growingUnitId: string;

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
