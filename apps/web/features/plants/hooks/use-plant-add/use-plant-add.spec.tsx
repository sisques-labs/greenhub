import { plantsApiClient } from '@/features/plants/api/plants-api.client';
import { usePlantAdd } from '@/features/plants/hooks/use-plant-add/use-plant-add';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/plants/api/plants-api.client');

describe('usePlantAdd', () => {
	let queryClient: QueryClient;

	const mockInput = {
		growingUnitId: 'unit-1',
		name: 'Tomato',
		species: 'Solanum lycopersicum',
		status: 'PLANTED' as const,
		plantedDate: '2024-01-15T00:00:00.000Z',
		notes: 'Test plant',
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
			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleCreate).toBe('function');
		});
	});

	describe('Successful create', () => {
		it('should call onSuccess callback when plant is created successfully', async () => {
			(plantsApiClient.create as jest.Mock).mockResolvedValue({ success: true });

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call plantsApiClient.create with correct input', async () => {
			(plantsApiClient.create as jest.Mock).mockResolvedValue({ success: true });

			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput);
			});

			expect(plantsApiClient.create).toHaveBeenCalledWith(mockInput);
		});

		it('should invalidate plants and growing-units queries on success', async () => {
			(plantsApiClient.create as jest.Mock).mockResolvedValue({ success: true });

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['plants'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units'],
			});
		});

		it('should not call onSuccess when result.success is false', async () => {
			(plantsApiClient.create as jest.Mock).mockResolvedValue({ success: false });

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).not.toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when create fails', async () => {
			const mockError = new Error('Plant create failed');
			(plantsApiClient.create as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should call onError with wrapped error for non-Error failures', async () => {
			(plantsApiClient.create as jest.Mock).mockRejectedValue('string error');

			const mockOnError = jest.fn();

			const { result } = renderHook(() => usePlantAdd(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Plant create failed' }),
			);
		});
	});
});
