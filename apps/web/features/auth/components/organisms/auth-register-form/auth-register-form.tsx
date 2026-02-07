'use client';

import { Form } from '@/shared/components/ui/form';
import { AuthConfirmPasswordField } from 'features/auth/components/molecules/auth-confirm-password-field/auth-confirm-password-field';
import { AuthEmailField } from 'features/auth/components/molecules/auth-email-field/auth-email-field';
import { AuthErrorMessage } from 'features/auth/components/molecules/auth-error-message/auth-error-message';
import { AuthPasswordField } from 'features/auth/components/molecules/auth-password-field/auth-password-field';
import { AuthSubmitButton } from 'features/auth/components/molecules/auth-submit-button/auth-submit-button';
import { useAuthRegisterForm } from 'features/auth/hooks/use-auth-register-form/use-auth-register-form';
import { AuthRegisterByEmailFormValues } from 'features/auth/schemas/auth-register-by-email/auth-register-by-email.schema';

interface AuthRegisterFormProps {
	onSubmit: (values: AuthRegisterByEmailFormValues) => Promise<unknown>;
	isLoading: boolean;
	error: Error | null;
}

export function AuthRegisterForm({
	onSubmit,
	isLoading,
	error,
}: AuthRegisterFormProps) {
	const {
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
	} = useAuthRegisterForm({ onSubmit });

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
					placeholder="signup"
					error={formErrors.password}
					onPasswordChange={setPassword}
				/>
				<AuthConfirmPasswordField
					value={formConfirmPassword}
					onChange={setFormConfirmPassword}
					disabled={isLoading}
					error={formErrors.confirmPassword}
					onConfirmPasswordChange={setConfirmPassword}
				/>
				<AuthErrorMessage error={error} />
				<AuthSubmitButton
					isLoading={isLoading}
					disabled={isLoading}
					mode="signup"
				/>
			</form>
		</Form>
	);
}
