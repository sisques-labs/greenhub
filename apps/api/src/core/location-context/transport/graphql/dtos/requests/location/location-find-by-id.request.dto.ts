import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('LocationFindByIdRequestDto')
export class LocationFindByIdRequestDto {
	@Field(() => String, {
		description: 'The id of the location to find',
	})
	@IsUUID()
	@IsNotEmpty()
	id: string;
}

