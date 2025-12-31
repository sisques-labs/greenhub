import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents the view model DTO for the overview data.
 *
 * @remarks
 * This interface defines the structure of data for the overview presentation layer.
 * It contains aggregated statistics and metrics from the plant context (core).
 */
export interface IOverviewViewModelDto extends IBaseViewModelDto {
	// Plants metrics
	totalPlants: number;
	totalActivePlants: number;
	averagePlantsPerGrowingUnit: number;

	// Plants by status
	plantsPlanted: number;
	plantsGrowing: number;
	plantsHarvested: number;
	plantsDead: number;
	plantsArchived: number;

	// Additional plant metrics
	plantsWithoutPlantedDate: number;
	plantsWithNotes: number;
	recentPlants: number; // Plants created in last 7 days

	// Growing units metrics
	totalGrowingUnits: number;
	activeGrowingUnits: number; // With at least 1 plant
	emptyGrowingUnits: number; // Without plants

	// Growing units by type
	growingUnitsPot: number;
	growingUnitsGardenBed: number;
	growingUnitsHangingBasket: number;
	growingUnitsWindowBox: number;

	// Capacity metrics
	totalCapacity: number;
	totalCapacityUsed: number;
	averageOccupancy: number; // Percentage
	growingUnitsAtLimit: number; // >= 80% occupancy
	growingUnitsFull: number; // 100% occupancy
	totalRemainingCapacity: number;

	// Dimensions metrics
	growingUnitsWithDimensions: number;
	totalVolume: number; // Only for units with dimensions
	averageVolume: number; // Only for units with dimensions

	// Aggregated metrics
	minPlantsPerGrowingUnit: number;
	maxPlantsPerGrowingUnit: number;
	medianPlantsPerGrowingUnit: number;
}
