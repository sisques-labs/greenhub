import { registerEnumType } from '@nestjs/graphql';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';

/**
 * Registers all GraphQL enums for the growing unit.
 * This file should be imported in the growing unit to ensure enums are registered before GraphQL schema generation.
 */
const registeredGrowingUnitEnums = [
	{
		enum: GrowingUnitTypeEnum,
		name: 'GrowingUnitTypeEnum',
		description: 'The type of the growing unit',
	},
];

for (const {
	enum: enumType,
	name,
	description,
} of registeredGrowingUnitEnums) {
	registerEnumType(enumType, { name, description });
}
