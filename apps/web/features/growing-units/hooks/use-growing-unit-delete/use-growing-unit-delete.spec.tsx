import { growingUnitsApiClient } from '@/features/growing-units/api/growing-units-api.client';
import { useGrowingUnitDelete } from '@/features/growing-units/hooks/use-growing-unit-delete/use-growing-unit-delete';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/growing-units/api/growing-units-api.client');

describe('useGrowingUnitDelete', () => {
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
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial state', () => {
		it('should return correct initial state', () => {
			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleDelete).toBe('function');
		});
	});

	describe('Successful delete', () => {
		it('should call onSuccess callback when deleted successfully', async () => {
			(growingUnitsApiClient.delete as jest.Mock).mockResolvedValue({
				success: true,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('unit-1', mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call delete with correct id', async () => {
			(growingUnitsApiClient.delete as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('unit-1');
			});

			expect(growingUnitsApiClient.delete).toHaveBeenCalledWith('unit-1');
		});

		it('should invalidate growing-units queries on success', async () => {
			(growingUnitsApiClient.delete as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('unit-1');
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units'],
			});
		});

		it('should not call onSuccess when result.success is false', async () => {
			(growingUnitsApiClient.delete as jest.Mock).mockResolvedValue({
				success: false,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('unit-1', mockOnSuccess);
			});

			expect(mockOnSuccess).not.toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when delete fails', async () => {
			const mockError = new Error('Growing unit delete failed');
			(growingUnitsApiClient.delete as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('unit-1', undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(growingUnitsApiClient.delete as jest.Mock).mockRejectedValue(
				'string error',
			);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useGrowingUnitDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('unit-1', undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Growing unit delete failed' }),
			);
		});
	});
});
