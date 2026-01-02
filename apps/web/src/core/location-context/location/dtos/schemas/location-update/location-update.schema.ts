import { z } from 'zod';

/**
 * Schema factory for location update form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for location update form validation
 */
export function createLocationUpdateSchema(
	translations: (key: string) => string,
) {
	return z.object({
		id: z.string().min(1, translations('shared.validation.id.required')),
		name: z
			.string()
			.min(1, translations('shared.validation.name.required'))
			.optional(),
		type: z
			.string()
			.min(1, translations('shared.validation.type.invalid'))
			.optional(),
		description: z.string().optional().nullable(),
	});
}

export type LocationUpdateFormValues = z.infer<
	ReturnType<typeof createLocationUpdateSchema>
>;
