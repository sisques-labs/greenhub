import { registerEnumType } from "@nestjs/graphql";
import { PlantStatusEnum } from "@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum";

/**
 * Registers all GraphQL enums for the plant.
 * This file should be imported in the plant to ensure enums are registered before GraphQL schema generation.
 */
const registeredPlantEnums = [
	{
		enum: PlantStatusEnum,
		name: "PlantStatusEnum",
		description: "The status of the plant",
	},
];

for (const { enum: enumType, name, description } of registeredPlantEnums) {
	registerEnumType(enumType, { name, description });
}
