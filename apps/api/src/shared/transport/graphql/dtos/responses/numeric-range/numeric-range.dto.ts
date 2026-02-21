import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@ObjectType('NumericRangeResponseDto')
export class NumericRangeResponseDto {
	@Field(() => Float, { description: 'Minimum value' })
	@IsNumber()
	min: number;

	@Field(() => Float, { description: 'Maximum value' })
	@IsNumber()
	max: number;
}
