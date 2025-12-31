"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/shared/presentation/components/ui/form";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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

	// Register form - initialized with store values
	const form = useForm<AuthRegisterByEmailFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: email,
			password: password,
			confirmPassword: confirmPassword,
		},
	});

	return (
		// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
		<Form {...(form as any)}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<AuthEmailField
					control={form.control}
					name="email"
					disabled={isLoading}
					onEmailChange={setEmail}
				/>
				<AuthPasswordField
					control={form.control}
					name="password"
					disabled={isLoading}
					placeholder="signup"
					onPasswordChange={setPassword}
				/>
				<AuthConfirmPasswordField
					control={form.control}
					name="confirmPassword"
					disabled={isLoading}
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
