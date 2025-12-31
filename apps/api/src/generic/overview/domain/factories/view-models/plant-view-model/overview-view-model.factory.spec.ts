import { IOverviewViewModelDto } from "@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto";
import { OverviewViewModelFactory } from "@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory";
import { OverviewViewModel } from "@/generic/overview/domain/view-models/plant/overview.view-model";

describe("OverviewViewModelFactory", () => {
	let factory: OverviewViewModelFactory;

	beforeEach(() => {
		factory = new OverviewViewModelFactory();
	});

	describe("create", () => {
		it("should create an OverviewViewModel from DTO", () => {
			const dto: IOverviewViewModelDto = {
				id: "overview-1",
				// Plants metrics
				totalPlants: 150,
				totalActivePlants: 120,
				averagePlantsPerGrowingUnit: 6,
				// Plants by status
				plantsPlanted: 30,
				plantsGrowing: 80,
				plantsHarvested: 20,
				plantsDead: 10,
				plantsArchived: 10,
				// Additional plant metrics
				plantsWithoutPlantedDate: 5,
				plantsWithNotes: 50,
				recentPlants: 15,
				// Growing units metrics
				totalGrowingUnits: 25,
				activeGrowingUnits: 20,
				emptyGrowingUnits: 5,
				// Growing units by type
				growingUnitsPot: 10,
				growingUnitsGardenBed: 8,
				growingUnitsHangingBasket: 4,
				growingUnitsWindowBox: 3,
				// Capacity metrics
				totalCapacity: 300,
				totalCapacityUsed: 150,
				averageOccupancy: 50.0,
				growingUnitsAtLimit: 5,
				growingUnitsFull: 2,
				totalRemainingCapacity: 150,
				// Dimensions metrics
				growingUnitsWithDimensions: 15,
				totalVolume: 5000,
				averageVolume: 333.33,
				// Aggregated metrics
				minPlantsPerGrowingUnit: 0,
				maxPlantsPerGrowingUnit: 12,
				medianPlantsPerGrowingUnit: 6,
				createdAt: new Date("2024-01-15"),
				updatedAt: new Date("2024-01-15"),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(OverviewViewModel);
			expect(viewModel.id).toBe(dto.id);
			expect(viewModel.totalPlants).toBe(dto.totalPlants);
			expect(viewModel.totalGrowingUnits).toBe(dto.totalGrowingUnits);
			expect(viewModel.averagePlantsPerGrowingUnit).toBe(
				dto.averagePlantsPerGrowingUnit,
			);
			expect(viewModel.plantsPlanted).toBe(dto.plantsPlanted);
			expect(viewModel.plantsGrowing).toBe(dto.plantsGrowing);
			expect(viewModel.plantsHarvested).toBe(dto.plantsHarvested);
			expect(viewModel.plantsDead).toBe(dto.plantsDead);
			expect(viewModel.plantsArchived).toBe(dto.plantsArchived);
			expect(viewModel.totalCapacity).toBe(dto.totalCapacity);
			expect(viewModel.totalCapacityUsed).toBe(dto.totalCapacityUsed);
			expect(viewModel.averageOccupancy).toBe(dto.averageOccupancy);
		});

		it("should create an OverviewViewModel from DTO with zero values", () => {
			const dto: IOverviewViewModelDto = {
				id: "overview-empty",
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
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(OverviewViewModel);
			expect(viewModel.totalPlants).toBe(0);
			expect(viewModel.totalGrowingUnits).toBe(0);
			expect(viewModel.totalCapacity).toBe(0);
		});

		it("should create an OverviewViewModel with all metrics set", () => {
			const dto: IOverviewViewModelDto = {
				id: "overview-complete",
				totalPlants: 200,
				totalActivePlants: 180,
				averagePlantsPerGrowingUnit: 8,
				plantsPlanted: 40,
				plantsGrowing: 120,
				plantsHarvested: 30,
				plantsDead: 5,
				plantsArchived: 5,
				plantsWithoutPlantedDate: 10,
				plantsWithNotes: 80,
				recentPlants: 25,
				totalGrowingUnits: 30,
				activeGrowingUnits: 25,
				emptyGrowingUnits: 5,
				growingUnitsPot: 15,
				growingUnitsGardenBed: 10,
				growingUnitsHangingBasket: 3,
				growingUnitsWindowBox: 2,
				totalCapacity: 400,
				totalCapacityUsed: 200,
				averageOccupancy: 50.0,
				growingUnitsAtLimit: 8,
				growingUnitsFull: 3,
				totalRemainingCapacity: 200,
				growingUnitsWithDimensions: 20,
				totalVolume: 6000,
				averageVolume: 300,
				minPlantsPerGrowingUnit: 1,
				maxPlantsPerGrowingUnit: 15,
				medianPlantsPerGrowingUnit: 8,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(OverviewViewModel);
			expect(viewModel.id).toBe("overview-complete");
			expect(viewModel.totalPlants).toBe(200);
			expect(viewModel.totalActivePlants).toBe(180);
			expect(viewModel.averagePlantsPerGrowingUnit).toBe(8);
			expect(viewModel.plantsPlanted).toBe(40);
			expect(viewModel.plantsGrowing).toBe(120);
			expect(viewModel.plantsHarvested).toBe(30);
			expect(viewModel.plantsDead).toBe(5);
			expect(viewModel.plantsArchived).toBe(5);
			expect(viewModel.plantsWithoutPlantedDate).toBe(10);
			expect(viewModel.plantsWithNotes).toBe(80);
			expect(viewModel.recentPlants).toBe(25);
			expect(viewModel.totalGrowingUnits).toBe(30);
			expect(viewModel.activeGrowingUnits).toBe(25);
			expect(viewModel.emptyGrowingUnits).toBe(5);
			expect(viewModel.growingUnitsPot).toBe(15);
			expect(viewModel.growingUnitsGardenBed).toBe(10);
			expect(viewModel.growingUnitsHangingBasket).toBe(3);
			expect(viewModel.growingUnitsWindowBox).toBe(2);
			expect(viewModel.totalCapacity).toBe(400);
			expect(viewModel.totalCapacityUsed).toBe(200);
			expect(viewModel.averageOccupancy).toBe(50.0);
			expect(viewModel.growingUnitsAtLimit).toBe(8);
			expect(viewModel.growingUnitsFull).toBe(3);
			expect(viewModel.totalRemainingCapacity).toBe(200);
			expect(viewModel.growingUnitsWithDimensions).toBe(20);
			expect(viewModel.totalVolume).toBe(6000);
			expect(viewModel.averageVolume).toBe(300);
			expect(viewModel.minPlantsPerGrowingUnit).toBe(1);
			expect(viewModel.maxPlantsPerGrowingUnit).toBe(15);
			expect(viewModel.medianPlantsPerGrowingUnit).toBe(8);
		});
	});
});
