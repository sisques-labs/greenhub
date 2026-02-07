'use client';

import { useAuthPageStore } from 'features/auth/stores/auth-page-store';
import {
	AuthLoginByEmailFormValues,
	createAuthLoginByEmailSchema,
} from 'features/auth/schemas/auth-login-by-email/auth-login-by-email.schema';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface UseAuthLoginFormProps {
	onSubmit: (values: AuthLoginByEmailFormValues) => Promise<unknown>;
}

/**
 * Custom hook for auth login form
 * Encapsulates form validation logic, error mapping, and state management
 */
export function useAuthLoginForm({ onSubmit }: UseAuthLoginFormProps) {
	const t = useTranslations();
	const { email, password, setEmail, setPassword } = useAuthPageStore();

	// Create schema with translations
	const loginSchema = useMemo(
		() => createAuthLoginByEmailSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [formEmail, setFormEmail] = useState(email);
	const [formPassword, setFormPassword] = useState(password);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Form submitted');

		// Validate form
		const result = loginSchema.safeParse({
			email: formEmail,
			password: formPassword,
		});

		if (!result.success) {
			console.log('Validation failed:', result.error);
			const errors: Record<string, { message?: string }> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = { message: err.message };
				}
			});
			setFormErrors(errors);
			return;
		}

		console.log('Validation passed, calling onSubmit');
		setFormErrors({});
		try {
			const response = await onSubmit(result.data);
			console.log('onSubmit response:', response);
		} catch (error) {
			console.error('onSubmit error:', error);
		}
	};

	return {
		formEmail,
		setFormEmail,
		formPassword,
		setFormPassword,
		formErrors,
		handleSubmit,
		setEmail,
		setPassword,
	};
}
