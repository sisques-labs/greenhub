import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for overview documents stored in the MongoDB read database.
 *
 * @remarks
 * This DTO represents the structure of overview documents in the MongoDB read database.
 * It matches the structure of OverviewViewModel for consistency.
 */
export type OverviewMongoDbDto = BaseMongoDto & {
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
	recentPlants: number;

	// Growing units metrics
	totalGrowingUnits: number;
	activeGrowingUnits: number;
	emptyGrowingUnits: number;

	// Growing units by type
	growingUnitsPot: number;
	growingUnitsGardenBed: number;
	growingUnitsHangingBasket: number;
	growingUnitsWindowBox: number;

	// Capacity metrics
	totalCapacity: number;
	totalCapacityUsed: number;
	averageOccupancy: number;
	growingUnitsAtLimit: number;
	growingUnitsFull: number;
	totalRemainingCapacity: number;

	// Dimensions metrics
	growingUnitsWithDimensions: number;
	totalVolume: number;
	averageVolume: number;

	// Aggregated metrics
	minPlantsPerGrowingUnit: number;
	maxPlantsPerGrowingUnit: number;
	medianPlantsPerGrowingUnit: number;
};
