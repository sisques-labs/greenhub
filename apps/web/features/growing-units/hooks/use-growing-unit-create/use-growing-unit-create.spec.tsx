import { growingUnitsApiClient } from '@/features/growing-units/api/growing-units-api.client';
import { useGrowingUnitCreate } from '@/features/growing-units/hooks/use-growing-unit-create/use-growing-unit-create';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/growing-units/api/growing-units-api.client');

describe('useGrowingUnitCreate', () => {
	let queryClient: QueryClient;

	const mockInput = {
		locationId: 'loc-1',
		name: 'My Garden',
		type: 'GARDEN_BED' as const,
		capacity: 20,
		length: 2,
		width: 1,
		height: 0.5,
		unit: 'METERS' as const,
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
			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(result.current.isSuccess).toBe(false);
			expect(typeof result.current.handleCreate).toBe('function');
		});
	});

	describe('Successful create', () => {
		it('should call onSuccess callback when growing unit is created', async () => {
			(growingUnitsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call create with correct input', async () => {
			(growingUnitsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput);
			});

			expect(growingUnitsApiClient.create).toHaveBeenCalledWith(mockInput);
		});

		it('should invalidate growing-units queries on success', async () => {
			(growingUnitsApiClient.create as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput);
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['growing-units'],
			});
		});

		it('should not call onSuccess when result.success is false', async () => {
			(growingUnitsApiClient.create as jest.Mock).mockResolvedValue({
				success: false,
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, mockOnSuccess);
			});

			expect(mockOnSuccess).not.toHaveBeenCalled();
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when create fails', async () => {
			const mockError = new Error('Growing unit create failed');
			(growingUnitsApiClient.create as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(growingUnitsApiClient.create as jest.Mock).mockRejectedValue(
				'string error',
			);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useGrowingUnitCreate(), { wrapper });

			await act(async () => {
				await result.current.handleCreate(mockInput, undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Growing unit create failed' }),
			);
		});
	});
});
