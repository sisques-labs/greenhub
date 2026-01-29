"use client";

import { Form } from "@/presentation/components/ui/form";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { AuthConfirmPasswordField } from "@/generic/auth/presentation/components/molecules/auth-confirm-password-field/auth-confirm-password-field";
import { AuthEmailField } from "@/generic/auth/presentation/components/molecules/auth-email-field/auth-email-field";
import { AuthErrorMessage } from "@/generic/auth/presentation/components/molecules/auth-error-message/auth-error-message";
import { AuthPasswordField } from "@/generic/auth/presentation/components/molecules/auth-password-field/auth-password-field";
import { AuthSubmitButton } from "@/generic/auth/presentation/components/molecules/auth-submit-button/auth-submit-button";
import {
	AuthRegisterByEmailFormValues,
	createAuthRegisterByEmailSchema,
} from "@/generic/auth/presentation/dtos/schemas/auth-register-by-email/auth-register-by-email.schema";
import { useAuthPageStore } from "@/generic/auth/presentation/stores/auth-page-store";

interface AuthRegisterFormProps {
	onSubmit: (values: AuthRegisterByEmailFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function AuthRegisterForm({
	onSubmit,
	isLoading,
	error,
}: AuthRegisterFormProps) {
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
	const [formConfirmPassword, setFormConfirmPassword] = useState(confirmPassword);
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
