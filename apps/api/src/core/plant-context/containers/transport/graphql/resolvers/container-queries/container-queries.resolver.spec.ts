import { ContainerViewModelFindByIdQuery } from '@/core/plant-context/containers/application/queries/container-view-model-find-by-id/container-view-model-find-by-id.query';
import { FindContainersByCriteriaQuery } from '@/core/plant-context/containers/application/queries/find-containers-by-criteria/find-containers-by-criteria.query';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerFindByCriteriaRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/container-find-by-criteria.request.dto';
import { ContainerFindByIdRequestDto } from '@/core/plant-context/containers/transport/graphql/dtos/requests/container-find-by-id.request.dto';
import {
  ContainerResponseDto,
  PaginatedContainerResultDto,
} from '@/core/plant-context/containers/transport/graphql/dtos/responses/container.response.dto';
import { ContainerGraphQLMapper } from '@/core/plant-context/containers/transport/graphql/mappers/container.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';
import { ContainerQueriesResolver } from './container-queries.resolver';

describe('ContainerQueriesResolver', () => {
  let resolver: ContainerQueriesResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockContainerGraphQLMapper: jest.Mocked<ContainerGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockContainerGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<ContainerGraphQLMapper>;

    resolver = new ContainerQueriesResolver(
      mockQueryBus,
      mockContainerGraphQLMapper,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('containersFindByCriteria', () => {
    it('should return paginated containers when criteria matches', async () => {
      const input: ContainerFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: ContainerViewModel[] = [
        new ContainerViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          plants: [],
          numberOfPlants: 5,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedContainerResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Garden Bed 1',
            type: ContainerTypeEnum.GARDEN_BED,
            plants: [],
            numberOfPlants: 5,
            createdAt,
            updatedAt,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockContainerGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.containersFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindContainersByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindContainersByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockContainerGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return empty paginated result when no containers match criteria', async () => {
      const input: ContainerFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const paginatedResult = new PaginatedResult<ContainerViewModel>(
        [],
        0,
        1,
        10,
      );
      const paginatedResponseDto: PaginatedContainerResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockContainerGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.containersFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle null input', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: ContainerViewModel[] = [
        new ContainerViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Garden Bed 1',
          type: ContainerTypeEnum.GARDEN_BED,
          plants: [],
          numberOfPlants: 0,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedContainerResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Garden Bed 1',
            type: ContainerTypeEnum.GARDEN_BED,
            plants: [],
            numberOfPlants: 0,
            createdAt,
            updatedAt,
          },
        ],
        total: 1,
        page: 1,
        perPage: 10,
        totalPages: 1,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockContainerGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.containersFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindContainersByCriteriaQuery),
      );
    });

    it('should handle errors from query bus', async () => {
      const input: ContainerFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Database connection error');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.containersFindByCriteria(input)).rejects.toThrow(
        error,
      );
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindContainersByCriteriaQuery),
      );
      expect(
        mockContainerGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('containerFindById', () => {
    it('should return container when container exists', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: ContainerFindByIdRequestDto = {
        id: containerId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      });

      const responseDto: ContainerResponseDto = {
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [],
        numberOfPlants: 5,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockContainerGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.containerFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerViewModelFindByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(ContainerViewModelFindByIdQuery);
      expect(query.id.value).toBe(containerId);
      expect(mockContainerGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should return container with empty plants array', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: ContainerFindByIdRequestDto = {
        id: containerId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new ContainerViewModel({
        id: containerId,
        name: 'Empty Container',
        type: ContainerTypeEnum.POT,
        plants: [],
        numberOfPlants: 0,
        createdAt,
        updatedAt,
      });

      const responseDto: ContainerResponseDto = {
        id: containerId,
        name: 'Empty Container',
        type: ContainerTypeEnum.POT,
        plants: [],
        numberOfPlants: 0,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockContainerGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.containerFindById(input);

      expect(result).toBe(responseDto);
      expect(result.plants).toHaveLength(0);
      expect(result.numberOfPlants).toBe(0);
    });

    it('should return null when container does not exist', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: ContainerFindByIdRequestDto = {
        id: containerId,
      };

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await resolver.containerFindById(input);

      expect(result).toBeNull();
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerViewModelFindByIdQuery),
      );
      expect(mockContainerGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });

    it('should handle errors from query bus', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const input: ContainerFindByIdRequestDto = {
        id: containerId,
      };

      const error = new Error('Container not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.containerFindById(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(ContainerViewModelFindByIdQuery),
      );
      expect(mockContainerGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });
});
