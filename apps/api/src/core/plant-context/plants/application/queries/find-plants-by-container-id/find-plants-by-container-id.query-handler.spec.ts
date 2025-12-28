import { FindPlantsByContainerIdQuery } from '@/core/plant-context/plants/application/queries/find-plants-by-container-id/find-plants-by-container-id.query';
import { FindPlantsByContainerIdQueryHandler } from '@/core/plant-context/plants/application/queries/find-plants-by-container-id/find-plants-by-container-id.query-handler';
import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import {
  PLANT_WRITE_REPOSITORY_TOKEN,
  PlantWriteRepository,
} from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { Test } from '@nestjs/testing';

describe('FindPlantsByContainerIdQueryHandler', () => {
  let handler: FindPlantsByContainerIdQueryHandler;
  let mockPlantWriteRepository: jest.Mocked<PlantWriteRepository>;

  beforeEach(async () => {
    mockPlantWriteRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByContainerId: jest.fn(),
    } as unknown as jest.Mocked<PlantWriteRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FindPlantsByContainerIdQueryHandler,
        {
          provide: PLANT_WRITE_REPOSITORY_TOKEN,
          useValue: mockPlantWriteRepository,
        },
      ],
    }).compile();

    handler = module.get<FindPlantsByContainerIdQueryHandler>(
      FindPlantsByContainerIdQueryHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return array of plant aggregates when plants are found', async () => {
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const query = new FindPlantsByContainerIdQuery({ containerId });
      const now = new Date();

      const mockPlant1 = new PlantAggregate(
        {
          id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          containerId: new ContainerUuidValueObject(containerId),
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

      const mockPlant2 = new PlantAggregate(
        {
          id: new PlantUuidValueObject('323e4567-e89b-12d3-a456-426614174000'),
          containerId: new ContainerUuidValueObject(containerId),
          name: new PlantNameValueObject('Basil'),
          species: new PlantSpeciesValueObject('Ocimum basilicum'),
          plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-20')),
          notes: null,
          status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const mockPlants = [mockPlant1, mockPlant2];

      mockPlantWriteRepository.findByContainerId.mockResolvedValue(mockPlants);

      const result = await handler.execute(query);

      expect(result).toBe(mockPlants);
      expect(result).toHaveLength(2);
      expect(result[0].id.value).toBe(mockPlant1.id.value);
      expect(result[0].containerId?.value).toBe(containerId);
      expect(result[1].id.value).toBe(mockPlant2.id.value);
      expect(result[1].containerId?.value).toBe(containerId);
      expect(mockPlantWriteRepository.findByContainerId).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockPlantWriteRepository.findByContainerId).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty array when no plants are found', async () => {
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const query = new FindPlantsByContainerIdQuery({ containerId });

      mockPlantWriteRepository.findByContainerId.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(mockPlantWriteRepository.findByContainerId).toHaveBeenCalledWith(
        containerId,
      );
      expect(mockPlantWriteRepository.findByContainerId).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return plant aggregates with all properties', async () => {
      const containerId = '223e4567-e89b-12d3-a456-426614174000';
      const query = new FindPlantsByContainerIdQuery({ containerId });
      const now = new Date();

      const mockPlant = new PlantAggregate(
        {
          id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          containerId: new ContainerUuidValueObject(containerId),
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

      mockPlantWriteRepository.findByContainerId.mockResolvedValue([mockPlant]);

      const result = await handler.execute(query);

      expect(result).toHaveLength(1);
      expect(result[0].id.value).toBe(mockPlant.id.value);
      expect(result[0].containerId?.value).toBe(containerId);
      expect(result[0].name.value).toBe('Aloe Vera');
      expect(result[0].species.value).toBe('Aloe barbadensis');
      expect(result[0].status.value).toBe(PlantStatusEnum.PLANTED);
    });
  });
});
