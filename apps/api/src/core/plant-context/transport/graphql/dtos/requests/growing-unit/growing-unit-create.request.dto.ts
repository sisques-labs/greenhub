import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType('GrowingUnitCreateRequestDto')
export class GrowingUnitCreateRequestDto {
  @Field(() => String, { description: 'The name of the growing unit' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => GrowingUnitTypeEnum, {
    description: 'The type of the growing unit',
  })
  @IsEnum(GrowingUnitTypeEnum)
  @IsNotEmpty()
  type: GrowingUnitTypeEnum;

  @Field(() => Number, { description: 'The capacity of the growing unit' })
  @IsInt()
  @Min(1)
  capacity: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The length of the growing unit',
  })
  @IsNumber()
  @IsOptional()
  length?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The width of the growing unit',
  })
  @IsNumber()
  @IsOptional()
  width?: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The height of the growing unit',
  })
  @IsNumber()
  @IsOptional()
  height?: number;

  @Field(() => String, {
    nullable: true,
    description: 'The unit of measurement for dimensions',
  })
  @IsString()
  @IsOptional()
  unit?: string;
}
