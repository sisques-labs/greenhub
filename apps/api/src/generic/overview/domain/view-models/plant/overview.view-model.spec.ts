import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';

describe('OverviewViewModel', () => {
	let viewModelDto: IOverviewViewModelDto;

	beforeEach(() => {
		viewModelDto = {
			id: 'overview-1',
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
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15'),
		};
	});

	describe('constructor', () => {
		it('should create a view model with all properties', () => {
			const viewModel = new OverviewViewModel(viewModelDto);

			expect(viewModel.id).toBe(viewModelDto.id);
			expect(viewModel.totalPlants).toBe(viewModelDto.totalPlants);
			expect(viewModel.totalActivePlants).toBe(viewModelDto.totalActivePlants);
			expect(viewModel.averagePlantsPerGrowingUnit).toBe(
				viewModelDto.averagePlantsPerGrowingUnit,
			);
			expect(viewModel.plantsPlanted).toBe(viewModelDto.plantsPlanted);
			expect(viewModel.plantsGrowing).toBe(viewModelDto.plantsGrowing);
			expect(viewModel.plantsHarvested).toBe(viewModelDto.plantsHarvested);
			expect(viewModel.plantsDead).toBe(viewModelDto.plantsDead);
			expect(viewModel.plantsArchived).toBe(viewModelDto.plantsArchived);
			expect(viewModel.plantsWithoutPlantedDate).toBe(
				viewModelDto.plantsWithoutPlantedDate,
			);
			expect(viewModel.plantsWithNotes).toBe(viewModelDto.plantsWithNotes);
			expect(viewModel.recentPlants).toBe(viewModelDto.recentPlants);
			expect(viewModel.totalGrowingUnits).toBe(viewModelDto.totalGrowingUnits);
			expect(viewModel.activeGrowingUnits).toBe(
				viewModelDto.activeGrowingUnits,
			);
			expect(viewModel.emptyGrowingUnits).toBe(viewModelDto.emptyGrowingUnits);
			expect(viewModel.growingUnitsPot).toBe(viewModelDto.growingUnitsPot);
			expect(viewModel.growingUnitsGardenBed).toBe(
				viewModelDto.growingUnitsGardenBed,
			);
			expect(viewModel.growingUnitsHangingBasket).toBe(
				viewModelDto.growingUnitsHangingBasket,
			);
			expect(viewModel.growingUnitsWindowBox).toBe(
				viewModelDto.growingUnitsWindowBox,
			);
			expect(viewModel.totalCapacity).toBe(viewModelDto.totalCapacity);
			expect(viewModel.totalCapacityUsed).toBe(viewModelDto.totalCapacityUsed);
			expect(viewModel.averageOccupancy).toBe(viewModelDto.averageOccupancy);
			expect(viewModel.growingUnitsAtLimit).toBe(
				viewModelDto.growingUnitsAtLimit,
			);
			expect(viewModel.growingUnitsFull).toBe(viewModelDto.growingUnitsFull);
			expect(viewModel.totalRemainingCapacity).toBe(
				viewModelDto.totalRemainingCapacity,
			);
			expect(viewModel.growingUnitsWithDimensions).toBe(
				viewModelDto.growingUnitsWithDimensions,
			);
			expect(viewModel.totalVolume).toBe(viewModelDto.totalVolume);
			expect(viewModel.averageVolume).toBe(viewModelDto.averageVolume);
			expect(viewModel.minPlantsPerGrowingUnit).toBe(
				viewModelDto.minPlantsPerGrowingUnit,
			);
			expect(viewModel.maxPlantsPerGrowingUnit).toBe(
				viewModelDto.maxPlantsPerGrowingUnit,
			);
			expect(viewModel.medianPlantsPerGrowingUnit).toBe(
				viewModelDto.medianPlantsPerGrowingUnit,
			);
		});

		it('should create a view model with zero values', () => {
			const dtoWithZeros: IOverviewViewModelDto = {
				id: 'overview-empty',
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

			const viewModel = new OverviewViewModel(dtoWithZeros);

			expect(viewModel.totalPlants).toBe(0);
			expect(viewModel.totalGrowingUnits).toBe(0);
			expect(viewModel.totalCapacity).toBe(0);
		});
	});

	describe('getters', () => {
		let viewModel: OverviewViewModel;

		beforeEach(() => {
			viewModel = new OverviewViewModel(viewModelDto);
		});

		describe('plants metrics getters', () => {
			it('should return correct totalPlants', () => {
				expect(viewModel.totalPlants).toBe(150);
			});

			it('should return correct totalActivePlants', () => {
				expect(viewModel.totalActivePlants).toBe(120);
			});

			it('should return correct averagePlantsPerGrowingUnit', () => {
				expect(viewModel.averagePlantsPerGrowingUnit).toBe(6);
			});
		});

		describe('plants by status getters', () => {
			it('should return correct plantsPlanted', () => {
				expect(viewModel.plantsPlanted).toBe(30);
			});

			it('should return correct plantsGrowing', () => {
				expect(viewModel.plantsGrowing).toBe(80);
			});

			it('should return correct plantsHarvested', () => {
				expect(viewModel.plantsHarvested).toBe(20);
			});

			it('should return correct plantsDead', () => {
				expect(viewModel.plantsDead).toBe(10);
			});

			it('should return correct plantsArchived', () => {
				expect(viewModel.plantsArchived).toBe(10);
			});
		});

		describe('additional plant metrics getters', () => {
			it('should return correct plantsWithoutPlantedDate', () => {
				expect(viewModel.plantsWithoutPlantedDate).toBe(5);
			});

			it('should return correct plantsWithNotes', () => {
				expect(viewModel.plantsWithNotes).toBe(50);
			});

			it('should return correct recentPlants', () => {
				expect(viewModel.recentPlants).toBe(15);
			});
		});

		describe('growing units metrics getters', () => {
			it('should return correct totalGrowingUnits', () => {
				expect(viewModel.totalGrowingUnits).toBe(25);
			});

			it('should return correct activeGrowingUnits', () => {
				expect(viewModel.activeGrowingUnits).toBe(20);
			});

			it('should return correct emptyGrowingUnits', () => {
				expect(viewModel.emptyGrowingUnits).toBe(5);
			});
		});

		describe('growing units by type getters', () => {
			it('should return correct growingUnitsPot', () => {
				expect(viewModel.growingUnitsPot).toBe(10);
			});

			it('should return correct growingUnitsGardenBed', () => {
				expect(viewModel.growingUnitsGardenBed).toBe(8);
			});

			it('should return correct growingUnitsHangingBasket', () => {
				expect(viewModel.growingUnitsHangingBasket).toBe(4);
			});

			it('should return correct growingUnitsWindowBox', () => {
				expect(viewModel.growingUnitsWindowBox).toBe(3);
			});
		});

		describe('capacity metrics getters', () => {
			it('should return correct totalCapacity', () => {
				expect(viewModel.totalCapacity).toBe(300);
			});

			it('should return correct totalCapacityUsed', () => {
				expect(viewModel.totalCapacityUsed).toBe(150);
			});

			it('should return correct averageOccupancy', () => {
				expect(viewModel.averageOccupancy).toBe(50.0);
			});

			it('should return correct growingUnitsAtLimit', () => {
				expect(viewModel.growingUnitsAtLimit).toBe(5);
			});

			it('should return correct growingUnitsFull', () => {
				expect(viewModel.growingUnitsFull).toBe(2);
			});

			it('should return correct totalRemainingCapacity', () => {
				expect(viewModel.totalRemainingCapacity).toBe(150);
			});
		});

		describe('dimensions metrics getters', () => {
			it('should return correct growingUnitsWithDimensions', () => {
				expect(viewModel.growingUnitsWithDimensions).toBe(15);
			});

			it('should return correct totalVolume', () => {
				expect(viewModel.totalVolume).toBe(5000);
			});

			it('should return correct averageVolume', () => {
				expect(viewModel.averageVolume).toBe(333.33);
			});
		});

		describe('aggregated metrics getters', () => {
			it('should return correct minPlantsPerGrowingUnit', () => {
				expect(viewModel.minPlantsPerGrowingUnit).toBe(0);
			});

			it('should return correct maxPlantsPerGrowingUnit', () => {
				expect(viewModel.maxPlantsPerGrowingUnit).toBe(12);
			});

			it('should return correct medianPlantsPerGrowingUnit', () => {
				expect(viewModel.medianPlantsPerGrowingUnit).toBe(6);
			});
		});
	});

	describe('update', () => {
		it('should update view model properties', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				totalPlants: 200,
				totalGrowingUnits: 30,
				averagePlantsPerGrowingUnit: 6.67,
			};

			viewModel.update(updateData);

			expect(viewModel.totalPlants).toBe(200);
			expect(viewModel.totalGrowingUnits).toBe(30);
			expect(viewModel.averagePlantsPerGrowingUnit).toBe(6.67);
		});

		it('should update all plants metrics', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				totalPlants: 200,
				totalActivePlants: 150,
				averagePlantsPerGrowingUnit: 7,
				plantsPlanted: 40,
				plantsGrowing: 100,
				plantsHarvested: 30,
				plantsDead: 15,
				plantsArchived: 15,
			};

			viewModel.update(updateData);

			expect(viewModel.totalPlants).toBe(200);
			expect(viewModel.totalActivePlants).toBe(150);
			expect(viewModel.averagePlantsPerGrowingUnit).toBe(7);
			expect(viewModel.plantsPlanted).toBe(40);
			expect(viewModel.plantsGrowing).toBe(100);
			expect(viewModel.plantsHarvested).toBe(30);
			expect(viewModel.plantsDead).toBe(15);
			expect(viewModel.plantsArchived).toBe(15);
		});

		it('should update all growing units metrics', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				totalGrowingUnits: 30,
				activeGrowingUnits: 25,
				emptyGrowingUnits: 5,
				growingUnitsPot: 15,
				growingUnitsGardenBed: 10,
				growingUnitsHangingBasket: 3,
				growingUnitsWindowBox: 2,
			};

			viewModel.update(updateData);

			expect(viewModel.totalGrowingUnits).toBe(30);
			expect(viewModel.activeGrowingUnits).toBe(25);
			expect(viewModel.emptyGrowingUnits).toBe(5);
			expect(viewModel.growingUnitsPot).toBe(15);
			expect(viewModel.growingUnitsGardenBed).toBe(10);
			expect(viewModel.growingUnitsHangingBasket).toBe(3);
			expect(viewModel.growingUnitsWindowBox).toBe(2);
		});

		it('should update all capacity metrics', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				totalCapacity: 400,
				totalCapacityUsed: 200,
				averageOccupancy: 50.0,
				growingUnitsAtLimit: 8,
				growingUnitsFull: 3,
				totalRemainingCapacity: 200,
			};

			viewModel.update(updateData);

			expect(viewModel.totalCapacity).toBe(400);
			expect(viewModel.totalCapacityUsed).toBe(200);
			expect(viewModel.averageOccupancy).toBe(50.0);
			expect(viewModel.growingUnitsAtLimit).toBe(8);
			expect(viewModel.growingUnitsFull).toBe(3);
			expect(viewModel.totalRemainingCapacity).toBe(200);
		});

		it('should update all dimensions metrics', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				growingUnitsWithDimensions: 20,
				totalVolume: 6000,
				averageVolume: 300,
			};

			viewModel.update(updateData);

			expect(viewModel.growingUnitsWithDimensions).toBe(20);
			expect(viewModel.totalVolume).toBe(6000);
			expect(viewModel.averageVolume).toBe(300);
		});

		it('should update all aggregated metrics', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				minPlantsPerGrowingUnit: 1,
				maxPlantsPerGrowingUnit: 15,
				medianPlantsPerGrowingUnit: 7,
			};

			viewModel.update(updateData);

			expect(viewModel.minPlantsPerGrowingUnit).toBe(1);
			expect(viewModel.maxPlantsPerGrowingUnit).toBe(15);
			expect(viewModel.medianPlantsPerGrowingUnit).toBe(7);
		});

		it('should update updatedAt timestamp', () => {
			const viewModel = new OverviewViewModel(viewModelDto);
			const beforeUpdate = viewModel.updatedAt;
			const updateData: IOverviewViewModelDto = {
				...viewModelDto,
				totalPlants: 200,
			};

			// Wait a bit to ensure timestamp difference
			setTimeout(() => {
				viewModel.update(updateData);
				expect(viewModel.updatedAt.getTime()).toBeGreaterThan(
					beforeUpdate.getTime(),
				);
			}, 10);
		});
	});
});
