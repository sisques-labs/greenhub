import { LENGTH_UNIT } from 'shared/constants/length-unit';
import { z } from 'zod';
import { GROWING_UNIT_TYPE } from '../../constants/growing-unit-type';

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
		locationId: z
			.string()
			.min(1, translations('shared.validation.locationId.required')),
		name: z.string().min(1, translations('shared.validation.name.required')),
		type: z
			.string()
			.refine(
				(value) =>
					Object.values(GROWING_UNIT_TYPE as Record<string, string>).includes(
						value,
					),
				{
					message: translations('shared.validation.type.invalid'),
				},
			),
		capacity: z
			.number()
			.min(1, translations('shared.validation.capacity.required')),
		length: z.number().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		unit: z
			.string()
			.refine(
				(value) =>
					Object.values(LENGTH_UNIT as Record<string, string>).includes(value),
				{
					message: translations('shared.validation.unit.invalid'),
				},
			)
			.optional(),
	});
}

export type GrowingUnitCreateFormValues = z.infer<
	ReturnType<typeof createGrowingUnitCreateSchema>
>;
