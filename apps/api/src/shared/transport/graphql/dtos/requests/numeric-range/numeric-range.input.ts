import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType('NumericRangeInput')
export class NumericRangeInputDto {
	@Field(() => Float, { description: 'Minimum value' })
	@IsNumber()
	min: number;

	@Field(() => Float, { description: 'Maximum value' })
	@IsNumber()
	max: number;
}
