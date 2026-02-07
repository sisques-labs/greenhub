'use client';

import { useAuthPageStore } from 'features/auth/stores/auth-page-store';
import {
	AuthRegisterByEmailFormValues,
	createAuthRegisterByEmailSchema,
} from 'features/auth/schemas/auth-register-by-email/auth-register-by-email.schema';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface UseAuthRegisterFormProps {
	onSubmit: (values: AuthRegisterByEmailFormValues) => Promise<unknown>;
}

/**
 * Custom hook for auth register form
 * Encapsulates form validation logic, error mapping, and state management
 */
export function useAuthRegisterForm({ onSubmit }: UseAuthRegisterFormProps) {
	const t = useTranslations();
	const {
		email,
		password,
		confirmPassword,
		setEmail,
		setPassword,
		setConfirmPassword,
	} = useAuthPageStore();

	// Create schema with translations
	const registerSchema = useMemo(
		() => createAuthRegisterByEmailSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [formEmail, setFormEmail] = useState(email);
	const [formPassword, setFormPassword] = useState(password);
	const [formConfirmPassword, setFormConfirmPassword] =
		useState(confirmPassword);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = registerSchema.safeParse({
			email: formEmail,
			password: formPassword,
			confirmPassword: formConfirmPassword,
		});

		if (!result.success) {
			const errors: Record<string, { message?: string }> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = { message: err.message };
				}
			});
			setFormErrors(errors);
			return;
		}

		setFormErrors({});
		await onSubmit(result.data);
	};

	return {
		formEmail,
		setFormEmail,
		formPassword,
		setFormPassword,
		formConfirmPassword,
		setFormConfirmPassword,
		formErrors,
		handleSubmit,
		setEmail,
		setPassword,
		setConfirmPassword,
	};
}
