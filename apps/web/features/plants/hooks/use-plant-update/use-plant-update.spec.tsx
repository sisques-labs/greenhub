import { plantsApiClient } from '@/features/plants/api/plants-api.client';
import { usePlantUpdate } from '@/features/plants/hooks/use-plant-update/use-plant-update';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/plants/api/plants-api.client');

describe('usePlantUpdate', () => {
	let queryClient: QueryClient;

	const mockInput = {
		id: 'plant-1',
		name: 'Updated Tomato',
		species: 'Solanum lycopersicum',
		status: 'GROWING' as const,
		notes: 'Updated notes',
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
			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleUpdate).toBe('function');
		});
	});

	describe('Successful update', () => {
		it('should call onSuccess callback when updated successfully', async () => {
			(plantsApiClient.update as jest.Mock).mockResolvedValue({ success: true });

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call update with id and remaining input', async () => {
			(plantsApiClient.update as jest.Mock).mockResolvedValue({ success: true });

			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput);
			});

			expect(plantsApiClient.update).toHaveBeenCalledWith(
				'plant-1',
				expect.objectContaining({
					name: 'Updated Tomato',
					species: 'Solanum lycopersicum',
					status: 'GROWING',
					notes: 'Updated notes',
				}),
			);
		});

		it('should invalidate plant detail and list queries on success', async () => {
			(plantsApiClient.update as jest.Mock).mockResolvedValue({ success: true });

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['plants', 'detail', 'plant-1'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['plants', 'list'],
			});
		});

		it('should not call onSuccess when result.success is false', async () => {
			(plantsApiClient.update as jest.Mock).mockResolvedValue({ success: false });

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).not.toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when update fails', async () => {
			const mockError = new Error('Plant update failed');
			(plantsApiClient.update as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(plantsApiClient.update as jest.Mock).mockRejectedValue('string error');

			const mockOnError = jest.fn();

			const { result } = renderHook(() => usePlantUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Plant update failed' }),
			);
		});
	});
});
