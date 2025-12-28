import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantGraphQLMapper } from '@/core/plant-context/plants/transport/graphql/mappers/plant.mapper';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('PlantGraphQLMapper', () => {
  let mapper: PlantGraphQLMapper;

  beforeEach(() => {
    mapper = new PlantGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert plant view model to response DTO with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
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
    });

    it('should convert plant view model to response DTO with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
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
    });

    it('should convert plant view model with different statuses to response DTO', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [
        PlantStatusEnum.PLANTED,
        PlantStatusEnum.GROWING,
        PlantStatusEnum.HARVESTED,
        PlantStatusEnum.DEAD,
      ];

      testCases.forEach((status) => {
        const viewModel = new PlantViewModel({
          id: plantId,
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Aloe Vera',
          species: 'Aloe barbadensis',
          plantedDate: null,
          notes: null,
          status,
          createdAt,
          updatedAt,
        });

        const result = mapper.toResponseDto(viewModel);

        expect(result.status).toBe(status);
        expect(result.id).toBe(plantId);
        expect(result.name).toBe('Aloe Vera');
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
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
        new PlantViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          containerId: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Basil',
          species: 'Ocimum basilicum',
          plantedDate: null,
          notes: null,
          status: PlantStatusEnum.GROWING,
          createdAt,
          updatedAt,
        }),
      ];

      const paginatedResult = new PaginatedResult(viewModels, 2, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
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
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            containerId: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Basil',
            species: 'Ocimum basilicum',
            plantedDate: null,
            notes: null,
            status: PlantStatusEnum.GROWING,
            createdAt,
            updatedAt,
          },
        ],
        total: 2,
        page: 1,
        perPage: 10,
        totalPages: 1,
      });
    });

    it('should convert empty paginated result to paginated response DTO', () => {
      const paginatedResult = new PaginatedResult([], 0, 1, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 0,
      });
    });

    it('should convert paginated result with multiple pages to paginated response DTO', () => {
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

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
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
        total: 25,
        page: 2,
        perPage: 10,
        totalPages: 3,
      });
    });
  });
});
