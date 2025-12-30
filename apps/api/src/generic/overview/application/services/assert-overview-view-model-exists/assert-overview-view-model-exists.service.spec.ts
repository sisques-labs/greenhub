import { Test } from '@nestjs/testing';
import { OverviewNotFoundException } from '@/generic/overview/application/exceptions/overview-not-found/overview-not-found.exception';
import { AssertOverviewViewModelExistsService } from '@/generic/overview/application/services/assert-overview-view-model-exists/assert-overview-view-model-exists.service';
import {
  OVERVIEW_READ_REPOSITORY_TOKEN,
  IOverviewReadRepository,
} from '@/generic/overview/domain/repositories/overview-read/overview-read.repository';
import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';

describe('AssertOverviewViewModelExistsService', () => {
  let service: AssertOverviewViewModelExistsService;
  let mockOverviewReadRepository: jest.Mocked<IOverviewReadRepository>;
  let factory: OverviewViewModelFactory;

  beforeEach(async () => {
    factory = new OverviewViewModelFactory();
    mockOverviewReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IOverviewReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertOverviewViewModelExistsService,
        {
          provide: OVERVIEW_READ_REPOSITORY_TOKEN,
          useValue: mockOverviewReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertOverviewViewModelExistsService>(
      AssertOverviewViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return overview view model when found', async () => {
      const overviewId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = factory.create({
        id: overviewId,
        totalPlants: 150,
        totalActivePlants: 120,
        averagePlantsPerGrowingUnit: 6,
        plantsPlanted: 30,
        plantsGrowing: 80,
        plantsHarvested: 20,
        plantsDead: 10,
        plantsArchived: 10,
        plantsWithoutPlantedDate: 5,
        plantsWithNotes: 50,
        recentPlants: 15,
        totalGrowingUnits: 25,
        activeGrowingUnits: 20,
        emptyGrowingUnits: 5,
        growingUnitsPot: 10,
        growingUnitsGardenBed: 8,
        growingUnitsHangingBasket: 4,
        growingUnitsWindowBox: 3,
        totalCapacity: 300,
        totalCapacityUsed: 150,
        averageOccupancy: 50.0,
        growingUnitsAtLimit: 5,
        growingUnitsFull: 2,
        totalRemainingCapacity: 150,
        growingUnitsWithDimensions: 15,
        totalVolume: 5000,
        averageVolume: 333.33,
        minPlantsPerGrowingUnit: 0,
        maxPlantsPerGrowingUnit: 12,
        medianPlantsPerGrowingUnit: 6,
        createdAt: now,
        updatedAt: now,
      });

      mockOverviewReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(overviewId);

      expect(result).toBe(mockViewModel);
      expect(mockOverviewReadRepository.findById).toHaveBeenCalledWith(
        overviewId,
      );
      expect(mockOverviewReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw OverviewNotFoundException when overview does not exist', async () => {
      const overviewId = '123e4567-e89b-12d3-a456-426614174000';

      mockOverviewReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(overviewId)).rejects.toThrow(
        OverviewNotFoundException,
      );
      expect(mockOverviewReadRepository.findById).toHaveBeenCalledWith(
        overviewId,
      );
    });

    it('should throw exception with correct message', async () => {
      const overviewId = '123e4567-e89b-12d3-a456-426614174000';

      mockOverviewReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(overviewId)).rejects.toThrow(
        `Overview with id ${overviewId} not found`,
      );
    });
  });
});
