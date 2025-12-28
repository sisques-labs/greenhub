'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@repo/shared/presentation/components/ui/form';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { AuthEmailField } from '@/generic/auth/presentation/components/molecules/auth-email-field/auth-email-field';
import { AuthErrorMessage } from '@/generic/auth/presentation/components/molecules/auth-error-message/auth-error-message';
import { AuthPasswordField } from '@/generic/auth/presentation/components/molecules/auth-password-field/auth-password-field';
import { AuthSubmitButton } from '@/generic/auth/presentation/components/molecules/auth-submit-button/auth-submit-button';
import {
  AuthLoginByEmailFormValues,
  createAuthLoginByEmailSchema,
} from '@/generic/auth/presentation/dtos/schemas/auth-login-by-email/auth-login-by-email.schema';
import { useAuthPageStore } from '@/generic/auth/presentation/stores/auth-page-store';

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

  // Login form - initialized with store values
  const form = useForm<AuthLoginByEmailFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email,
      password: password,
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
          placeholder="login"
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
