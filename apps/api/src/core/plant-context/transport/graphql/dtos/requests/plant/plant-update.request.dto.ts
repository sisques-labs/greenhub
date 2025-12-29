import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('PlantUpdateRequestDto')
export class PlantUpdateRequestDto {
  @Field(() => String, { description: 'The id of the plant to update' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the plant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, {
    description: 'The species of the plant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  species?: string;

  @Field(() => Date, {
    nullable: true,
    description:
      'The date when the plant was planted. Can be null to clear the date',
  })
  @IsOptional()
  plantedDate?: Date | null;

  @Field(() => String, {
    nullable: true,
    description: 'Additional notes about the plant. Can be null to clear notes',
  })
  @IsString()
  @IsOptional()
  notes?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'The status of the plant. Defaults to PLANTED if not provided',
  })
  @IsEnum(PlantStatusEnum)
  @IsOptional()
  status?: PlantStatusEnum;
}
