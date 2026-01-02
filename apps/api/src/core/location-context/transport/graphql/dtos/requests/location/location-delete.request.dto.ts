import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('LocationDeleteRequestDto')
export class LocationDeleteRequestDto {
	@Field(() => String, { description: 'The id of the location' })
	@IsUUID()
	@IsNotEmpty()
	id: string;
}

