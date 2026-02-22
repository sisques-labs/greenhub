import { locationsApiClient } from '@/features/locations/api/locations-api.client';
import { useLocationDelete } from '@/features/locations/hooks/use-location-delete/use-location-delete';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/locations/api/locations-api.client');

describe('useLocationDelete', () => {
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
			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
			expect(typeof result.current.handleDelete).toBe('function');
		});
	});

	describe('Successful delete', () => {
		it('should call onSuccess callback when deleted successfully', async () => {
			(locationsApiClient.delete as jest.Mock).mockResolvedValue({
				success: true,
				message: 'Deleted',
			});

			const mockOnSuccess = jest.fn();

			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('loc-1', mockOnSuccess);
			});

			expect(mockOnSuccess).toHaveBeenCalled();
		});

		it('should call delete with correct id', async () => {
			(locationsApiClient.delete as jest.Mock).mockResolvedValue({
				success: true,
			});

			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('loc-1');
			});

			expect(locationsApiClient.delete).toHaveBeenCalledWith({ id: 'loc-1' });
		});

		it('should invalidate location queries on success', async () => {
			(locationsApiClient.delete as jest.Mock).mockResolvedValue({
				success: true,
			});

			const invalidateQueriesSpy = jest.spyOn(
				queryClient,
				'invalidateQueries',
			);

			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('loc-1');
			});

			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['locations', 'detail', 'loc-1'],
			});
			expect(invalidateQueriesSpy).toHaveBeenCalledWith({
				queryKey: ['locations', 'list'],
			});
		});

		it('should call onError when result.success is false', async () => {
			(locationsApiClient.delete as jest.Mock).mockResolvedValue({
				success: false,
				message: 'Cannot delete',
			});

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('loc-1', undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Cannot delete' }),
			);
		});
	});

	describe('Error handling', () => {
		it('should call onError callback when delete throws', async () => {
			const mockError = new Error('Network error');
			(locationsApiClient.delete as jest.Mock).mockRejectedValue(mockError);

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('loc-1', undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		it('should wrap non-Error failures', async () => {
			(locationsApiClient.delete as jest.Mock).mockRejectedValue('string error');

			const mockOnError = jest.fn();

			const { result } = renderHook(() => useLocationDelete(), { wrapper });

			await act(async () => {
				await result.current.handleDelete('loc-1', undefined, mockOnError);
			});

			expect(mockOnError).toHaveBeenCalledWith(
				expect.objectContaining({ message: 'Location delete failed' }),
			);
		});
	});
});
