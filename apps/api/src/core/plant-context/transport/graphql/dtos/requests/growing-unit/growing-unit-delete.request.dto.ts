import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('GrowingUnitDeleteRequestDto')
export class GrowingUnitDeleteRequestDto {
	@Field(() => String, {
		description: 'The id of the growing unit to delete',
	})
	@IsUUID()
	@IsNotEmpty()
	id: string;
}
