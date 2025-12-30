import { GROWING_UNIT_TYPE, LENGTH_UNIT } from '@repo/sdk';
import { z } from 'zod';

/**
 * Schema factory for growing unit create form validation
 * Following DDD principles, this schema is isolated in its own module
 * Uses enums from SDK to ensure type safety and consistency
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for growing unit create form validation
 */
export function createGrowingUnitCreateSchema(
	translations: (key: string) => string,
) {
	return z.object({
		name: z
			.string()
			.min(1, translations('growingUnit.validation.name.required')),
		type: z
			.string()
			.refine(
				(value) =>
					Object.values(GROWING_UNIT_TYPE as Record<string, string>).includes(
						value,
					),
				{
					message: translations('growingUnit.validation.type.invalid'),
				},
			),
		capacity: z
			.number()
			.min(1, translations('growingUnit.validation.capacity.required')),
		length: z.number().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		unit: z
			.string()
			.refine(
				(value) =>
					Object.values(LENGTH_UNIT as Record<string, string>).includes(value),
				{
					message: translations('growingUnit.validation.unit.invalid'),
				},
			)
			.optional(),
	});
}

export type GrowingUnitCreateFormValues = z.infer<
	ReturnType<typeof createGrowingUnitCreateSchema>
>;
