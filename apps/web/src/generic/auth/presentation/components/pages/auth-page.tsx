'use client';

import { Button } from '@repo/shared/presentation/components/ui/button';
import { useTranslations } from 'next-intl';
import { AuthCard } from '@/generic/auth/presentation/components/organisms/auth-card/auth-card';
import { AuthLoginForm } from '@/generic/auth/presentation/components/organisms/auth-login-form/auth-login-form';
import { AuthRegisterForm } from '@/generic/auth/presentation/components/organisms/auth-register-form/auth-register-form';
import { useAuthLogin } from '@/generic/auth/presentation/hooks/use-auth-login/use-auth-login';
import { useAuthRegister } from '@/generic/auth/presentation/hooks/use-auth-register/use-auth-register';
import { useAuthPageStore } from '@/generic/auth/presentation/stores/auth-page-store';

/**
 * Authentication page component
 * Uses application services through hooks (DDD pattern)
 * Supports both login and registration modes
 */
const AuthPage = () => {
	const t = useTranslations();
	const { isLoginMode, setIsLoginMode } = useAuthPageStore();
	const {
		handleLogin,
		isLoading: isLoginLoading,
		error: loginError,
	} = useAuthLogin();
	const {
		handleRegister,
		isLoading: isRegisterLoading,
		error: registerError,
	} = useAuthRegister();

	const isLoading = isLoginMode ? isLoginLoading : isRegisterLoading;
	const error = isLoginMode ? loginError : registerError;

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/20 p-4">
			<AuthCard
				isLoading={isLoading}
				error={error}
				mode={isLoginMode ? 'login' : 'signup'}
			>
				{isLoginMode ? (
					<AuthLoginForm
						onSubmit={handleLogin}
						isLoading={isLoading}
						error={error}
					/>
				) : (
					<AuthRegisterForm
						onSubmit={handleRegister}
						isLoading={isLoading}
						error={error}
					/>
				)}

				<div className="mt-4 text-center text-sm">
					{isLoginMode ? (
						<>
							<span className="text-muted-foreground">
								{t('authPage.messages.switchToSignup')}{' '}
							</span>
							<Button
								variant="link"
								className="p-0 h-auto font-semibold"
								onClick={() => setIsLoginMode(false)}
								disabled={isLoading}
							>
								{t('authPage.actions.switchToSignup')}
							</Button>
						</>
					) : (
						<>
							<span className="text-muted-foreground">
								{t('authPage.messages.switchToLogin')}{' '}
							</span>
							<Button
								variant="link"
								className="p-0 h-auto font-semibold"
								onClick={() => setIsLoginMode(true)}
								disabled={isLoading}
							>
								{t('authPage.actions.switchToLogin')}
							</Button>
						</>
					)}
				</div>
			</AuthCard>
		</div>
	);
};

export default AuthPage;
