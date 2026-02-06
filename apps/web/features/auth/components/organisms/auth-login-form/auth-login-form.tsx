'use client';

import { Form } from '@/shared/components/ui/form';
import { AuthEmailField } from 'features/auth/components/molecules/auth-email-field/auth-email-field';
import { AuthErrorMessage } from 'features/auth/components/molecules/auth-error-message/auth-error-message';
import { AuthPasswordField } from 'features/auth/components/molecules/auth-password-field/auth-password-field';
import { AuthSubmitButton } from 'features/auth/components/molecules/auth-submit-button/auth-submit-button';
import {
	AuthLoginByEmailFormValues,
	createAuthLoginByEmailSchema,
} from 'features/auth/schemas/auth-login-by-email/auth-login-by-email.schema';
import { useAuthPageStore } from 'features/auth/stores/auth-page-store';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface AuthLoginFormProps {
	onSubmit: (values: AuthLoginByEmailFormValues) => Promise<unknown>;
	isLoading: boolean;
	error: Error | null;
}

export function AuthLoginForm({
	onSubmit,
	isLoading,
	error,
}: AuthLoginFormProps) {
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

	return (
		<Form errors={formErrors}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<AuthEmailField
					value={formEmail}
					onChange={setFormEmail}
					disabled={isLoading}
					error={formErrors.email}
					onEmailChange={setEmail}
				/>
				<AuthPasswordField
					value={formPassword}
					onChange={setFormPassword}
					disabled={isLoading}
					placeholder="login"
					error={formErrors.password}
					onPasswordChange={setPassword}
				/>
				<AuthErrorMessage error={error} />
				<AuthSubmitButton
					isLoading={isLoading}
					disabled={isLoading}
					mode="login"
				/>
			</form>
		</Form>
	);
}
