import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Test } from '@nestjs/testing';
import { FindPlantsByCriteriaQuery } from './find-plants-by-criteria.query';
import { FindPlantsByCriteriaQueryHandler } from './find-plants-by-criteria.query-handler';

describe('FindPlantsByCriteriaQueryHandler', () => {
  let handler: FindPlantsByCriteriaQueryHandler;
  let mockPlantReadRepository: jest.Mocked<PlantReadRepository>;

  beforeEach(async () => {
    mockPlantReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlantReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindPlantsByCriteriaQueryHandler,
        {
          provide: PLANT_READ_REPOSITORY_TOKEN,
          useValue: mockPlantReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindPlantsByCriteriaQueryHandler>(
      FindPlantsByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result when plants are found', async () => {
      const criteria = new Criteria();
      const query = new FindPlantsByCriteriaQuery(criteria);
      const now = new Date();
      const mockViewModel = new PlantViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      const mockPaginatedResult: PaginatedResult<PlantViewModel> = {
        items: [mockViewModel],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockPlantReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockPlantReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockPlantReadRepository.findByCriteria).toHaveBeenCalledTimes(1);
    });

    it('should return empty paginated result when no plants are found', async () => {
      const criteria = new Criteria();
      const query = new FindPlantsByCriteriaQuery(criteria);

      const mockPaginatedResult: PaginatedResult<PlantViewModel> = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockPlantReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockPlantReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });
  });
});
