import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewGraphQLMapper } from '@/generic/overview/transport/graphql/mappers/overview.mapper';

describe('OverviewGraphQLMapper', () => {
	let mapper: OverviewGraphQLMapper;
	let overviewViewModelFactory: OverviewViewModelFactory;

	beforeEach(() => {
		mapper = new OverviewGraphQLMapper();
		overviewViewModelFactory = new OverviewViewModelFactory();
	});

	describe('toResponseDto', () => {
		it('should convert overview view model to response DTO with all properties', () => {
			const overviewId = 'overview';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = overviewViewModelFactory.create({
				id: overviewId,
				totalPlants: 150,
				totalActivePlants: 140,
				averagePlantsPerGrowingUnit: 6.0,
				plantsPlanted: 50,
				plantsGrowing: 60,
				plantsHarvested: 20,
				plantsDead: 5,
				plantsArchived: 15,
				plantsWithoutPlantedDate: 10,
				plantsWithNotes: 30,
				recentPlants: 25,
				totalGrowingUnits: 25,
				activeGrowingUnits: 20,
				emptyGrowingUnits: 5,
				growingUnitsPot: 10,
				growingUnitsGardenBed: 8,
				growingUnitsHangingBasket: 5,
				growingUnitsWindowBox: 2,
				totalCapacity: 250,
				totalCapacityUsed: 150,
				averageOccupancy: 60.0,
				growingUnitsAtLimit: 5,
				growingUnitsFull: 2,
				totalRemainingCapacity: 100,
				growingUnitsWithDimensions: 20,
				totalVolume: 50.5,
				averageVolume: 2.525,
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 10,
				medianPlantsPerGrowingUnit: 6.0,
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
				id: overviewId,
				totalPlants: 150,
				totalActivePlants: 140,
				averagePlantsPerGrowingUnit: 6.0,
				plantsPlanted: 50,
				plantsGrowing: 60,
				plantsHarvested: 20,
				plantsDead: 5,
				plantsArchived: 15,
				plantsWithoutPlantedDate: 10,
				plantsWithNotes: 30,
				recentPlants: 25,
				totalGrowingUnits: 25,
				activeGrowingUnits: 20,
				emptyGrowingUnits: 5,
				growingUnitsPot: 10,
				growingUnitsGardenBed: 8,
				growingUnitsHangingBasket: 5,
				growingUnitsWindowBox: 2,
				totalCapacity: 250,
				totalCapacityUsed: 150,
				averageOccupancy: 60.0,
				growingUnitsAtLimit: 5,
				growingUnitsFull: 2,
				totalRemainingCapacity: 100,
				growingUnitsWithDimensions: 20,
				totalVolume: 50.5,
				averageVolume: 2.525,
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 10,
				medianPlantsPerGrowingUnit: 6.0,
				createdAt,
				updatedAt,
			});
		});

		it('should convert overview view model with zero values', () => {
			const overviewId = 'overview';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = overviewViewModelFactory.create({
				id: overviewId,
				totalPlants: 0,
				totalActivePlants: 0,
				averagePlantsPerGrowingUnit: 0,
				plantsPlanted: 0,
				plantsGrowing: 0,
				plantsHarvested: 0,
				plantsDead: 0,
				plantsArchived: 0,
				plantsWithoutPlantedDate: 0,
				plantsWithNotes: 0,
				recentPlants: 0,
				totalGrowingUnits: 0,
				activeGrowingUnits: 0,
				emptyGrowingUnits: 0,
				growingUnitsPot: 0,
				growingUnitsGardenBed: 0,
				growingUnitsHangingBasket: 0,
				growingUnitsWindowBox: 0,
				totalCapacity: 0,
				totalCapacityUsed: 0,
				averageOccupancy: 0,
				growingUnitsAtLimit: 0,
				growingUnitsFull: 0,
				totalRemainingCapacity: 0,
				growingUnitsWithDimensions: 0,
				totalVolume: 0,
				averageVolume: 0,
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 0,
				medianPlantsPerGrowingUnit: 0,
				createdAt,
				updatedAt,
			});

			const result = mapper.toResponseDto(viewModel);

			expect(result).toEqual({
				id: overviewId,
				totalPlants: 0,
				totalActivePlants: 0,
				averagePlantsPerGrowingUnit: 0,
				plantsPlanted: 0,
				plantsGrowing: 0,
				plantsHarvested: 0,
				plantsDead: 0,
				plantsArchived: 0,
				plantsWithoutPlantedDate: 0,
				plantsWithNotes: 0,
				recentPlants: 0,
				totalGrowingUnits: 0,
				activeGrowingUnits: 0,
				emptyGrowingUnits: 0,
				growingUnitsPot: 0,
				growingUnitsGardenBed: 0,
				growingUnitsHangingBasket: 0,
				growingUnitsWindowBox: 0,
				totalCapacity: 0,
				totalCapacityUsed: 0,
				averageOccupancy: 0,
				growingUnitsAtLimit: 0,
				growingUnitsFull: 0,
				totalRemainingCapacity: 0,
				growingUnitsWithDimensions: 0,
				totalVolume: 0,
				averageVolume: 0,
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 0,
				medianPlantsPerGrowingUnit: 0,
				createdAt,
				updatedAt,
			});
		});
	});
});
