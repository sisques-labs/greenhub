import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantResponseDto } from '@/core/plant-context/transport/graphql/dtos/responses/plant/plant.response.dto';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantGraphQLMapper', () => {
  let mapper: PlantGraphQLMapper;
  let plantEntityFactory: PlantEntityFactory;

  beforeEach(() => {
    mapper = new PlantGraphQLMapper();
    plantEntityFactory = new PlantEntityFactory();
  });

  describe('toResponseDtoFromEntity', () => {
    it('should convert plant entity to response DTO with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const plantedDate = new Date('2024-01-15');

      const plantEntity = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: new PlantPlantedDateValueObject(plantedDate),
        notes: new PlantNotesValueObject('Keep in indirect sunlight'),
        status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      });

      const result = mapper.toResponseDtoFromEntity(plantEntity);

      expect(result).toEqual({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert plant entity with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';

      const plantEntity = plantEntityFactory.create({
        id: new PlantUuidValueObject(plantId),
        growingUnitId: new GrowingUnitUuidValueObject(growingUnitId),
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: null,
        notes: null,
        status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
      });

      const result = mapper.toResponseDtoFromEntity(plantEntity);

      expect(result).toEqual({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('toResponseDtoFromViewModel', () => {
    it('should convert plant view model to response DTO with all properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const plantedDate = new Date('2024-01-15');

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDtoFromViewModel(viewModel);

      expect(result).toEqual({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: plantedDate,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt,
        updatedAt,
      });
    });

    it('should convert plant view model with null optional properties', () => {
      const plantId = '123e4567-e89b-12d3-a456-426614174000';
      const growingUnitId = '223e4567-e89b-12d3-a456-426614174000';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');

      const viewModel = new PlantViewModel({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt,
        updatedAt,
      });

      const result = mapper.toResponseDtoFromViewModel(viewModel);

      expect(result).toEqual({
        id: plantId,
        growingUnitId: growingUnitId,
        name: 'Basil',
        species: 'Ocimum basilicum',
        plantedDate: null,
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt,
        updatedAt,
      });
    });
  });
});
