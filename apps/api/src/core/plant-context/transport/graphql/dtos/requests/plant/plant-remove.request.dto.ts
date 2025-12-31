import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType('PlantRemoveRequestDto')
export class PlantRemoveRequestDto {
	@Field(() => String, {
		description: 'The id of the growing unit to remove the plant from',
	})
	@IsUUID()
	@IsNotEmpty()
	growingUnitId: string;

	@Field(() => String, {
		description: 'The id of the plant to remove',
	})
	@IsUUID()
	@IsNotEmpty()
	plantId: string;
}
