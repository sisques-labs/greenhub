import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { OverviewMongoDbDto } from '@/generic/overview/infrastructure/database/mongodb/dtos/overview-mongodb.dto';
import { OverviewMongoDBMapper } from '@/generic/overview/infrastructure/database/mongodb/mappers/overview-mongodb.mapper';

describe('OverviewMongoDBMapper', () => {
	let mapper: OverviewMongoDBMapper;
	let mockOverviewViewModelFactory: jest.Mocked<OverviewViewModelFactory>;

	beforeEach(() => {
		mockOverviewViewModelFactory = {
			create: jest.fn(),
		} as unknown as jest.Mocked<OverviewViewModelFactory>;

		mapper = new OverviewMongoDBMapper(mockOverviewViewModelFactory);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('toViewModel', () => {
		it('should convert MongoDB document to view model with all properties', () => {
			const overviewId = 'overview';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const mongoDoc: OverviewMongoDbDto = {
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
			};

			const viewModel = new OverviewViewModel({
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

			mockOverviewViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockOverviewViewModelFactory.create).toHaveBeenCalledWith({
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
			expect(mockOverviewViewModelFactory.create).toHaveBeenCalledTimes(1);
		});

		it('should handle date conversion when createdAt/updatedAt are strings', () => {
			const overviewId = 'overview';
			const createdAt = '2024-01-01T00:00:00.000Z';
			const updatedAt = '2024-01-02T00:00:00.000Z';

			const mongoDoc: any = {
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
			};

			const viewModel = new OverviewViewModel({
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
				createdAt: new Date(createdAt),
				updatedAt: new Date(updatedAt),
			});

			mockOverviewViewModelFactory.create.mockReturnValue(viewModel);

			const result = mapper.toViewModel(mongoDoc);

			expect(result).toBe(viewModel);
			expect(mockOverviewViewModelFactory.create).toHaveBeenCalledWith({
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
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
		});
	});

	describe('toMongoData', () => {
		it('should convert view model to MongoDB document with all properties', () => {
			const overviewId = 'overview';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new OverviewViewModel({
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

			const result = mapper.toMongoData(viewModel);

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

		it('should convert view model with zero values', () => {
			const overviewId = 'overview';
			const createdAt = new Date('2024-01-01');
			const updatedAt = new Date('2024-01-02');

			const viewModel = new OverviewViewModel({
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

			const result = mapper.toMongoData(viewModel);

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

