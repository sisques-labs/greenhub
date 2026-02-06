import { PLANT_STATUS } from "../../constants/plant-status";
import { z } from "zod";

/**
 * Schema factory for plant update form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant update form validation
 */
export function createPlantUpdateSchema(translations: (key: string) => string) {
	return z.object({
		name: z.string().min(1, translations("shared.validation.name.required")).optional(),
		species: z
			.string()
			.min(1, translations("shared.validation.species.required"))
			.optional(),
		plantedDate: z.date().nullable().optional(),
		notes: z.string().nullable().optional(),
		status: z
			.string()
			.refine(
				(value) =>
					Object.values(PLANT_STATUS as Record<string, string>).includes(value),
				{
					message: translations("shared.validation.status.invalid"),
				},
			)
			.optional(),
	});
}

export type PlantUpdateFormValues = z.infer<
	ReturnType<typeof createPlantUpdateSchema>
>;


