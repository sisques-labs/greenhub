import { z } from "zod";

/**
 * Schema factory for auth login by email form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for login form validation
 */
export function createAuthLoginByEmailSchema(
	translations: (key: string) => string,
) {
	return z.object({
		email: z
			.string()
			.min(1, translations("pages.auth.validation.email.required"))
			.email(translations("pages.auth.validation.email.invalid")),
		password: z
			.string()
			.min(1, translations("pages.auth.validation.password.required"))
			.min(8, translations("pages.auth.validation.password.minLength")),
	});
}

export type AuthLoginByEmailFormValues = z.infer<
	ReturnType<typeof createAuthLoginByEmailSchema>
>;
