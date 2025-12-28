import { FindPlantsByCriteriaQuery } from '@/core/plant-context/plants/application/queries/find-plants-by-criteria/find-plants-by-criteria.query';
import { PlantViewModelFindByIdQuery } from '@/core/plant-context/plants/application/queries/plant-view-model-find-by-id/plant-view-model-find-by-id.query';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantFindByCriteriaRequestDto } from '@/core/plant-context/plants/transport/graphql/dtos/requests/plant-find-by-criteria.request.dto';
import { PlantFindByIdRequestDto } from '@/core/plant-context/plants/transport/graphql/dtos/requests/plant-find-by-id.request.dto';
import {
  PaginatedPlantResultDto,
  PlantResponseDto,
} from '@/core/plant-context/plants/transport/graphql/dtos/responses/plant.response.dto';
import { PlantGraphQLMapper } from '@/core/plant-context/plants/transport/graphql/mappers/plant.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { QueryBus } from '@nestjs/cqrs';
import { PlantQueriesResolver } from './plant-queries.resolver';

describe('PlantQueriesResolver', () => {
  let resolver: PlantQueriesResolver;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockPlantGraphQLMapper: jest.Mocked<PlantGraphQLMapper>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    mockPlantGraphQLMapper = {
      toResponseDto: jest.fn(),
      toPaginatedResponseDto: jest.fn(),
    } as unknown as jest.Mocked<PlantGraphQLMapper>;

    resolver = new PlantQueriesResolver(mockQueryBus, mockPlantGraphQLMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('plantsFindByCriteria', () => {
    it('should return paginated plants when criteria matches', async () => {
      const input: PlantFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');
      const viewModels: PlantViewModel[] = [
        new PlantViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: plantedDate,
          notes: 'Keep in indirect sunlight',
          status: PlantStatusEnum.PLANTED,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedPlantResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            containerId: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Aloe Vera',
            species: 'Aloe barbadensis',
            plantedDate: plantedDate,
            notes: 'Keep in indirect sunlight',
            status: PlantStatusEnum.PLANTED,
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
      mockPlantGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.plantsFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPlantsByCriteriaQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(FindPlantsByCriteriaQuery);
      expect(query.criteria).toBeInstanceOf(Criteria);
      expect(
        mockPlantGraphQLMapper.toPaginatedResponseDto,
      ).toHaveBeenCalledWith(paginatedResult);
    });

    it('should return empty paginated result when no plants match criteria', async () => {
      const input: PlantFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const paginatedResult = new PaginatedResult<PlantViewModel>([], 0, 1, 10);
      const paginatedResponseDto: PaginatedPlantResultDto = {
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      };

      mockQueryBus.execute.mockResolvedValue(paginatedResult);
      mockPlantGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.plantsFindByCriteria(input);

      expect(result).toBe(paginatedResponseDto);
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle null input', async () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModels: PlantViewModel[] = [
        new PlantViewModel({
          id: '123e4567-e89b-12d3-a456-426614174000',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: null,
          notes: null,
          status: PlantStatusEnum.PLANTED,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 1, 1, 10);
      const paginatedResponseDto: PaginatedPlantResultDto = {
        items: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            containerId: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Aloe Vera',
            species: 'Aloe barbadensis',
            plantedDate: null,
            notes: null,
            status: PlantStatusEnum.PLANTED,
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
      mockPlantGraphQLMapper.toPaginatedResponseDto.mockReturnValue(
        paginatedResponseDto,
      );

      const result = await resolver.plantsFindByCriteria(undefined);

      expect(result).toBe(paginatedResponseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPlantsByCriteriaQuery),
      );
    });

    it('should handle errors from query bus', async () => {
      const input: PlantFindByCriteriaRequestDto = {
        filters: [],
        sorts: [],
        pagination: { page: 1, perPage: 10 },
      };

      const error = new Error('Database connection error');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.plantsFindByCriteria(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPlantsByCriteriaQuery),
      );
      expect(
        mockPlantGraphQLMapper.toPaginatedResponseDto,
      ).not.toHaveBeenCalled();
    });
  });

  describe('plantFindById', () => {
    it('should return plant when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PlantFindByIdRequestDto = {
        id: plantId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');
      const viewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });

      const responseDto: PlantResponseDto = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockPlantGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.plantFindById(input);

      expect(result).toBe(responseDto);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(PlantViewModelFindByIdQuery),
      );
      const query = (mockQueryBus.execute as jest.Mock).mock.calls[0][0];
      expect(query).toBeInstanceOf(PlantViewModelFindByIdQuery);
      expect(query.id.value).toBe(plantId);
      expect(mockPlantGraphQLMapper.toResponseDto).toHaveBeenCalledWith(
        viewModel,
      );
    });

    it('should return plant with null optional properties', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PlantFindByIdRequestDto = {
        id: plantId,
      };

      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const viewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt,
        updatedAt,
      });

      const responseDto: PlantResponseDto = {
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt,
        updatedAt,
      };

      mockQueryBus.execute.mockResolvedValue(viewModel);
      mockPlantGraphQLMapper.toResponseDto.mockReturnValue(responseDto);

      const result = await resolver.plantFindById(input);

      expect(result).toBe(responseDto);
      expect(result.plantedDate).toBeNull();
      expect(result.notes).toBeNull();
    });

    it('should return null when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PlantFindByIdRequestDto = {
        id: plantId,
      };

      mockQueryBus.execute.mockResolvedValue(null);

      const result = await resolver.plantFindById(input);

      expect(result).toBeNull();
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(PlantViewModelFindByIdQuery),
      );
      expect(mockPlantGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });

    it('should handle errors from query bus', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const input: PlantFindByIdRequestDto = {
        id: plantId,
      };

      const error = new Error('Plant not found');
      mockQueryBus.execute.mockRejectedValue(error);

      await expect(resolver.plantFindById(input)).rejects.toThrow(error);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(PlantViewModelFindByIdQuery),
      );
      expect(mockPlantGraphQLMapper.toResponseDto).not.toHaveBeenCalled();
    });
  });
});
