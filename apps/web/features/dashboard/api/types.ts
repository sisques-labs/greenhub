/**
 * Dashboard/Overview API Types
 * Defines request/response interfaces for dashboard overview data
 */

/**
 * Overview Response from API (with clean, consistent naming)
 */
export interface OverviewResponse {
  id: string;

  // Plant metrics
  totalPlants: number;
  totalActivePlants: number;
  plantsPlanted: number;
  plantsGrowing: number;
  plantsHarvested: number;
  plantsDead: number;
  plantsArchived: number;

  // Plant statistics
  averagePlantsPerGrowingUnit: number;
  minPlantsPerGrowingUnit: number;
  maxPlantsPerGrowingUnit: number;
  medianPlantsPerGrowingUnit: number;

  // Plant details
  plantsWithoutPlantedDate: number;
  plantsWithNotes: number;
  recentPlants: number;

  // Growing unit metrics
  totalGrowingUnits: number;
  activeGrowingUnits: number;
  emptyGrowingUnits: number;

  // Growing unit type breakdown
  totalPots: number;
  totalGardenBeds: number;
  totalHangingBaskets: number;
  totalWindowBoxes: number;

  // Capacity metrics
  totalCapacity: number;
  totalCapacityUsed: number;
  totalCapacityAvailable: number;
  capacityOccupancyPercentage: number;

  // Alert metrics
  growingUnitsAtLimit: number;
  growingUnitsFull: number;

  // Volume metrics
  growingUnitsWithDimensions: number;
  totalVolume: number;
  averageVolume: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Overview API Response (from GraphQL - uses backend field names)
 */
export interface OverviewApiResponse {
  id: string;
  totalPlants: number;
  totalActivePlants: number;
  averagePlantsPerGrowingUnit: number;
  plantsPlanted: number;
  plantsGrowing: number;
  plantsHarvested: number;
  plantsDead: number;
  plantsArchived: number;
  plantsWithoutPlantedDate: number;
  plantsWithNotes: number;
  recentPlants: number;
  totalGrowingUnits: number;
  activeGrowingUnits: number;
  emptyGrowingUnits: number;
  growingUnitsPot: number;
  growingUnitsGardenBed: number;
  growingUnitsHangingBasket: number;
  growingUnitsWindowBox: number;
  totalCapacity: number;
  totalCapacityUsed: number;
  averageOccupancy: number;
  growingUnitsAtLimit: number;
  growingUnitsFull: number;
  totalRemainingCapacity: number;
  growingUnitsWithDimensions: number;
  totalVolume: number;
  averageVolume: number;
  minPlantsPerGrowingUnit: number;
  maxPlantsPerGrowingUnit: number;
  medianPlantsPerGrowingUnit: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transforms the backend API response to the cleaner frontend format
 */
export function transformOverviewResponse(
  apiResponse: OverviewApiResponse
): OverviewResponse {
  return {
    id: apiResponse.id,
    totalPlants: apiResponse.totalPlants,
    totalActivePlants: apiResponse.totalActivePlants,
    plantsPlanted: apiResponse.plantsPlanted,
    plantsGrowing: apiResponse.plantsGrowing,
    plantsHarvested: apiResponse.plantsHarvested,
    plantsDead: apiResponse.plantsDead,
    plantsArchived: apiResponse.plantsArchived,
    averagePlantsPerGrowingUnit: apiResponse.averagePlantsPerGrowingUnit,
    minPlantsPerGrowingUnit: apiResponse.minPlantsPerGrowingUnit,
    maxPlantsPerGrowingUnit: apiResponse.maxPlantsPerGrowingUnit,
    medianPlantsPerGrowingUnit: apiResponse.medianPlantsPerGrowingUnit,
    plantsWithoutPlantedDate: apiResponse.plantsWithoutPlantedDate,
    plantsWithNotes: apiResponse.plantsWithNotes,
    recentPlants: apiResponse.recentPlants,
    totalGrowingUnits: apiResponse.totalGrowingUnits,
    activeGrowingUnits: apiResponse.activeGrowingUnits,
    emptyGrowingUnits: apiResponse.emptyGrowingUnits,
    totalPots: apiResponse.growingUnitsPot,
    totalGardenBeds: apiResponse.growingUnitsGardenBed,
    totalHangingBaskets: apiResponse.growingUnitsHangingBasket,
    totalWindowBoxes: apiResponse.growingUnitsWindowBox,
    totalCapacity: apiResponse.totalCapacity,
    totalCapacityUsed: apiResponse.totalCapacityUsed,
    totalCapacityAvailable: apiResponse.totalRemainingCapacity,
    capacityOccupancyPercentage: apiResponse.averageOccupancy,
    growingUnitsAtLimit: apiResponse.growingUnitsAtLimit,
    growingUnitsFull: apiResponse.growingUnitsFull,
    growingUnitsWithDimensions: apiResponse.growingUnitsWithDimensions,
    totalVolume: apiResponse.totalVolume,
    averageVolume: apiResponse.averageVolume,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
  };
}

/**
 * Dashboard stats calculated from overview
 */
export interface DashboardStats {
  totalPlants: number;
  activeUnits: number;
  readyForHarvest: number;
  criticalAlerts: number;
}
