import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType('UpdatePlantRequestDto')
export class UpdatePlantRequestDto {
  @Field(() => String, { description: 'The id of the plant' })
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
    description: 'The date when the plant was planted',
    nullable: true,
  })
  @IsOptional()
  plantedDate?: Date | null;

  @Field(() => String, {
    description: 'Additional notes about the plant',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes?: string | null;

  @Field(() => String, {
    description: 'The status of the plant',
    nullable: true,
  })
  @IsEnum(PlantStatusEnum)
  @IsOptional()
  status?: PlantStatusEnum;
}
