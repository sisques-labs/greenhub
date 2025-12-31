'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Spinner } from '@repo/shared/presentation/components/ui/spinner';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { AuthErrorMessage } from '@/generic/auth/presentation/components/molecules/auth-error-message/auth-error-message';

interface AuthCardProps {
	children: ReactNode;
	isLoading: boolean;
	error: Error | null;
	mode: 'login' | 'signup';
}

export function AuthCard({ children, isLoading, error, mode }: AuthCardProps) {
	const t = useTranslations();

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center">
					{t(`pages.auth.title.${mode}`)}
				</CardTitle>
				<CardDescription className="text-center">
					{t(`pages.auth.description.${mode}`)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? <Spinner className="mx-auto" /> : children}
				{error && <AuthErrorMessage error={error} />}
			</CardContent>
		</Card>
	);
}
