"use client";

import { Form } from "@repo/shared/presentation/components/ui/form";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { AuthEmailField } from "@/generic/auth/presentation/components/molecules/auth-email-field/auth-email-field";
import { AuthErrorMessage } from "@/generic/auth/presentation/components/molecules/auth-error-message/auth-error-message";
import { AuthPasswordField } from "@/generic/auth/presentation/components/molecules/auth-password-field/auth-password-field";
import { AuthSubmitButton } from "@/generic/auth/presentation/components/molecules/auth-submit-button/auth-submit-button";
import {
	AuthLoginByEmailFormValues,
	createAuthLoginByEmailSchema,
} from "@/generic/auth/presentation/dtos/schemas/auth-login-by-email/auth-login-by-email.schema";
import { useAuthPageStore } from "@/generic/auth/presentation/stores/auth-page-store";

interface AuthLoginFormProps {
	onSubmit: (values: AuthLoginByEmailFormValues) => Promise<void>;
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

		// Validate form
		const result = loginSchema.safeParse({
			email: formEmail,
			password: formPassword,
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
