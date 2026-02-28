import { dashboardApiClient } from '@/features/dashboard/api/dashboard-api.client';
import { useDashboardPage } from '@/features/dashboard/hooks/use-dashboard-page/use-dashboard-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

jest.mock('@/features/dashboard/api/dashboard-api.client');

describe('useDashboardPage', () => {
	let queryClient: QueryClient;

	const mockOverview = {
		totalPlants: 10,
		activeGrowingUnits: 5,
		plantsHarvested: 3,
		growingUnitsAtLimit: 1,
		growingUnitsFull: 2,
	};

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false, staleTime: 0 },
			},
		});
		jest.clearAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	describe('Initial state', () => {
		it('should return default stats while loading', () => {
			(dashboardApiClient.getOverview as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useDashboardPage(), { wrapper });

			expect(result.current.overview).toBeNull();
			expect(result.current.isLoading).toBe(true);
			expect(result.current.stats).toEqual({
				totalPlants: 0,
				activeUnits: 0,
				readyForHarvest: 0,
				criticalAlerts: 0,
			});
		});

		it('should return empty arrays for non-implemented sections', () => {
			(dashboardApiClient.getOverview as jest.Mock).mockImplementation(
				() => new Promise(() => {}),
			);

			const { result } = renderHook(() => useDashboardPage(), { wrapper });

			expect(result.current.recentGrowingUnits).toEqual([]);
			expect(result.current.recentAlerts).toEqual([]);
			expect(result.current.todayTasks).toEqual([]);
		});
	});

	describe('Successful fetch', () => {
		it('should return overview data on success', async () => {
			(dashboardApiClient.getOverview as jest.Mock).mockResolvedValue(
				mockOverview,
			);

			const { result } = renderHook(() => useDashboardPage(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.overview).toEqual(mockOverview);
		});

		it('should calculate stats correctly', async () => {
			(dashboardApiClient.getOverview as jest.Mock).mockResolvedValue(
				mockOverview,
			);

			const { result } = renderHook(() => useDashboardPage(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.stats).toEqual({
				totalPlants: 10,
				activeUnits: 5,
				readyForHarvest: 3,
				criticalAlerts: 3, // growingUnitsAtLimit + growingUnitsFull = 1 + 2
			});
		});
	});

	describe('Error handling', () => {
		it('should return error on failed fetch', async () => {
			const mockError = new Error('Failed to fetch dashboard');
			(dashboardApiClient.getOverview as jest.Mock).mockRejectedValue(mockError);

			const { result } = renderHook(() => useDashboardPage(), { wrapper });

			await waitFor(() => expect(result.current.error).toBeTruthy());
		});

		it('should keep default stats when overview is null', async () => {
			(dashboardApiClient.getOverview as jest.Mock).mockResolvedValue(null);

			const { result } = renderHook(() => useDashboardPage(), { wrapper });

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			expect(result.current.stats).toEqual({
				totalPlants: 0,
				activeUnits: 0,
				readyForHarvest: 0,
				criticalAlerts: 0,
			});
		});
	});
});
