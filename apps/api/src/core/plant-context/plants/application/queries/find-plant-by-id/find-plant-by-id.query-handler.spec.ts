import { PlantNotFoundException } from '@/core/plant-context/plants/application/exceptions/plant-not-found/plant-not-found.exception';
import { AssertPlantExistsService } from '@/core/plant-context/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { Test } from '@nestjs/testing';
import { FindPlantByIdQuery } from './find-plant-by-id.query';
import { FindPlantByIdQueryHandler } from './find-plant-by-id.query-handler';

describe('FindPlantByIdQueryHandler', () => {
  let handler: FindPlantByIdQueryHandler;
  let mockAssertPlantExistsService: jest.Mocked<AssertPlantExistsService>;

  beforeEach(async () => {
    mockAssertPlantExistsService = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AssertPlantExistsService>;

    const module = await Test.createTestingModule({
      providers: [
        FindPlantByIdQueryHandler,
        {
          provide: AssertPlantExistsService,
          useValue: mockAssertPlantExistsService,
        },
      ],
    }).compile();

    handler = module.get<FindPlantByIdQueryHandler>(FindPlantByIdQueryHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return plant aggregate when plant exists', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPlantByIdQuery({ id: plantId });
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);

      const result = await handler.execute(query);

      expect(result).toBe(mockPlant);
      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
        plantId,
      );
      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw PlantNotFoundException when plant does not exist', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPlantByIdQuery({ id: plantId });
      const error = new PlantNotFoundException(plantId);

      mockAssertPlantExistsService.execute.mockRejectedValue(error);

      await expect(handler.execute(query)).rejects.toThrow(error);
      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledWith(
        plantId,
      );
      expect(mockAssertPlantExistsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should return plant aggregate with all properties', async () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const query = new FindPlantByIdQuery({ id: plantId });
      const now = new Date();
      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject(plantId),
          containerId: new ContainerUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      mockAssertPlantExistsService.execute.mockResolvedValue(mockPlant);

      const result = await handler.execute(query);

      expect(result).toBe(mockPlant);
      expect(result.id.value).toBe(plantId);
      expect(result.name.value).toBe('Aloe Vera');
      expect(result.species.value).toBe('Aloe barbadensis');
      expect(result.status.value).toBe(PlantStatusEnum.PLANTED);
    });
  });
});
