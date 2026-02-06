import { useAppRoutes } from '@/shared/hooks/use-routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApiClient } from '../../api/auth-api.client';
import type { LoginByEmailInput } from '../../api/types';

/**
 * Hook for login functionality using TanStack Query
 */
export function useAuthLogin() {
	const router = useRouter();
	const { routes } = useAppRoutes();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (input: LoginByEmailInput) => authApiClient.login(input),
		onSuccess: async (data) => {
			console.log('✅ Login success! Response:', data);
			console.log('✅ Routes object:', routes);
			console.log('✅ Home route:', routes.home);

			// Invalidate auth queries to refetch with new cookies
			await queryClient.invalidateQueries({ queryKey: ['auth'] });

			console.log('✅ Queries invalidated, now redirecting...');

			// Redirect to home page on successful login
			router.push(routes.home);

			console.log('✅ router.push called');

			// Also try refresh as backup
			setTimeout(() => {
				console.log('⚠️ Timeout reached, forcing reload');
				window.location.href = routes.home;
			}, 2000);
		},
		onError: (error) => {
			console.error('❌ Login error:', error);
		},
	});

	return {
		handleLogin: mutation.mutateAsync,
		isLoading: mutation.isPending,
		error: mutation.error,
		isSuccess: mutation.isSuccess,
	};
}
