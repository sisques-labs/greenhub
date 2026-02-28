import { growingUnitsApiClient } from '@/features/growing-units/api/growing-units-api.client';
import { useGrowingUnitsFindByCriteria } from '@/features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/growing-units/api/growing-units-api.client');

describe('useGrowingUnitsFindByCriteria', () => {
	let queryClient: QueryClient;

	const mockPaginatedResult = {
		items: [
			{ id: 'unit-1', name: 'Greenhouse A', type: 'GARDEN_BED', capacity: 20 },
			{ id: 'unit-2', name: 'Balcony Pots', type: 'POT', capacity: 5 },
		],
		total: 2,
		totalPages: 1,
		page: 1,
		perPage: 10,
	};

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});
		jest.clearAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial state', () => {
		it('should return null while loading', () => {
			(growingUnitsApiClient.findByCriteria as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useGrowingUnitsFindByCriteria(), {
				wrapper,
			});

			expect(result.current.growingUnits).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return growing units on success', async () => {
			(growingUnitsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const { result } = renderHook(() => useGrowingUnitsFindByCriteria(), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.growingUnits).toEqual(mockPaginatedResult);
			expect(result.current.error).toBeNull();
		});

		it('should call findByCriteria with provided input', async () => {
			(growingUnitsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const input = {
				filters: [],
				sorts: [],
				pagination: { page: 1, perPage: 10 },
			};

			renderHook(() => useGrowingUnitsFindByCriteria(input as any), { wrapper });

			await waitFor(() =>
				expect(growingUnitsApiClient.findByCriteria).toHaveBeenCalledWith(input),
			);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch growing units');
			(growingUnitsApiClient.findByCriteria as jest.Mock).mockRejectedValue(
				mockError,
			);

			const { result } = renderHook(() => useGrowingUnitsFindByCriteria(), {
				wrapper,
			});

			await waitFor(() => expect(result.current.error).toBeTruthy());

			expect(result.current.growingUnits).toBeNull();
		});
	});

	describe('Options', () => {
		it('should not fetch when enabled is false', () => {
			(growingUnitsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			renderHook(
				() => useGrowingUnitsFindByCriteria(undefined, { enabled: false }),
				{ wrapper },
			);

			expect(growingUnitsApiClient.findByCriteria).not.toHaveBeenCalled();
		});

		it('should expose refetch function', async () => {
			(growingUnitsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const { result } = renderHook(() => useGrowingUnitsFindByCriteria(), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
