import { plantsApiClient } from '@/features/plants/api/plants-api.client';
import { usePlantFindById } from '@/features/plants/hooks/use-plant-find-by-id/use-plant-find-by-id';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/plants/api/plants-api.client');

describe('usePlantFindById', () => {
	let queryClient: QueryClient;

	const mockPlant = {
		id: 'plant-1',
		name: 'Test Plant',
		species: 'Tomato',
		status: 'GROWING' as const,
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
		it('should return null plant while loading', () => {
			(plantsApiClient.findById as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => usePlantFindById('plant-1'), {
				wrapper,
			});

			expect(result.current.plant).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Successful fetch', () => {
		it('should return plant data on success', async () => {
			(plantsApiClient.findById as jest.Mock).mockResolvedValue(mockPlant);

			const { result } = renderHook(() => usePlantFindById('plant-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.plant).toEqual(mockPlant);
			expect(result.current.error).toBeNull();
		});

		it('should call findById with correct id', async () => {
			(plantsApiClient.findById as jest.Mock).mockResolvedValue(mockPlant);

			renderHook(() => usePlantFindById('plant-1'), { wrapper });

			await waitFor(() =>
				expect(plantsApiClient.findById).toHaveBeenCalledWith({ id: 'plant-1' }),
			);
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch plant');
			(plantsApiClient.findById as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => usePlantFindById('plant-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.error).toBeTruthy());

			expect(result.current.plant).toBeNull();
		});
	});

	describe('Options', () => {
		it('should not fetch when enabled is false', () => {
			(plantsApiClient.findById as jest.Mock).mockResolvedValue(mockPlant);

			renderHook(() => usePlantFindById('plant-1', { enabled: false }), {
				wrapper,
			});

			expect(plantsApiClient.findById).not.toHaveBeenCalled();
		});

		it('should not fetch when id is empty string', () => {
			(plantsApiClient.findById as jest.Mock).mockResolvedValue(mockPlant);

			renderHook(() => usePlantFindById(''), { wrapper });

			expect(plantsApiClient.findById).not.toHaveBeenCalled();
		});

		it('should expose refetch function', async () => {
			(plantsApiClient.findById as jest.Mock).mockResolvedValue(mockPlant);

			const { result } = renderHook(() => usePlantFindById('plant-1'), {
				wrapper,
			});

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(typeof result.current.refetch).toBe('function');
		});
	});
});
