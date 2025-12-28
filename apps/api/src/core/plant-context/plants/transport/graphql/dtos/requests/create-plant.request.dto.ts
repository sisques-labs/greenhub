import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType('CreatePlantRequestDto')
export class CreatePlantRequestDto {
  @Field(() => String, { description: 'The container id of the plant' })
  @IsString()
  @IsNotEmpty()
  containerId: string;

  @Field(() => String, { description: 'The name of the plant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { description: 'The species of the plant' })
  @IsString()
  @IsNotEmpty()
  species: string;

  @Field(() => Date, {
    description: 'The date when the plant was planted',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
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
