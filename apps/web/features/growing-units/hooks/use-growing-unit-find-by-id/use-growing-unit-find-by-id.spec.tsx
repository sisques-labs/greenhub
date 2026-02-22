import { growingUnitsApiClient } from '@/features/growing-units/api/growing-units-api.client';
import { useGrowingUnitFindById } from '@/features/growing-units/hooks/use-growing-unit-find-by-id/use-growing-unit-find-by-id';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/growing-units/api/growing-units-api.client');

describe('useGrowingUnitFindById', () => {
	let queryClient: QueryClient;

	const mockGrowingUnit = {
		id: 'unit-1',
		name: 'Test Unit',
		type: 'POT',
		capacity: 10,
		numberOfPlants: 5,
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
			(growingUnitsApiClient.findById as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useGrowingUnitFindById('unit-1'), {
				wrapper,
			});

			expect(result.current.growingUnit).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return growing unit data on success', async () => {
			(growingUnitsApiClient.findById as jest.Mock).mockResolvedValue(
				mockGrowingUnit,
			);

			const { result } = renderHook(() => useGrowingUnitFindById('unit-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.growingUnit).toEqual(mockGrowingUnit);
			expect(result.current.error).toBeNull();
		});

		it('should call findById with correct id', async () => {
			(growingUnitsApiClient.findById as jest.Mock).mockResolvedValue(
				mockGrowingUnit,
			);

			renderHook(() => useGrowingUnitFindById('unit-1'), { wrapper });

			await waitFor(() =>
				expect(growingUnitsApiClient.findById).toHaveBeenCalledWith({
					id: 'unit-1',
				}),
			);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch growing unit');
			(growingUnitsApiClient.findById as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => useGrowingUnitFindById('unit-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.error).toBeTruthy());

			expect(result.current.growingUnit).toBeNull();
		});
	});

	describe('Options', () => {
		it('should not fetch when enabled is false', () => {
			(growingUnitsApiClient.findById as jest.Mock).mockResolvedValue(
				mockGrowingUnit,
			);

			renderHook(() => useGrowingUnitFindById('unit-1', { enabled: false }), {
				wrapper,
			});

			expect(growingUnitsApiClient.findById).not.toHaveBeenCalled();
		});

		it('should not fetch when id is empty string', () => {
			(growingUnitsApiClient.findById as jest.Mock).mockResolvedValue(
				mockGrowingUnit,
			);

			renderHook(() => useGrowingUnitFindById(''), { wrapper });

			expect(growingUnitsApiClient.findById).not.toHaveBeenCalled();
		});

		it('should expose refetch function', async () => {
			(growingUnitsApiClient.findById as jest.Mock).mockResolvedValue(
				mockGrowingUnit,
			);

			const { result } = renderHook(() => useGrowingUnitFindById('unit-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
