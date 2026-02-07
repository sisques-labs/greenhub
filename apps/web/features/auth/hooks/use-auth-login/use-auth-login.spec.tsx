import { authApiClient } from '@/features/auth/api/auth-api.client';
import { useAuthLogin } from '@/features/auth/hooks/use-auth-login/use-auth-login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
}));
jest.mock('@/features/auth/api/auth-api.client');
jest.mock('@/shared/hooks/use-routes');

// Mock useAppRoutes
import { useAppRoutes } from '@/shared/hooks/use-routes';

const mockPush = jest.fn();
const mockRouter = {
	push: mockPush,
	replace: jest.fn(),
	prefetch: jest.fn(),
	back: jest.fn(),
};

describe('useAuthLogin', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
				mutations: { retry: false },
			},
		});

		jest.clearAllMocks();
		jest.spyOn(console, 'log').mockImplementation(() => {});
		jest.spyOn(console, 'error').mockImplementation(() => {});

		(useRouter as jest.Mock).mockReturnValue(mockRouter);
		(useAppRoutes as jest.Mock).mockReturnValue({
			routes: {
				home: '/dashboard',
				login: '/login',
			},
		});
	});

	afterEach(() => {
		queryClient.clear();
		jest.restoreAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial State', () => {
		it('should return correct initial state', () => {
			const { result } = renderHook(() => useAuthLogin(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBe(null);
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleLogin).toBe('function');
		});
	});

	describe('Login Success', () => {
		it('should handle successful login', async () => {
			const mockResponse = {
				accessToken: 'mock-token',
				user: { id: '1', email: 'test@example.com' },
			};

			(authApiClient.login as jest.Mock).mockResolvedValue(mockResponse);

			const { result } = renderHook(() => useAuthLogin(), { wrapper });

			const loginInput = {
				email: 'test@example.com',
				password: 'password123',
			};

			await result.current.handleLogin(loginInput);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(authApiClient.login).toHaveBeenCalledWith(loginInput);
			expect(mockPush).toHaveBeenCalledWith('/dashboard');
		});

		it('should invalidate auth queries on success', async () => {
			const mockResponse = {
				accessToken: 'mock-token',
				user: { id: '1', email: 'test@example.com' },
			};

			(authApiClient.login as jest.Mock).mockResolvedValue(mockResponse);

			const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

			const { result } = renderHook(() => useAuthLogin(), { wrapper });

			await result.current.handleLogin({
				email: 'test@example.com',
				password: 'password123',
			});

			await waitFor(() => {
				expect(invalidateQueriesSpy).toHaveBeenCalledWith({
					queryKey: ['auth'],
				});
			});
		});
	});

	describe('Login Error', () => {
		it('should handle login error', async () => {
			const mockError = new Error('Invalid credentials');

			(authApiClient.login as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => useAuthLogin(), { wrapper });

			try {
				await result.current.handleLogin({
					email: 'test@example.com',
					password: 'wrong-password',
				});
			} catch (error: unknown) {
				// Expected to throw
				console.error(error);
			}

			await waitFor(() => {
				expect(result.current.error).toBeTruthy();
			});

			expect(mockPush).not.toHaveBeenCalled();
		});

		it('should set error state on failed login', async () => {
			const mockError = new Error('Network error');

			(authApiClient.login as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => useAuthLogin(), { wrapper });

			try {
				await result.current.handleLogin({
					email: 'test@example.com',
					password: 'password123',
				});
			} catch (error: unknown) {
				// Expected to throw
				console.error(error);
			}

			await waitFor(() => {
				expect(result.current.error).toEqual(mockError);
			});

			expect(result.current.isSuccess).toBe(false);
		});
	});

	describe('Loading State', () => {
		it('should set loading state during login', async () => {
			(authApiClient.login as jest.Mock).mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() =>
								resolve({
									accessToken: 'mock-token',
									user: { id: '1', email: 'test@example.com' },
								}),
							100,
						),
					),
			);

			const { result } = renderHook(() => useAuthLogin(), { wrapper });

			result.current.handleLogin({
				email: 'test@example.com',
				password: 'password123',
			});

			await waitFor(() => {
				expect(result.current.isLoading).toBe(true);
			});

			await waitFor(
				() => {
					expect(result.current.isLoading).toBe(false);
				},
				{ timeout: 200 },
			);
		});
	});
});
