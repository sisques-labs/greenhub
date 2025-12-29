import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { Test } from '@nestjs/testing';

describe('AssertPlantExistsService', () => {
  let service: AssertPlantExistsService;
  let mockPlantWriteRepository: jest.Mocked<PlantWriteRepository>;

  beforeEach(async () => {
    mockPlantWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PlantWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        AssertPlantExistsService,
        {
          provide: PLANT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPlantWriteRepository,
        },
      ],
    }).compile();

    service = module.get<AssertPlantExistsService>(AssertPlantExistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return plant aggregate when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPlantWriteRepository.findById.mockResolvedValue(mockPlant);

      const result = await service.execute(plantId);

      expect(result).toBe(mockPlant);
      expect(mockPlantWriteRepository.findById).toHaveBeenCalledWith(plantId);
      expect(mockPlantWriteRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw PlantNotFoundException when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';

      mockPlantWriteRepository.findById.mockResolvedValue(null);

      await expect(service.execute(plantId)).rejects.toThrow(
        PlantNotFoundException,
      );
      await expect(service.execute(plantId)).rejects.toThrow(
        `Plant with id ${plantId} not found`,
      );

      expect(mockPlantWriteRepository.findById).toHaveBeenCalledWith(plantId);
      expect(mockPlantWriteRepository.findById).toHaveBeenCalledTimes(2);
    });

    it('should return plant aggregate with all properties when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPlantWriteRepository.findById.mockResolvedValue(mockPlant);

      const result = await service.execute(plantId);

      expect(result).toBe(mockPlant);
      expect(result.id.value).toBe(plantId);
      expect(result.name.value).toBe('Aloe Vera');
      expect(result.species.value).toBe('Aloe barbadensis');
      expect(result.status.value).toBe(PlantStatusEnum.PLANTED);
    });

    it('should return plant aggregate with null plantedDate when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '123e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: null,
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockPlantWriteRepository.findById.mockResolvedValue(mockPlant);

      const result = await service.execute(plantId);

      expect(result).toBe(mockPlant);
      expect(result.id.value).toBe(plantId);
      expect(result.plantedDate).toBeNull();
      expect(result.status.value).toBe(PlantStatusEnum.GROWING);
    });

    it('should handle repository errors correctly', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const repositoryError = new Error('Database connection error');

      mockPlantWriteRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.execute(plantId)).rejects.toThrow(repositoryError);

      expect(mockPlantWriteRepository.findById).toHaveBeenCalledWith(plantId);
      expect(mockPlantWriteRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
