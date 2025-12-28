import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import {
  PLANT_READ_REPOSITORY_TOKEN,
  PlantReadRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { Test } from '@nestjs/testing';

describe('AssertPlantViewModelExistsService', () => {
  let service: AssertPlantViewModelExistsService;
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
        AssertPlantViewModelExistsService,
        {
          provide: PLANT_READ_REPOSITORY_TOKEN,
          useValue: mockPlantReadRepository,
        },
      ],
    }).compile();

    service = module.get<AssertPlantViewModelExistsService>(
      AssertPlantViewModelExistsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return plant view model when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      mockPlantReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(plantId);

      expect(result).toBe(mockViewModel);
      expect(mockPlantReadRepository.findById).toHaveBeenCalledWith(plantId);
      expect(mockPlantReadRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PlantNotFoundException when plant view model does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      mockPlantReadRepository.findById.mockResolvedValue(null);

      await expect(service.execute(plantId)).rejects.toThrow(
        PlantNotFoundException,
      );
      await expect(service.execute(plantId)).rejects.toThrow(
        `Plant with id ${plantId} not found`,
      );

      expect(mockPlantReadRepository.findById).toHaveBeenCalledWith(plantId);
      expect(mockPlantReadRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should return plant view model with all properties when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      });

      mockPlantReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(plantId);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(plantId);
      expect(result.name).toBe('Aloe Vera');
      expect(result.species).toBe('Aloe barbadensis');
      expect(result.status).toBe(PlantStatusEnum.PLANTED);
    });

    it('should return plant view model with null plantedDate when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockViewModel = new PlantViewModel({
        id: plantId,
        containerId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.GROWING,
        createdAt: now,
        updatedAt: now,
      });

      mockPlantReadRepository.findById.mockResolvedValue(mockViewModel);

      const result = await service.execute(plantId);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(plantId);
      expect(result.plantedDate).toBeNull();
      expect(result.status).toBe(PlantStatusEnum.GROWING);
    });

    it('should handle repository errors correctly', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockPlantReadRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(plantId)).rejects.toThrow(repositoryError);

      expect(mockPlantReadRepository.findById).toHaveBeenCalledWith(plantId);
      expect(mockPlantReadRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
