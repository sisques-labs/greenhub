import { authApiClient } from '@/features/auth/api/auth-api.client';
import { useAuthLogout } from '@/features/auth/hooks/use-auth-logout/use-auth-logout';
import { useAppRoutes } from '@/shared/hooks/use-routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('@/features/auth/api/auth-api.client');
jest.mock('@/shared/hooks/use-routes');

const mockPush = jest.fn();

describe('useAuthLogout', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});
		jest.clearAllMocks();
		jest.spyOn(console, 'error').mockImplementation(() => {});

		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
		(useAppRoutes as jest.Mock).mockReturnValue({
			routes: {
				auth: '/en/auth',
				home: '/en/home',
			},
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial state', () => {
		it('should return correct initial state', () => {
			const { result } = renderHook(() => useAuthLogout(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(typeof result.current.handleLogout).toBe('function');
		});
	});

	describe('Successful logout', () => {
		it('should call logout API and redirect to auth page', async () => {
			(authApiClient.logout as jest.Mock).mockResolvedValue({ success: true });

			const { result } = renderHook(() => useAuthLogout(), { wrapper });

			act(() => {
				result.current.handleLogout('user-1');
			});

			await waitFor(() => {
				expect(authApiClient.logout).toHaveBeenCalledWith({ userId: 'user-1' });
			});

			await waitFor(() => {
				expect(mockPush).toHaveBeenCalledWith('/en/auth');
			});
		});

		it('should clear query cache on success', async () => {
			(authApiClient.logout as jest.Mock).mockResolvedValue({ success: true });

			const clearSpy = jest.spyOn(queryClient, 'clear');

			const { result } = renderHook(() => useAuthLogout(), { wrapper });

			act(() => {
				result.current.handleLogout('user-1');
			});

			await waitFor(() => {
				expect(clearSpy).toHaveBeenCalled();
			});
		});
	});

	describe('Failed logout', () => {
		it('should still redirect to auth page even on error', async () => {
			const mockError = new Error('Logout failed');
			(authApiClient.logout as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => useAuthLogout(), { wrapper });

			act(() => {
				result.current.handleLogout('user-1');
			});

			await waitFor(() => {
				expect(mockPush).toHaveBeenCalledWith('/en/auth');
			});
		});

		it('should clear cache even on error', async () => {
			const mockError = new Error('Logout failed');
			(authApiClient.logout as jest.Mock).mockRejectedValue(mockError);

			const clearSpy = jest.spyOn(queryClient, 'clear');

			const { result } = renderHook(() => useAuthLogout(), { wrapper });

			act(() => {
				result.current.handleLogout('user-1');
			});

			await waitFor(() => {
				expect(clearSpy).toHaveBeenCalled();
			});
		});
	});
});
