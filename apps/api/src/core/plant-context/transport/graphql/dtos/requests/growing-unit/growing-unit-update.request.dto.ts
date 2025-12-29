import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

@InputType('GrowingUnitUpdateRequestDto')
export class GrowingUnitUpdateRequestDto {
  @Field(() => String, { description: 'The id of the growing unit' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, {
    description: 'The name of the growing unit',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, {
    description: 'The type of the growing unit',
    nullable: true,
  })
  @IsEnum(GrowingUnitTypeEnum)
  @IsOptional()
  type?: GrowingUnitTypeEnum;

  @Field(() => Number, {
    description: 'The capacity of the growing unit',
    nullable: true,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

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
