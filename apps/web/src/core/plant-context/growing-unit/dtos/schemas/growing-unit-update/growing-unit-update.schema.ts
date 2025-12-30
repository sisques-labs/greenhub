import { z } from 'zod';

/**
 * Schema factory for growing unit update form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for growing unit update form validation
 */
export function createGrowingUnitUpdateSchema(
	translations: (key: string) => string,
) {
	return z.object({
		id: z.string().min(1, translations('growingUnit.validation.id.required')),
		name: z.string().optional(),
		type: z
			.enum(['POT', 'GARDEN_BED', 'HANGING_BASKET', 'WINDOW_BOX'])
			.optional(),
		capacity: z.number().optional(),
		length: z.number().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		unit: z
			.enum(['MILLIMETER', 'CENTIMETER', 'METER', 'INCH', 'FOOT'])
			.optional(),
	});
}

export type GrowingUnitUpdateFormValues = z.infer<
	ReturnType<typeof createGrowingUnitUpdateSchema>
>;
