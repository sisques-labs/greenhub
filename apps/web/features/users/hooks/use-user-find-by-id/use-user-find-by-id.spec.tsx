import { usersApiClient } from '@/features/users/api/users-api.client';
import { useUserFindById } from '@/features/users/hooks/use-user-find-by-id/use-user-find-by-id';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/users/api/users-api.client');

describe('useUserFindById', () => {
	let queryClient: QueryClient;

	const mockUser = {
		id: 'user-1',
		email: 'test@example.com',
		name: 'Test User',
	};

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});
		jest.clearAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial state', () => {
		it('should return null while loading', () => {
			(usersApiClient.findById as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useUserFindById('user-1'), {
				wrapper,
			});

			expect(result.current.user).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return user data on success', async () => {
			(usersApiClient.findById as jest.Mock).mockResolvedValue(mockUser);

			const { result } = renderHook(() => useUserFindById('user-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.user).toEqual(mockUser);
			expect(result.current.error).toBeNull();
		});

		it('should call findById with correct id', async () => {
			(usersApiClient.findById as jest.Mock).mockResolvedValue(mockUser);

			renderHook(() => useUserFindById('user-1'), { wrapper });

			await waitFor(() =>
				expect(usersApiClient.findById).toHaveBeenCalledWith({ id: 'user-1' }),
			);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch user');
			(usersApiClient.findById as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => useUserFindById('user-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.error).toBeTruthy());

			expect(result.current.user).toBeNull();
		});
	});

	describe('Options', () => {
		it('should not fetch when enabled is false', () => {
			(usersApiClient.findById as jest.Mock).mockResolvedValue(mockUser);

			renderHook(() => useUserFindById('user-1', { enabled: false }), {
				wrapper,
			});

			expect(usersApiClient.findById).not.toHaveBeenCalled();
		});

		it('should not fetch when id is empty string', () => {
			(usersApiClient.findById as jest.Mock).mockResolvedValue(mockUser);

			renderHook(() => useUserFindById(''), { wrapper });

			expect(usersApiClient.findById).not.toHaveBeenCalled();
		});

		it('should expose refetch function', async () => {
			(usersApiClient.findById as jest.Mock).mockResolvedValue(mockUser);

			const { result } = renderHook(() => useUserFindById('user-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
