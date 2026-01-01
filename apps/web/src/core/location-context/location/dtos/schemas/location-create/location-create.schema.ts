import { z } from "zod";

/**
 * Schema factory for location create form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for location create form validation
 */
export function createLocationCreateSchema(
	translations: (key: string) => string,
) {
	return z.object({
		name: z.string().min(1, translations("shared.validation.name.required")),
		type: z
			.string()
			.min(1, translations("shared.validation.type.invalid")),
		description: z.string().optional().nullable(),
	});
}

export type LocationCreateFormValues = z.infer<
	ReturnType<typeof createLocationCreateSchema>
>;

