import { plantsApiClient } from '@/features/plants/api/plants-api.client';
import { usePlantTransplant } from '@/features/plants/hooks/use-plant-transplant/use-plant-transplant';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/plants/api/plants-api.client');

describe('usePlantTransplant', () => {
	let queryClient: QueryClient;

	const mockInput = {
		plantId: 'plant-1',
		sourceGrowingUnitId: 'unit-1',
		targetGrowingUnitId: 'unit-2',
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
			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleTransplant).toBe('function');
		});
	});

	describe('Successful transplant', () => {
		it('should call onSuccess callback when transplanted successfully', async () => {
			(plantsApiClient.transplant as jest.Mock).mockResolvedValue({
				success: true,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			await act(async () => {
				await result.current.handleTransplant(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call transplant with plantId and remaining input', async () => {
			(plantsApiClient.transplant as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			await act(async () => {
				await result.current.handleTransplant(mockInput);
			});

			expect(plantsApiClient.transplant).toHaveBeenCalledWith(
				'plant-1',
				expect.objectContaining({
					sourceGrowingUnitId: 'unit-1',
					targetGrowingUnitId: 'unit-2',
				}),
			);
		});

		it('should invalidate relevant queries on success', async () => {
			(plantsApiClient.transplant as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			await act(async () => {
				await result.current.handleTransplant(mockInput);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['plants', 'detail', 'plant-1'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['plants', 'list'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units', 'detail', 'unit-1'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units', 'detail', 'unit-2'],
			});
		});

		it('should not call onSuccess when result.success is false', async () => {
			(plantsApiClient.transplant as jest.Mock).mockResolvedValue({
				success: false,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			await act(async () => {
				await result.current.handleTransplant(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).not.toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when transplant fails', async () => {
			const mockError = new Error('Plant transplant failed');
			(plantsApiClient.transplant as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			await act(async () => {
				await result.current.handleTransplant(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(plantsApiClient.transplant as jest.Mock).mockRejectedValue('string error');

			const mockOnError = jest.fn();

			const { result } = renderHook(() => usePlantTransplant(), { wrapper });

			await act(async () => {
				await result.current.handleTransplant(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Plant transplant failed' }),
			);
		});
	});
});
