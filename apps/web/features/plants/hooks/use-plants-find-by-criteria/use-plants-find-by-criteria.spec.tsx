import { plantsApiClient } from '@/features/plants/api/plants-api.client';
import { usePlantsFindByCriteria } from '@/features/plants/hooks/use-plants-find-by-criteria/use-plants-find-by-criteria';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/plants/api/plants-api.client');

describe('usePlantsFindByCriteria', () => {
	let queryClient: QueryClient;

	const mockPaginatedResult = {
		items: [
			{ id: 'plant-1', name: 'Tomato', species: 'Solanum lycopersicum', status: 'GROWING' },
			{ id: 'plant-2', name: 'Basil', species: 'Ocimum basilicum', status: 'PLANTED' },
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
		it('should return null plants while loading', () => {
			(plantsApiClient.findByCriteria as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => usePlantsFindByCriteria(), { wrapper });

			expect(result.current.plants).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return plants on success', async () => {
			(plantsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const { result } = renderHook(() => usePlantsFindByCriteria(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.plants).toEqual(mockPaginatedResult);
			expect(result.current.error).toBeNull();
		});

		it('should call findByCriteria with provided input', async () => {
			(plantsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const input = {
				pagination: { page: 1, perPage: 10 },
			};

			renderHook(() => usePlantsFindByCriteria(input as any), { wrapper });

			await waitFor(() =>
				expect(plantsApiClient.findByCriteria).toHaveBeenCalledWith(input),
			);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch plants');
			(plantsApiClient.findByCriteria as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => usePlantsFindByCriteria(), { wrapper });

			await waitFor(() => expect(result.current.error).toBeTruthy());

			expect(result.current.plants).toBeNull();
		});
	});

	describe('Options', () => {
		it('should not fetch when enabled is false', () => {
			(plantsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			renderHook(() => usePlantsFindByCriteria(undefined, { enabled: false }), {
				wrapper,
			});

			expect(plantsApiClient.findByCriteria).not.toHaveBeenCalled();
		});

		it('should expose refetch function', async () => {
			(plantsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const { result } = renderHook(() => usePlantsFindByCriteria(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
