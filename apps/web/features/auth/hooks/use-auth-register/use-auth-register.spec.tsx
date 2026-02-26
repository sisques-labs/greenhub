import { authApiClient } from '@/features/auth/api/auth-api.client';
import { useAuthRegister } from '@/features/auth/hooks/use-auth-register/use-auth-register';
import { useAppRoutes } from '@/shared/hooks/use-routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('@/features/auth/api/auth-api.client');
jest.mock('@/shared/hooks/use-routes');

const mockPush = jest.fn();

describe('useAuthRegister', () => {
	let queryClient: QueryClient;

	const mockRegisterInput = {
		email: 'test@example.com',
		password: 'password123',
		confirmPassword: 'password123',
		name: 'Test User',
	};

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
				home: '/en/home',
				auth: '/en/auth',
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
			const { result } = renderHook(() => useAuthRegister(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleRegister).toBe('function');
		});
	});

	describe('Successful registration', () => {
		it('should register and login, then redirect to home', async () => {
			(authApiClient.register as jest.Mock).mockResolvedValue({ success: true });
			(authApiClient.login as jest.Mock).mockResolvedValue({
				accessToken: 'token',
			});

			const { result } = renderHook(() => useAuthRegister(), { wrapper });

			await result.current.handleRegister(mockRegisterInput);

			await waitFor(() => {
				expect(result.current.isSuccess).toBe(true);
			});

			expect(authApiClient.register).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
			});
			expect(authApiClient.login).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'password123',
			});
			expect(mockPush).toHaveBeenCalledWith('/en/home');
		});

		it('should strip confirmPassword before sending to API', async () => {
			(authApiClient.register as jest.Mock).mockResolvedValue({ success: true });
			(authApiClient.login as jest.Mock).mockResolvedValue({
				accessToken: 'token',
			});

			const { result } = renderHook(() => useAuthRegister(), { wrapper });

			await result.current.handleRegister(mockRegisterInput);

			expect(authApiClient.register).toHaveBeenCalledWith(
				expect.not.objectContaining({ confirmPassword: expect.anything() }),
			);
		});
	});

	describe('Failed registration', () => {
		it('should throw when registration fails', async () => {
			(authApiClient.register as jest.Mock).mockResolvedValue({
				success: false,
				message: 'Email already exists',
			});

			const { result } = renderHook(() => useAuthRegister(), { wrapper });

			await expect(
				result.current.handleRegister(mockRegisterInput),
			).rejects.toThrow('Email already exists');

			expect(authApiClient.login).not.toHaveBeenCalled();
		});

		it('should redirect to auth page if auto-login fails', async () => {
			(authApiClient.register as jest.Mock).mockResolvedValue({ success: true });
			(authApiClient.login as jest.Mock).mockRejectedValue(
				new Error('Login failed'),
			);

			const { result } = renderHook(() => useAuthRegister(), { wrapper });

			await expect(
				result.current.handleRegister(mockRegisterInput),
			).rejects.toThrow();

			expect(mockPush).toHaveBeenCalledWith('/en/auth');
		});
	});
});
