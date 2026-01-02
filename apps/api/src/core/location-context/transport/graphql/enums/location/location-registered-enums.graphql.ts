import { registerEnumType } from '@nestjs/graphql';

import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';

/**
 * Registers all GraphQL enums for the location.
 * This file should be imported in the location module to ensure enums are registered before GraphQL schema generation.
 */
const registeredLocationEnums = [
	{
		enum: LocationTypeEnum,
		name: 'LocationTypeEnum',
		description: 'The type of the location',
	},
];

for (const {
	enum: enumType,
	name,
	description,
} of registeredLocationEnums) {
	registerEnumType(enumType, { name, description });
}

