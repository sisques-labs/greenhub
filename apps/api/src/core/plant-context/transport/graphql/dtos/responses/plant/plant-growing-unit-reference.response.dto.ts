import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Represents a simplified growing unit reference for plant responses.
 * Contains only basic information without the plants array to avoid circular references.
 */
@ObjectType('PlantGrowingUnitReferenceDto')
export class PlantGrowingUnitReferenceDto {
	@Field(() => String, { description: 'The id of the growing unit' })
	id: string;

	@Field(() => String, { description: 'The name of the growing unit' })
	name: string;

	@Field(() => String, { description: 'The type of the growing unit' })
	type: string;

	@Field(() => Number, { description: 'The capacity of the growing unit' })
	capacity: number;
}
