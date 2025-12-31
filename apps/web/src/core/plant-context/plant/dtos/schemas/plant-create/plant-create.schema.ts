import { PLANT_STATUS } from '@repo/sdk';
import { z } from 'zod';

/**
 * Schema factory for plant create form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for plant create form validation
 */
export function createPlantCreateSchema(translations: (key: string) => string) {
	return z.object({
		name: z.string().min(1, translations('shared.validation.name.required')),
		species: z
			.string()
			.min(1, translations('shared.validation.species.required')),
		plantedDate: z.date().optional(),
		notes: z.string().optional(),
		status: z
			.string()
			.refine(
				(value) =>
					Object.values(PLANT_STATUS as Record<string, string>).includes(value),
				{
					message: translations('shared.validation.status.invalid'),
				},
			)
			.optional(),
		growingUnitId: z
			.string()
			.min(1, translations('shared.validation.growingUnitId.required')),
	});
}

export type PlantCreateFormValues = z.infer<
	ReturnType<typeof createPlantCreateSchema>
>;
