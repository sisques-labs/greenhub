import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAppRoutes } from 'shared/hooks/use-routes';
import { authApiClient } from '../../api/auth-api.client';
import type { RegisterByEmailInput } from '../../api/types';

/**
 * Hook for registration functionality using TanStack Query
 * After successful registration, automatically logs in the user
 */
export function useAuthRegister() {
	const router = useRouter();
	const { routes } = useAppRoutes();

	const mutation = useMutation({
		mutationFn: async (
			input: RegisterByEmailInput & { confirmPassword?: string },
		) => {
			// Remove confirmPassword before sending to backend (it's only for frontend validation)
			const { confirmPassword, ...registerInput } = input;

			// Step 1: Register the user
			const registerResult = await authApiClient.register(registerInput);

			if (!registerResult.success) {
				throw new Error(registerResult.message || 'Registration failed');
			}

			// Step 2: Automatically login after successful registration
			try {
				await authApiClient.login({
					email: registerInput.email,
					password: registerInput.password,
				});
			} catch (loginError) {
				console.error('Auto-login after registration failed:', loginError);
				// Redirect to auth page for manual login
				router.push(routes.auth);
				throw loginError;
			}

			return registerResult;
		},
		onSuccess: () => {
			// Redirect to home page on successful registration + login
			router.push(routes.home);
		},
	});

	return {
		handleRegister: mutation.mutateAsync,
		isLoading: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
