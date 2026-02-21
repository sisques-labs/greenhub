import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('PlantSpeciesDeleteRequestDto')
export class PlantSpeciesDeleteRequestDto {
	@Field(() => String, {
		description: 'The id of the plant species to delete',
	})
	@IsUUID()
	@IsNotEmpty()
	id: string;
}
