export type OverviewResponse = {
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
};



