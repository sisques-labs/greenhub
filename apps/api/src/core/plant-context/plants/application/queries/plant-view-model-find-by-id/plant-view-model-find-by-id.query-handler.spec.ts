import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { AssertPlantViewModelExistsService } from '@/core/plant-context/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { Test } from '@nestjs/testing';
import { PlantViewModelFindByIdQuery } from './plant-view-model-find-by-id.query';
import { PlantViewModelFindByIdQueryHandler } from './plant-view-model-find-by-id.query-handler';

describe('PlantViewModelFindByIdQueryHandler', () => {
  let handler: PlantViewModelFindByIdQueryHandler;
  let mockAssertPlantViewModelExistsService: jest.Mocked<AssertPlantViewModelExistsService>;

  beforeEach(async () => {
    mockAssertPlantViewModelExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPlantViewModelExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        PlantViewModelFindByIdQueryHandler,
        {
          provide: AssertPlantViewModelExistsService,
          useValue: mockAssertPlantViewModelExistsService,
        },
      ],
    }).compile();

    handler = module.get<PlantViewModelFindByIdQueryHandler>(
      PlantViewModelFindByIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return plant view model when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new PlantViewModelFindByIdQuery({ id: plantId });
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

      mockAssertPlantViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledWith(plantId);
      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw PlantNotFoundException when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new PlantViewModelFindByIdQuery({ id: plantId });
      const error = new PlantNotFoundException(plantId);

      mockAssertPlantViewModelExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledWith(plantId);
      expect(
        mockAssertPlantViewModelExistsService.execute,
      ).toHaveBeenCalledTimes(1);
    });

    it('should return plant view model with all properties', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new PlantViewModelFindByIdQuery({ id: plantId });
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

      mockAssertPlantViewModelExistsService.execute.mockResolvedValue(
        mockViewModel,
      );

      const result = await handler.execute(query);

      expect(result).toBe(mockViewModel);
      expect(result.id).toBe(plantId);
      expect(result.name).toBe('Aloe Vera');
      expect(result.species).toBe('Aloe barbadensis');
      expect(result.status).toBe(PlantStatusEnum.PLANTED);
    });
  });
});
