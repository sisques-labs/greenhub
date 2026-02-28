import { locationsApiClient } from '@/features/locations/api/locations-api.client';
import { useLocationsList } from '@/features/locations/hooks/use-locations-list/use-locations-list';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/locations/api/locations-api.client');

describe('useLocationsList', () => {
	let queryClient: QueryClient;

	const mockLocations = [
		{ id: 'loc-1', name: 'Greenhouse', type: 'INDOOR' },
		{ id: 'loc-2', name: 'Garden', type: 'OUTDOOR' },
	];

	const mockResponse = {
		items: mockLocations,
		total: 2,
		totalPages: 1,
		page: 1,
		perPage: 1000,
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
		it('should return empty array while loading', () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useLocationsList(), { wrapper });

			expect(result.current.locations).toEqual([]);
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return all locations', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockResponse,
			);

			const { result } = renderHook(() => useLocationsList(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.locations).toEqual(mockLocations);
			expect(result.current.error).toBeNull();
		});

		it('should call findByCriteria with large perPage for all locations', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockResponse,
			);

			renderHook(() => useLocationsList(), { wrapper });

			await waitFor(() =>
				expect(locationsApiClient.findByCriteria).toHaveBeenCalledWith({
					page: 1,
					perPage: 1000,
				}),
			);
		});

		it('should return empty array when no data', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue({
				items: [],
				total: 0,
				totalPages: 0,
				page: 1,
				perPage: 1000,
			});

			const { result } = renderHook(() => useLocationsList(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.locations).toEqual([]);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch locations');
			(locationsApiClient.findByCriteria as jest.Mock).mockRejectedValue(
				mockError,
			);

			const { result } = renderHook(() => useLocationsList(), { wrapper });

			await waitFor(() => expect(result.current.error).toBeTruthy());
		});
	});

	describe('refetch', () => {
		it('should expose refetch function', async () => {
			(locationsApiClient.findByCriteria as jest.Mock).mockResolvedValue(
				mockResponse,
			);

			const { result } = renderHook(() => useLocationsList(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
