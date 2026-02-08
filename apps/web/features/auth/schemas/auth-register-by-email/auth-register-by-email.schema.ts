import { z } from "zod";

/**
 * Schema factory for auth register by email form validation
 * Following DDD principles, this schema is isolated in its own module
 *
 * @param translations - Translation function to get localized error messages
 * @returns Zod schema for registration form validation
 */
export function createAuthRegisterByEmailSchema(
	translations: (key: string) => string,
) {
	return z
		.object({
			email: z
				.string()
				.min(1, translations("features.auth.validation.email.required"))
				.email(translations("features.auth.validation.email.invalid")),
			password: z
				.string()
				.min(1, translations("features.auth.validation.password.required"))
				.min(8, translations("features.auth.validation.password.minLength")),
			confirmPassword: z
				.string()
				.min(1, translations("features.auth.validation.confirmPassword.required")),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: translations("features.auth.validation.confirmPassword.mismatch"),
			path: ["confirmPassword"],
		});
}

export type AuthRegisterByEmailFormValues = z.infer<
	ReturnType<typeof createAuthRegisterByEmailSchema>
>;
