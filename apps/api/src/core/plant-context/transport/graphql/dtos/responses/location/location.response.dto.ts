import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('GrowingUnitLocationResponseDto')
export class GrowingUnitLocationResponseDto {
	@Field(() => String, { description: 'The id of the location' })
	id: string;

	@Field(() => String, { description: 'The name of the location' })
	name: string;

	@Field(() => String, { description: 'The type of the location' })
	type: string;

	@Field(() => String, {
		nullable: true,
		description: 'The description of the location',
	})
	description?: string | null;

	@Field(() => Date, {
		description: 'The created at timestamp of the location',
	})
	createdAt: Date;

	@Field(() => Date, {
		description: 'The updated at timestamp of the location',
	})
	updatedAt: Date;
}
