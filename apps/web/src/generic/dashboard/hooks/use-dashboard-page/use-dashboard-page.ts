import { useOverview } from '@repo/sdk';
import { useEffect, useMemo } from 'react';

/**
 * Hook that provides dashboard data from the overview module
 */
export function useDashboardPage() {
	const { find } = useOverview();

	// Fetch overview data on mount
	useEffect(() => {
		if (!find.loading && !find.data && !find.error) {
			find.fetch();
		}
	}, [find]);

	const overview = find.data;
	const isLoading = find.loading;
	const error = find.error;

	// Calculate dashboard statistics from overview
	const stats = useMemo(() => {
		if (!overview) {
			return {
				totalPlants: 0,
				activeUnits: 0,
				readyForHarvest: 0,
				criticalAlerts: 0,
			};
		}

		return {
			totalPlants: overview.totalPlants,
			activeUnits: overview.activeGrowingUnits,
			readyForHarvest: overview.plantsHarvested,
			criticalAlerts: overview.growingUnitsAtLimit + overview.growingUnitsFull,
		};
	}, [overview]);

	// Get recent growing units for status section (placeholder - would need separate query)
	const recentGrowingUnits = useMemo(() => {
		// TODO: Fetch recent growing units separately if needed
		return [];
	}, []);

	// TODO: Get recent alerts when alerts system is implemented
	const recentAlerts = useMemo(() => {
		// Placeholder for alerts
		return [];
	}, []);

	// TODO: Get today's tasks when tasks system is implemented
	const todayTasks = useMemo(() => {
		// Placeholder for tasks
		return [];
	}, []);

	return {
		// Data
		overview,
		recentGrowingUnits,
		stats,
		recentAlerts,
		todayTasks,

		// Loading states
		isLoading,
		error,
	};
}
