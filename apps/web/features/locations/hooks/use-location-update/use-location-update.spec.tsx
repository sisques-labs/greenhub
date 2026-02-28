import { locationsApiClient } from '@/features/locations/api/locations-api.client';
import { useLocationUpdate } from '@/features/locations/hooks/use-location-update/use-location-update';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/locations/api/locations-api.client');

describe('useLocationUpdate', () => {
	let queryClient: QueryClient;

	const mockFormValues = {
		name: 'Updated Greenhouse',
		type: 'INDOOR' as const,
		description: 'Updated description',
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
			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(typeof result.current.handleUpdate).toBe('function');
		});
	});

	describe('Successful update', () => {
		it('should call onSuccess callback when updated successfully', async () => {
			(locationsApiClient.update as jest.Mock).mockResolvedValue({
				success: true,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate('loc-1', mockFormValues, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call update with correct input', async () => {
			(locationsApiClient.update as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate('loc-1', mockFormValues);
			});

			expect(locationsApiClient.update).toHaveBeenCalledWith({
				id: 'loc-1',
				name: 'Updated Greenhouse',
				type: 'INDOOR',
				description: 'Updated description',
			});
		});

		it('should invalidate location queries on success', async () => {
			(locationsApiClient.update as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate('loc-1', mockFormValues);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['locations', 'detail', 'loc-1'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['locations', 'list'],
			});
		});

		it('should call onError when result.success is false', async () => {
			(locationsApiClient.update as jest.Mock).mockResolvedValue({
				success: false,
				message: 'Cannot update',
			});

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(
					'loc-1',
					mockFormValues,
					undefined,
					mockOnError,
				);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Cannot update' }),
			);
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when update throws', async () => {
			const mockError = new Error('Network error');
			(locationsApiClient.update as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(
					'loc-1',
					mockFormValues,
					undefined,
					mockOnError,
				);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(locationsApiClient.update as jest.Mock).mockRejectedValue('string error');

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(
					'loc-1',
					mockFormValues,
					undefined,
					mockOnError,
				);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Location update failed' }),
			);
		});
	});
});
