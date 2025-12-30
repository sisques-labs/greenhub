import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { OverviewCalculateAggregatedMetricsService } from '@/generic/overview/application/services/overview-calculate-aggregated-metrics/overview-calculate-aggregated-metrics.service';
import { OverviewCalculateCapacityMetricsService } from '@/generic/overview/application/services/overview-calculate-capacity-metrics/overview-calculate-capacity-metrics.service';
import { OverviewCalculateDimensionsMetricsService } from '@/generic/overview/application/services/overview-calculate-dimensions-metrics/overview-calculate-dimensions-metrics.service';
import { OverviewCalculateGrowingUnitMetricsService } from '@/generic/overview/application/services/overview-calculate-growing-unit-metrics/overview-calculate-growing-unit-metrics.service';
import { OverviewCalculatePlantMetricsService } from '@/generic/overview/application/services/overview-calculate-plant-metrics/overview-calculate-plant-metrics.service';
import { OverviewCalculateService } from '@/generic/overview/application/services/overview-calculate/overview-calculate.service';
import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('OverviewCalculateService', () => {
  let service: OverviewCalculateService;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockCalculatePlantMetricsService: jest.Mocked<OverviewCalculatePlantMetricsService>;
  let mockCalculateGrowingUnitMetricsService: jest.Mocked<OverviewCalculateGrowingUnitMetricsService>;
  let mockCalculateCapacityMetricsService: jest.Mocked<OverviewCalculateCapacityMetricsService>;
  let mockCalculateDimensionsMetricsService: jest.Mocked<OverviewCalculateDimensionsMetricsService>;
  let mockCalculateAggregatedMetricsService: jest.Mocked<OverviewCalculateAggregatedMetricsService>;
  let factory: OverviewViewModelFactory;

  beforeEach(async () => {
    factory = new OverviewViewModelFactory();
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockCalculatePlantMetricsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<OverviewCalculatePlantMetricsService>;

    mockCalculateGrowingUnitMetricsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<OverviewCalculateGrowingUnitMetricsService>;

    mockCalculateCapacityMetricsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<OverviewCalculateCapacityMetricsService>;

    mockCalculateDimensionsMetricsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<OverviewCalculateDimensionsMetricsService>;

    mockCalculateAggregatedMetricsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<OverviewCalculateAggregatedMetricsService>;

    const module = await Test.createTestingModule({
      providers: [
        OverviewCalculateService,
        OverviewViewModelFactory,
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
        {
          provide: OverviewCalculatePlantMetricsService,
          useValue: mockCalculatePlantMetricsService,
        },
        {
          provide: OverviewCalculateGrowingUnitMetricsService,
          useValue: mockCalculateGrowingUnitMetricsService,
        },
        {
          provide: OverviewCalculateCapacityMetricsService,
          useValue: mockCalculateCapacityMetricsService,
        },
        {
          provide: OverviewCalculateDimensionsMetricsService,
          useValue: mockCalculateDimensionsMetricsService,
        },
        {
          provide: OverviewCalculateAggregatedMetricsService,
          useValue: mockCalculateAggregatedMetricsService,
        },
      ],
    }).compile();

    service = module.get<OverviewCalculateService>(OverviewCalculateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should calculate overview metrics correctly', async () => {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Create mock plants
      const plant1 = new PlantViewModel({
        id: 'plant-1',
        growingUnitId: 'gu-1',
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: new Date(),
        notes: 'Test notes',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      const plant2 = new PlantViewModel({
        id: 'plant-2',
        growingUnitId: 'gu-1',
        name: 'Tomato',
        species: 'Solanum lycopersicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt: sevenDaysAgo,
        updatedAt: sevenDaysAgo,
      });

      const plant3 = new PlantViewModel({
        id: 'plant-3',
        growingUnitId: 'gu-2',
        name: 'Lettuce',
        species: 'Lactuca sativa',
        plantedDate: new Date(),
        notes: null,
        status: PlantStatusEnum.HARVESTED,
        createdAt: now,
        updatedAt: now,
      });

      // Create mock growing units
      const growingUnit1 = new GrowingUnitViewModel({
        id: 'gu-1',
        name: 'Garden Bed 1',
        type: GrowingUnitTypeEnum.GARDEN_BED,
        capacity: 10,
        dimensions: {
          length: 100,
          width: 50,
          height: 30,
          unit: LengthUnitEnum.CENTIMETER,
        },
        plants: [plant1, plant2],
        numberOfPlants: 2,
        remainingCapacity: 8,
        volume: 150000, // 100 * 50 * 30
        createdAt: now,
        updatedAt: now,
      });

      const growingUnit2 = new GrowingUnitViewModel({
        id: 'gu-2',
        name: 'Pot 1',
        type: GrowingUnitTypeEnum.POT,
        capacity: 5,
        dimensions: null,
        plants: [plant3],
        numberOfPlants: 1,
        remainingCapacity: 4,
        volume: 0,
        createdAt: now,
        updatedAt: now,
      });

      const growingUnit3 = new GrowingUnitViewModel({
        id: 'gu-3',
        name: 'Empty Pot',
        type: GrowingUnitTypeEnum.POT,
        capacity: 3,
        dimensions: null,
        plants: [],
        numberOfPlants: 0,
        remainingCapacity: 3,
        volume: 0,
        createdAt: now,
        updatedAt: now,
      });

      const mockPaginatedResult = new PaginatedResult<GrowingUnitViewModel>(
        [growingUnit1, growingUnit2, growingUnit3],
        3,
        1,
        500,
      );

      mockQueryBus.execute.mockResolvedValue(mockPaginatedResult);

      // Mock calculation services
      mockCalculatePlantMetricsService.execute.mockResolvedValue({
        totalPlants: 3,
        totalActivePlants: 3,
        plantsPlanted: 1,
        plantsGrowing: 1,
        plantsHarvested: 1,
        plantsDead: 0,
        plantsArchived: 0,
        plantsWithoutPlantedDate: 1,
        plantsWithNotes: 1,
        recentPlants: 2,
      });

      mockCalculateGrowingUnitMetricsService.execute.mockResolvedValue({
        totalGrowingUnits: 3,
        activeGrowingUnits: 2,
        emptyGrowingUnits: 1,
        growingUnitsPot: 2,
        growingUnitsGardenBed: 1,
        growingUnitsHangingBasket: 0,
        growingUnitsWindowBox: 0,
      });

      mockCalculateCapacityMetricsService.execute.mockResolvedValue({
        totalCapacity: 18,
        totalCapacityUsed: 3,
        averageOccupancy: 16.67,
        growingUnitsAtLimit: 0,
        growingUnitsFull: 0,
        totalRemainingCapacity: 15,
      });

      mockCalculateDimensionsMetricsService.execute.mockResolvedValue({
        growingUnitsWithDimensions: 1,
        totalVolume: 150000,
        averageVolume: 150000,
      });

      mockCalculateAggregatedMetricsService.execute.mockResolvedValue({
        averagePlantsPerGrowingUnit: 1.0,
        minPlantsPerGrowingUnit: 0,
        maxPlantsPerGrowingUnit: 2,
        medianPlantsPerGrowingUnit: 1.0,
      });

      const result = await service.execute();

      expect(result).toBeInstanceOf(OverviewViewModel);
      expect(result.totalPlants).toBe(3);
      expect(result.totalGrowingUnits).toBe(3);
      expect(result.plantsPlanted).toBe(1);
      expect(result.plantsGrowing).toBe(1);
      expect(result.plantsHarvested).toBe(1);
      expect(mockQueryBus.execute).toHaveBeenCalled();
      expect(mockCalculatePlantMetricsService.execute).toHaveBeenCalled();
      expect(mockCalculateGrowingUnitMetricsService.execute).toHaveBeenCalled();
      expect(mockCalculateCapacityMetricsService.execute).toHaveBeenCalled();
      expect(mockCalculateDimensionsMetricsService.execute).toHaveBeenCalled();
      expect(mockCalculateAggregatedMetricsService.execute).toHaveBeenCalled();
    });

    it('should handle empty data correctly', async () => {
      const mockPaginatedResult = new PaginatedResult<GrowingUnitViewModel>(
        [],
        0,
        1,
        500,
      );

      mockQueryBus.execute.mockResolvedValue(mockPaginatedResult);

      mockCalculatePlantMetricsService.execute.mockResolvedValue({
        totalPlants: 0,
        totalActivePlants: 0,
        plantsPlanted: 0,
        plantsGrowing: 0,
        plantsHarvested: 0,
        plantsDead: 0,
        plantsArchived: 0,
        plantsWithoutPlantedDate: 0,
        plantsWithNotes: 0,
        recentPlants: 0,
      });

      mockCalculateGrowingUnitMetricsService.execute.mockResolvedValue({
        totalGrowingUnits: 0,
        activeGrowingUnits: 0,
        emptyGrowingUnits: 0,
        growingUnitsPot: 0,
        growingUnitsGardenBed: 0,
        growingUnitsHangingBasket: 0,
        growingUnitsWindowBox: 0,
      });

      mockCalculateCapacityMetricsService.execute.mockResolvedValue({
        totalCapacity: 0,
        totalCapacityUsed: 0,
        averageOccupancy: 0,
        growingUnitsAtLimit: 0,
        growingUnitsFull: 0,
        totalRemainingCapacity: 0,
      });

      mockCalculateDimensionsMetricsService.execute.mockResolvedValue({
        growingUnitsWithDimensions: 0,
        totalVolume: 0,
        averageVolume: 0,
      });

      mockCalculateAggregatedMetricsService.execute.mockResolvedValue({
        averagePlantsPerGrowingUnit: 0,
        minPlantsPerGrowingUnit: 0,
        maxPlantsPerGrowingUnit: 0,
        medianPlantsPerGrowingUnit: 0,
      });

      const result = await service.execute();

      expect(result.totalPlants).toBe(0);
      expect(result.totalGrowingUnits).toBe(0);
      expect(result.totalCapacity).toBe(0);
    });

    it('should fetch multiple pages in batches', async () => {
      const now = new Date();
      const growingUnitsPage1: GrowingUnitViewModel[] = Array.from(
        { length: 500 },
        (_, i) =>
          new GrowingUnitViewModel({
            id: `gu-${i + 1}`,
            name: `Growing Unit ${i + 1}`,
            type: GrowingUnitTypeEnum.POT,
            capacity: 10,
            dimensions: null,
            plants: [],
            numberOfPlants: 0,
            remainingCapacity: 10,
            volume: 0,
            createdAt: now,
            updatedAt: now,
          }),
      );

      const growingUnitsPage2: GrowingUnitViewModel[] = Array.from(
        { length: 200 },
        (_, i) =>
          new GrowingUnitViewModel({
            id: `gu-${i + 501}`,
            name: `Growing Unit ${i + 501}`,
            type: GrowingUnitTypeEnum.POT,
            capacity: 10,
            dimensions: null,
            plants: [],
            numberOfPlants: 0,
            remainingCapacity: 10,
            volume: 0,
            createdAt: now,
            updatedAt: now,
          }),
      );

      const mockPaginatedResultPage1 =
        new PaginatedResult<GrowingUnitViewModel>(
          growingUnitsPage1,
          700,
          1,
          500,
        );

      const mockPaginatedResultPage2 =
        new PaginatedResult<GrowingUnitViewModel>(
          growingUnitsPage2,
          700,
          2,
          500,
        );

      mockQueryBus.execute
        .mockResolvedValueOnce(mockPaginatedResultPage1)
        .mockResolvedValueOnce(mockPaginatedResultPage2);

      mockCalculatePlantMetricsService.execute.mockResolvedValue({
        totalPlants: 0,
        totalActivePlants: 0,
        plantsPlanted: 0,
        plantsGrowing: 0,
        plantsHarvested: 0,
        plantsDead: 0,
        plantsArchived: 0,
        plantsWithoutPlantedDate: 0,
        plantsWithNotes: 0,
        recentPlants: 0,
      });

      mockCalculateGrowingUnitMetricsService.execute.mockResolvedValue({
        totalGrowingUnits: 700,
        activeGrowingUnits: 0,
        emptyGrowingUnits: 700,
        growingUnitsPot: 700,
        growingUnitsGardenBed: 0,
        growingUnitsHangingBasket: 0,
        growingUnitsWindowBox: 0,
      });

      mockCalculateCapacityMetricsService.execute.mockResolvedValue({
        totalCapacity: 7000,
        totalCapacityUsed: 0,
        averageOccupancy: 0,
        growingUnitsAtLimit: 0,
        growingUnitsFull: 0,
        totalRemainingCapacity: 7000,
      });

      mockCalculateDimensionsMetricsService.execute.mockResolvedValue({
        growingUnitsWithDimensions: 0,
        totalVolume: 0,
        averageVolume: 0,
      });

      mockCalculateAggregatedMetricsService.execute.mockResolvedValue({
        averagePlantsPerGrowingUnit: 0,
        minPlantsPerGrowingUnit: 0,
        maxPlantsPerGrowingUnit: 0,
        medianPlantsPerGrowingUnit: 0,
      });

      const result = await service.execute();

      expect(result.totalGrowingUnits).toBe(700);
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(2);
      expect(mockQueryBus.execute).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          criteria: expect.objectContaining({
            pagination: { page: 1, perPage: 500 },
          }),
        }),
      );
      expect(mockQueryBus.execute).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          criteria: expect.objectContaining({
            pagination: { page: 2, perPage: 500 },
          }),
        }),
      );
    });
  });
});
