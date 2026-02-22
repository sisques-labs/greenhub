import { growingUnitsApiClient } from '@/features/growing-units/api/growing-units-api.client';
import { useGrowingUnitUpdate } from '@/features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/growing-units/api/growing-units-api.client');

describe('useGrowingUnitUpdate', () => {
	let queryClient: QueryClient;

	const mockInput = {
		id: 'unit-1',
		name: 'Updated Garden',
		locationId: 'loc-1',
		capacity: 25,
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
			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleUpdate).toBe('function');
		});
	});

	describe('Successful update', () => {
		it('should call onSuccess callback when updated successfully', async () => {
			(growingUnitsApiClient.update as jest.Mock).mockResolvedValue({
				success: true,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call update API with id and remaining input', async () => {
			(growingUnitsApiClient.update as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput);
			});

			expect(growingUnitsApiClient.update).toHaveBeenCalledWith(
				'unit-1',
				expect.objectContaining({
					name: 'Updated Garden',
					locationId: 'loc-1',
					capacity: 25,
				}),
			);
		});

		it('should invalidate specific growing unit query and list on success', async () => {
			(growingUnitsApiClient.update as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units', 'detail', 'unit-1'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units', 'list'],
			});
		});

		it('should not call onSuccess when result.success is false', async () => {
			(growingUnitsApiClient.update as jest.Mock).mockResolvedValue({
				success: false,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).not.toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when update fails', async () => {
			const mockError = new Error('Growing unit update failed');
			(growingUnitsApiClient.update as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(growingUnitsApiClient.update as jest.Mock).mockRejectedValue(
				'string error',
			);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useGrowingUnitUpdate(), { wrapper });

			await act(async () => {
				await result.current.handleUpdate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Growing unit update failed' }),
			);
		});
	});
});
