import { registerEnumType } from "@nestjs/graphql";
import { LengthUnitEnum } from "@/shared/domain/enums/length-unit/length-unit.enum";

/**
 * Registers all GraphQL enums for the growing unit.
 * This file should be imported in the growing unit to ensure enums are registered before GraphQL schema generation.
 */
const registeredSharedEnums = [
	{
		enum: LengthUnitEnum,
		name: "LengthUnitEnum",
		description: "The unit of the length",
	},
];

for (const { enum: enumType, name, description } of registeredSharedEnums) {
	registerEnumType(enumType, { name, description });
}
