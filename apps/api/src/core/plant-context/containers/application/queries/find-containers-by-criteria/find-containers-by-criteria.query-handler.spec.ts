import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import {
  CONTAINER_READ_REPOSITORY_TOKEN,
  ContainerReadRepository,
} from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { Test } from '@nestjs/testing';
import { FindContainersByCriteriaQuery } from './find-containers-by-criteria.query';
import { FindContainersByCriteriaQueryHandler } from './find-containers-by-criteria.query-handler';

describe('FindContainersByCriteriaQueryHandler', () => {
  let handler: FindContainersByCriteriaQueryHandler;
  let mockContainerReadRepository: jest.Mocked<ContainerReadRepository>;

  beforeEach(async () => {
    mockContainerReadRepository = {
      findById: jest.fn(),
      findByCriteria: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ContainerReadRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindContainersByCriteriaQueryHandler,
        {
          provide: CONTAINER_READ_REPOSITORY_TOKEN,
          useValue: mockContainerReadRepository,
        },
      ],
    }).compile();

    handler = module.get<FindContainersByCriteriaQueryHandler>(
      FindContainersByCriteriaQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return paginated result when containers are found', async () => {
      const criteria = new Criteria();
      const query = new FindContainersByCriteriaQuery(criteria);
      const now = new Date();
      const mockViewModel = new ContainerViewModel({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 0,
        createdAt: now,
        updatedAt: now,
      });

      const mockPaginatedResult: PaginatedResult<ContainerViewModel> = {
        items: [mockViewModel],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockContainerReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockContainerReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
      expect(mockContainerReadRepository.findByCriteria).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty paginated result when no containers are found', async () => {
      const criteria = new Criteria();
      const query = new FindContainersByCriteriaQuery(criteria);

      const mockPaginatedResult: PaginatedResult<ContainerViewModel> = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockContainerReadRepository.findByCriteria.mockResolvedValue(
        mockPaginatedResult,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockPaginatedResult);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(mockContainerReadRepository.findByCriteria).toHaveBeenCalledWith(
        criteria,
      );
    });
  });
});
