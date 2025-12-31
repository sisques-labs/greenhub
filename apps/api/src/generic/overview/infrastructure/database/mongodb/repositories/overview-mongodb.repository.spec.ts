import { Collection } from "mongodb";
import { OverviewViewModel } from "@/generic/overview/domain/view-models/plant/overview.view-model";
import { OverviewMongoDbDto } from "@/generic/overview/infrastructure/database/mongodb/dtos/overview-mongodb.dto";
import { OverviewMongoDBMapper } from "@/generic/overview/infrastructure/database/mongodb/mappers/overview-mongodb.mapper";
import { OverviewMongoRepository } from "@/generic/overview/infrastructure/database/mongodb/repositories/overview-mongodb.repository";
import { Criteria } from "@/shared/domain/entities/criteria";
import { PaginatedResult } from "@/shared/domain/entities/paginated-result.entity";
import { MongoMasterService } from "@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service";

describe("OverviewMongoRepository", () => {
	let repository: OverviewMongoRepository;
	let mockMongoMasterService: jest.Mocked<MongoMasterService>;
	let mockOverviewMongoDBMapper: jest.Mocked<OverviewMongoDBMapper>;
	let mockCollection: jest.Mocked<Collection>;

	beforeEach(() => {
		const mockFind = jest.fn();
		const mockSort = jest.fn();
		const mockSkip = jest.fn();
		const mockLimit = jest.fn();
		const mockToArray = jest.fn();

		mockFind.mockReturnValue({
			sort: mockSort,
		});
		mockSort.mockReturnValue({
			skip: mockSkip,
		});
		mockSkip.mockReturnValue({
			limit: mockLimit,
		});
		mockLimit.mockReturnValue({
			toArray: mockToArray,
		});

		mockCollection = {
			findOne: jest.fn(),
			find: mockFind,
			replaceOne: jest.fn(),
			deleteOne: jest.fn(),
			countDocuments: jest.fn(),
		} as unknown as jest.Mocked<Collection>;

		mockMongoMasterService = {
			getCollection: jest.fn().mockReturnValue(mockCollection),
		} as unknown as jest.Mocked<MongoMasterService>;

		mockOverviewMongoDBMapper = {
			toViewModel: jest.fn(),
			toMongoData: jest.fn(),
		} as unknown as jest.Mocked<OverviewMongoDBMapper>;

		repository = new OverviewMongoRepository(
			mockMongoMasterService,
			mockOverviewMongoDBMapper,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findById", () => {
		it("should return overview view model when overview exists", async () => {
			const overviewId = "overview";
			const createdAt = new Date("2024-01-01");
			const updatedAt = new Date("2024-01-02");

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

			mockCollection.findOne.mockResolvedValue(mongoDoc);
			mockOverviewMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findById(overviewId);

			expect(result).toBe(viewModel);
			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				"overviews",
			);
			expect(mockCollection.findOne).toHaveBeenCalledWith({
				id: overviewId,
			});
			expect(mockOverviewMongoDBMapper.toViewModel).toHaveBeenCalledWith({
				id: mongoDoc.id,
				totalPlants: mongoDoc.totalPlants,
				totalActivePlants: mongoDoc.totalActivePlants,
				averagePlantsPerGrowingUnit: mongoDoc.averagePlantsPerGrowingUnit,
				plantsPlanted: mongoDoc.plantsPlanted,
				plantsGrowing: mongoDoc.plantsGrowing,
				plantsHarvested: mongoDoc.plantsHarvested,
				plantsDead: mongoDoc.plantsDead,
				plantsArchived: mongoDoc.plantsArchived,
				plantsWithoutPlantedDate: mongoDoc.plantsWithoutPlantedDate,
				plantsWithNotes: mongoDoc.plantsWithNotes,
				recentPlants: mongoDoc.recentPlants,
				totalGrowingUnits: mongoDoc.totalGrowingUnits,
				activeGrowingUnits: mongoDoc.activeGrowingUnits,
				emptyGrowingUnits: mongoDoc.emptyGrowingUnits,
				growingUnitsPot: mongoDoc.growingUnitsPot,
				growingUnitsGardenBed: mongoDoc.growingUnitsGardenBed,
				growingUnitsHangingBasket: mongoDoc.growingUnitsHangingBasket,
				growingUnitsWindowBox: mongoDoc.growingUnitsWindowBox,
				totalCapacity: mongoDoc.totalCapacity,
				totalCapacityUsed: mongoDoc.totalCapacityUsed,
				averageOccupancy: mongoDoc.averageOccupancy,
				growingUnitsAtLimit: mongoDoc.growingUnitsAtLimit,
				growingUnitsFull: mongoDoc.growingUnitsFull,
				totalRemainingCapacity: mongoDoc.totalRemainingCapacity,
				growingUnitsWithDimensions: mongoDoc.growingUnitsWithDimensions,
				totalVolume: mongoDoc.totalVolume,
				averageVolume: mongoDoc.averageVolume,
				minPlantsPerGrowingUnit: mongoDoc.minPlantsPerGrowingUnit,
				maxPlantsPerGrowingUnit: mongoDoc.maxPlantsPerGrowingUnit,
				medianPlantsPerGrowingUnit: mongoDoc.medianPlantsPerGrowingUnit,
				createdAt: mongoDoc.createdAt,
				updatedAt: mongoDoc.updatedAt,
			});
		});

		it("should return null when overview does not exist", async () => {
			const overviewId = "overview";

			mockCollection.findOne.mockResolvedValue(null);

			const result = await repository.findById(overviewId);

			expect(result).toBeNull();
			expect(mockCollection.findOne).toHaveBeenCalledWith({
				id: overviewId,
			});
			expect(mockOverviewMongoDBMapper.toViewModel).not.toHaveBeenCalled();
		});
	});

	describe("findByCriteria", () => {
		it("should return paginated result with overviews when criteria matches", async () => {
			const createdAt = new Date("2024-01-01");
			const updatedAt = new Date("2024-01-02");
			const criteria = new Criteria([], [], { page: 1, perPage: 10 });

			const mongoDocs: OverviewMongoDbDto[] = [
				{
					id: "overview",
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
				},
			];

			const viewModel = new OverviewViewModel({
				id: "overview",
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

			const findChain = {
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockReturnThis(),
				toArray: jest.fn().mockResolvedValue(mongoDocs),
			};

			(mockCollection.find as jest.Mock).mockReturnValue(findChain);
			mockCollection.countDocuments.mockResolvedValue(1);
			mockOverviewMongoDBMapper.toViewModel.mockReturnValue(viewModel);

			const result = await repository.findByCriteria(criteria);

			expect(result).toBeInstanceOf(PaginatedResult);
			expect(result.items).toHaveLength(1);
			expect(result.items[0]).toBe(viewModel);
			expect(result.total).toBe(1);
			expect(result.page).toBe(1);
			expect(result.perPage).toBe(10);
		});
	});

	describe("save", () => {
		it("should save overview view model using upsert", async () => {
			const overviewId = "overview";
			const createdAt = new Date("2024-01-01");
			const updatedAt = new Date("2024-01-02");

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

			const mongoData: OverviewMongoDbDto = {
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

			mockOverviewMongoDBMapper.toMongoData.mockReturnValue(mongoData);
			mockCollection.replaceOne.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			} as any);

			await repository.save(viewModel);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				"overviews",
			);
			expect(mockOverviewMongoDBMapper.toMongoData).toHaveBeenCalledWith(
				viewModel,
			);
			expect(mockCollection.replaceOne).toHaveBeenCalledWith(
				{ id: overviewId },
				mongoData,
				{ upsert: true },
			);
		});
	});

	describe("delete", () => {
		it("should delete overview view model by id", async () => {
			const overviewId = "overview";

			mockCollection.deleteOne.mockResolvedValue({
				acknowledged: true,
				deletedCount: 1,
			} as any);

			await repository.delete(overviewId);

			expect(mockMongoMasterService.getCollection).toHaveBeenCalledWith(
				"overviews",
			);
			expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: overviewId });
		});
	});
});
