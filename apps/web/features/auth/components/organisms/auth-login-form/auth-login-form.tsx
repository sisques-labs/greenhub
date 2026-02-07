'use client';

import { Form } from '@/shared/components/ui/form';
import { AuthEmailField } from 'features/auth/components/molecules/auth-email-field/auth-email-field';
import { AuthErrorMessage } from 'features/auth/components/molecules/auth-error-message/auth-error-message';
import { AuthPasswordField } from 'features/auth/components/molecules/auth-password-field/auth-password-field';
import { AuthSubmitButton } from 'features/auth/components/molecules/auth-submit-button/auth-submit-button';
import { useAuthLoginForm } from 'features/auth/hooks/use-auth-login-form/use-auth-login-form';
import { AuthLoginByEmailFormValues } from 'features/auth/schemas/auth-login-by-email/auth-login-by-email.schema';

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
	const {
		formEmail,
		setFormEmail,
		formPassword,
		setFormPassword,
		formErrors,
		handleSubmit,
		setEmail,
		setPassword,
	} = useAuthLoginForm({ onSubmit });

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
