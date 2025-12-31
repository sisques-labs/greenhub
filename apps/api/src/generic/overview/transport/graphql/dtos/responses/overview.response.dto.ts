import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('OverviewResponseDto')
export class OverviewResponseDto {
	@Field(() => String, { description: 'The id of the overview' })
	id: string;

	// Plants metrics
	@Field(() => Number, { description: 'The total number of plants' })
	totalPlants: number;

	@Field(() => Number, {
		description: 'The total number of active plants (not dead, not archived)',
	})
	totalActivePlants: number;

	@Field(() => Number, {
		description: 'The average number of plants per growing unit',
	})
	averagePlantsPerGrowingUnit: number;

	// Plants by status
	@Field(() => Number, {
		description: 'The number of plants with PLANTED status',
	})
	plantsPlanted: number;

	@Field(() => Number, {
		description: 'The number of plants with GROWING status',
	})
	plantsGrowing: number;

	@Field(() => Number, {
		description: 'The number of plants with HARVESTED status',
	})
	plantsHarvested: number;

	@Field(() => Number, { description: 'The number of plants with DEAD status' })
	plantsDead: number;

	@Field(() => Number, {
		description: 'The number of plants with ARCHIVED status',
	})
	plantsArchived: number;

	// Additional plant metrics
	@Field(() => Number, {
		description: 'The number of plants without a planted date',
	})
	plantsWithoutPlantedDate: number;

	@Field(() => Number, { description: 'The number of plants with notes' })
	plantsWithNotes: number;

	@Field(() => Number, {
		description: 'The number of plants created in the last 7 days',
	})
	recentPlants: number;

	// Growing units metrics
	@Field(() => Number, { description: 'The total number of growing units' })
	totalGrowingUnits: number;

	@Field(() => Number, {
		description: 'The number of growing units with at least 1 plant',
	})
	activeGrowingUnits: number;

	@Field(() => Number, {
		description: 'The number of growing units without plants',
	})
	emptyGrowingUnits: number;

	// Growing units by type
	@Field(() => Number, {
		description: 'The number of growing units of type POT',
	})
	growingUnitsPot: number;

	@Field(() => Number, {
		description: 'The number of growing units of type GARDEN_BED',
	})
	growingUnitsGardenBed: number;

	@Field(() => Number, {
		description: 'The number of growing units of type HANGING_BASKET',
	})
	growingUnitsHangingBasket: number;

	@Field(() => Number, {
		description: 'The number of growing units of type WINDOW_BOX',
	})
	growingUnitsWindowBox: number;

	// Capacity metrics
	@Field(() => Number, {
		description: 'The total capacity across all growing units',
	})
	totalCapacity: number;

	@Field(() => Number, {
		description: 'The total capacity used across all growing units',
	})
	totalCapacityUsed: number;

	@Field(() => Number, {
		description: 'The average occupancy percentage across all growing units',
	})
	averageOccupancy: number;

	@Field(() => Number, {
		description: 'The number of growing units at limit (>= 80% occupancy)',
	})
	growingUnitsAtLimit: number;

	@Field(() => Number, {
		description:
			'The number of growing units at full capacity (100% occupancy)',
	})
	growingUnitsFull: number;

	@Field(() => Number, {
		description: 'The total remaining capacity across all growing units',
	})
	totalRemainingCapacity: number;

	// Dimensions metrics
	@Field(() => Number, {
		description: 'The number of growing units with dimensions',
	})
	growingUnitsWithDimensions: number;

	@Field(() => Number, {
		description: 'The total volume of growing units with dimensions',
	})
	totalVolume: number;

	@Field(() => Number, {
		description: 'The average volume of growing units with dimensions',
	})
	averageVolume: number;

	// Aggregated metrics
	@Field(() => Number, {
		description: 'The minimum number of plants per growing unit',
	})
	minPlantsPerGrowingUnit: number;

	@Field(() => Number, {
		description: 'The maximum number of plants per growing unit',
	})
	maxPlantsPerGrowingUnit: number;

	@Field(() => Number, {
		description: 'The median number of plants per growing unit',
	})
	medianPlantsPerGrowingUnit: number;

	@Field(() => Date, {
		description: 'The created at timestamp of the overview',
	})
	createdAt: Date;

	@Field(() => Date, {
		description: 'The updated at timestamp of the overview',
	})
	updatedAt: Date;
}

