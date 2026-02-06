import { useQuery } from '@tanstack/react-query';
import { dashboardApiClient } from '../../api/dashboard-api.client';
import type { DashboardStats } from '../../api/types';
import { useMemo } from 'react';

/**
 * Hook that provides dashboard data using TanStack Query
 * Replaces SDK's useOverview() with API client
 */
export function useDashboardPage() {
  const query = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardApiClient.getOverview(),
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data can be slightly stale
  });

  const overview = query.data ?? null;
  const isLoading = query.isLoading;
  const error = query.error;

  // Calculate dashboard statistics from overview
  const stats = useMemo<DashboardStats>(() => {
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
