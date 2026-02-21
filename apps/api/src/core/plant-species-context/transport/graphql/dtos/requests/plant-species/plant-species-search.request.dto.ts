import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('PlantSpeciesSearchRequestDto')
export class PlantSpeciesSearchRequestDto {
	@Field(() => String, {
		description: 'The search query to find plant species by name',
	})
	@IsString()
	@IsNotEmpty()
	query: string;
}
