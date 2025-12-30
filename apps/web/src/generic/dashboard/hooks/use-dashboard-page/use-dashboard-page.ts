import { useGrowingUnitsFindByCriteria } from '@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { PLANT_STATUS, type PlantResponse } from '@repo/sdk';
import { useMemo } from 'react';

/**
 * Hook that provides dashboard data by aggregating data from multiple contexts
 */
export function useDashboardPage() {
  // Fetch all growing units with their plants for dashboard stats
  const paginationInput = useMemo(
    () => ({
      pagination: {
        page: 1,
        perPage: 1000, // Fetch a large number to get all data for stats
      },
    }),
    [],
  );

  const { growingUnits, isLoading, error } =
    useGrowingUnitsFindByCriteria(paginationInput);

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    if (!growingUnits) {
      return {
        totalPlants: 0,
        activeUnits: 0,
        readyForHarvest: 0,
        criticalAlerts: 0,
      };
    }

    let totalPlants = 0;
    let activeUnits = 0;
    let readyForHarvest = 0;
    let criticalAlerts = 0;

    growingUnits.items.forEach((unit) => {
      const plants = unit.plants || [];
      totalPlants += plants.length;

      // Count active units (units with at least one plant)
      if (plants.length > 0) {
        activeUnits++;
      }

      // Count plants ready for harvest (status HARVESTED)
      const harvestPlants = plants.filter(
        (plant) => plant.status === PLANT_STATUS.HARVESTED,
      );
      readyForHarvest += harvestPlants.length;

      // TODO: Count critical alerts when alerts system is implemented
      // For now, we can use a placeholder based on some condition
      // Example: units with low water or critical conditions
    });

    return {
      totalPlants,
      activeUnits,
      readyForHarvest,
      criticalAlerts,
    };
  }, [growingUnits]);

  // Get recent growing units for status section (limit to 2-3)
  const recentGrowingUnits = useMemo(() => {
    if (!growingUnits) return [];
    return growingUnits.items.slice(0, 3);
  }, [growingUnits]);

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
    growingUnits,
    recentGrowingUnits,
    stats,
    recentAlerts,
    todayTasks,

    // Loading states
    isLoading,
    error,
  };
}
