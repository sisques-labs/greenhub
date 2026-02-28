import { locationsApiClient } from '@/features/locations/api/locations-api.client';
import { useLocationCreate } from '@/features/locations/hooks/use-location-create/use-location-create';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/locations/api/locations-api.client');

describe('useLocationCreate', () => {
	let queryClient: QueryClient;

	const mockFormValues = {
		name: 'My Greenhouse',
		type: 'INDOOR' as const,
		description: 'A beautiful greenhouse',
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
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial state', () => {
		it('should return correct initial state', () => {
			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(typeof result.current.handleCreate).toBe('function');
		});
	});

	describe('Successful create', () => {
		it('should call onSuccess callback when location is created', async () => {
			(locationsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
				message: 'Location created',
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockFormValues, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call create with correct input from form values', async () => {
			(locationsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockFormValues);
			});

			expect(locationsApiClient.create).toHaveBeenCalledWith({
				name: 'My Greenhouse',
				type: 'INDOOR',
				description: 'A beautiful greenhouse',
			});
		});

		it('should invalidate locations list on success', async () => {
			(locationsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockFormValues);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['locations', 'list'],
			});
		});

		it('should omit undefined description from API call', async () => {
			(locationsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
			});

			const valuesWithoutDescription = {
				name: 'My Greenhouse',
				type: 'INDOOR' as const,
				description: undefined,
			};

			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(valuesWithoutDescription);
			});

			expect(locationsApiClient.create).toHaveBeenCalledWith({
				name: 'My Greenhouse',
				type: 'INDOOR',
				description: undefined,
			});
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when create fails', async () => {
			const mockError = new Error('Location create failed');
			(locationsApiClient.create as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(
					mockFormValues,
					undefined,
					mockOnError,
				);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should call onError when result.success is false', async () => {
			(locationsApiClient.create as jest.Mock).mockResolvedValue({
				success: false,
				message: 'Failed to create',
			});

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(
					mockFormValues,
					undefined,
					mockOnError,
				);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Failed to create' }),
			);
		});
	});
});
