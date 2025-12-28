import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerGraphQLMapper } from '@/core/plant-context/containers/transport/graphql/mappers/container.mapper';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

describe('ContainerGraphQLMapper', () => {
  let mapper: ContainerGraphQLMapper;

  beforeEach(() => {
    mapper = new ContainerGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert container view model to response DTO with all properties', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');

      const plant1 = new ContainerPlantViewModel({
        id: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });

      const plant2 = new ContainerPlantViewModel({
        id: '323e4567-e89b-12d3-a456-426614174001',
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt,
        updatedAt,
      });

      const viewModel = new ContainerViewModel({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [plant1, plant2],
        numberOfPlants: 2,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: containerId,
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        plants: [
          {
            id: '223e4567-e89b-12d3-a456-426614174000',
            name: 'Aloe Vera',
            species: 'Aloe barbadensis',
            plantedDate: plantedDate,
            notes: 'Keep in indirect sunlight',
            status: PlantStatusEnum.PLANTED,
            createdAt,
            updatedAt,
          },
          {
            id: '323e4567-e89b-12d3-a456-426614174001',
            name: 'Basil',
            species: 'Ocimum basilicum',
            plantedDate: null,
            notes: null,
            status: PlantStatusEnum.GROWING,
            createdAt,
            updatedAt,
          },
        ],
        numberOfPlants: 2,
        createdAt,
        updatedAt,
      });
    });

    it('should convert container view model with empty plants array', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
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

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual({
        id: containerId,
        name: 'Empty Container',
        type: ContainerTypeEnum.POT,
        plants: [],
        numberOfPlants: 0,
        createdAt,
        updatedAt,
      });
    });

    it('should convert container view model with different container types', () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const testCases = [
        ContainerTypeEnum.POT,
        ContainerTypeEnum.GARDEN_BED,
        ContainerTypeEnum.HANGING_BASKET,
        ContainerTypeEnum.WINDOW_BOX,
      ];

      testCases.forEach((type) => {
        const viewModel = new ContainerViewModel({
          id: containerId,
          name: 'Container',
          type,
          plants: [],
          numberOfPlants: 0,
          createdAt,
          updatedAt,
        });

        const result = mapper.toResponseDto(viewModel);

        expect(result.type).toBe(type);
        expect(result.numberOfPlants).toBe(0);
      });
    });
  });

  describe('toPaginatedResponseDto', () => {
    it('should convert paginated result to paginated response DTO', () => {
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
        new ContainerViewModel({
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Pot 1',
          type: ContainerTypeEnum.POT,
          plants: [],
          numberOfPlants: 1,
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
            name: 'Garden Bed 1',
            type: ContainerTypeEnum.GARDEN_BED,
            plants: [],
            numberOfPlants: 5,
            createdAt,
            updatedAt,
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            name: 'Pot 1',
            type: ContainerTypeEnum.POT,
            plants: [],
            numberOfPlants: 1,
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

      const paginatedResult = new PaginatedResult(viewModels, 25, 2, 10);

      const result = mapper.toPaginatedResponseDto(paginatedResult);

      expect(result).toEqual({
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
        total: 25,
        page: 2,
        perPage: 10,
        totalPages: 3,
      });
    });
  });
});
