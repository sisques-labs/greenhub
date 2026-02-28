import { locationsApiClient } from '@/features/locations/api/locations-api.client';
import { useLocationsFindByCriteria } from '@/features/locations/hooks/use-locations-find-by-criteria/use-locations-find-by-criteria';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/locations/api/locations-api.client');

describe('useLocationsFindByCriteria', () => {
	let queryClient: QueryClient;

	const mockPaginatedResult = {
		items: [
			{ id: 'loc-1', name: 'Greenhouse', type: 'INDOOR', description: null },
			{ id: 'loc-2', name: 'Garden', type: 'OUTDOOR', description: 'Main garden' },
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
			(locationsApiClient.findByCriteria as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useLocationsFindByCriteria(), {
				wrapper,
			});

			expect(result.current.locations).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return locations on success', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const { result } = renderHook(() => useLocationsFindByCriteria(), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.locations).toEqual(mockPaginatedResult);
			expect(result.current.error).toBeNull();
		});

		it('should call findByCriteria with provided input', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const input = { page: 1, perPage: 10 };

			renderHook(() => useLocationsFindByCriteria(input), { wrapper });

			await waitFor(() =>
				expect(locationsApiClient.findByCriteria).toHaveBeenCalledWith(input),
			);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch locations');
			(locationsApiClient.findByCriteria as jest.Mock).mockRejectedValue(
				mockError,
			);

			const { result } = renderHook(() => useLocationsFindByCriteria(), {
				wrapper,
			});

			await waitFor(() => expect(result.current.error).toBeTruthy());

			expect(result.current.locations).toBeNull();
		});
	});

	describe('Options', () => {
		it('should not fetch when enabled is false', () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			renderHook(
				() => useLocationsFindByCriteria(undefined, { enabled: false }),
				{ wrapper },
			);

			expect(locationsApiClient.findByCriteria).not.toHaveBeenCalled();
		});

		it('should expose refetch function', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockPaginatedResult,
			);

			const { result } = renderHook(() => useLocationsFindByCriteria(), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
