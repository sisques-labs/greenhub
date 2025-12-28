import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerPlantViewModel } from '@/core/plant-context/containers/domain/view-models/container-plant/container-plant.view-model';
import { FindPlantsByContainerIdQuery } from '@/core/plant-context/plants/application/queries/find-plants-by-container-id/find-plants-by-container-id.query';
import { QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

describe('ContainerObtainPlantsService', () => {
  let service: ContainerObtainPlantsService;
  let mockQueryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    mockQueryBus = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    const module = await Test.createTestingModule({
      providers: [
        ContainerObtainPlantsService,
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    service = module.get<ContainerObtainPlantsService>(
      ContainerObtainPlantsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return array of container plant view models when plants are found', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();

      const mockPlant1 = new ContainerPlantViewModel({
        id: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: null,
        status: 'PLANTED',
        createdAt: now,
        updatedAt: now,
      });

      const mockPlant2 = new ContainerPlantViewModel({
        id: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: new Date('2024-01-20'),
        notes: null,
        status: 'GROWING',
        createdAt: now,
        updatedAt: now,
      });

      const mockPlants = [mockPlant1, mockPlant2];

      mockQueryBus.execute.mockResolvedValue(mockPlants);

      const result = await service.execute(containerId);

      expect(result).toBe(mockPlants);
      expect(result).toHaveLength(2);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPlantsByContainerIdQuery),
      );
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no plants are found', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockQueryBus.execute.mockResolvedValue([]);

      const result = await service.execute(containerId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPlantsByContainerIdQuery),
      );
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
    });

    it('should handle query bus errors correctly', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';
      const queryError = new Error('Query bus error');

      mockQueryBus.execute.mockRejectedValue(queryError);

      await expect(service.execute(containerId)).rejects.toThrow(queryError);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        expect.any(FindPlantsByContainerIdQuery),
      );
      expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
    });

    it('should pass correct containerId to query', async () => {
      const containerId = '123e4567-e89b-12d3-a456-426614174000';

      mockQueryBus.execute.mockResolvedValue([]);

      await service.execute(containerId);

      const queryCall = mockQueryBus.execute.mock.calls[0]?.[0];
      expect(queryCall).toBeInstanceOf(FindPlantsByContainerIdQuery);
      if (queryCall instanceof FindPlantsByContainerIdQuery) {
        expect(queryCall.containerId.value).toBe(containerId);
      }
    });
  });
});
