import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { IPlantCreateViewModelDto } from '@/core/plant-context/plants/domain/dtos/view-models/plant-create/plant-create-view-model.dto';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantViewModelFactory } from '@/core/plant-context/plants/domain/factories/plant-view-model/plant-view-model.factory';
import { PlantPrimitives } from '@/core/plant-context/plants/domain/primitives/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantViewModelFactory', () => {
  let factory: PlantViewModelFactory;

  beforeEach(() => {
    factory = new PlantViewModelFactory();
  });

  describe('create', () => {
    it('should create a PlantViewModel from DTO', () => {
      const now = new Date();
      const dto: IPlantCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.id).toBe(dto.id);
      expect(viewModel.containerId).toBe(dto.containerId);
      expect(viewModel.name).toBe(dto.name);
      expect(viewModel.species).toBe(dto.species);
      expect(viewModel.plantedDate).toEqual(dto.plantedDate);
      expect(viewModel.notes).toBe(dto.notes);
      expect(viewModel.status).toBe(dto.status);
      expect(viewModel.createdAt).toEqual(dto.createdAt);
      expect(viewModel.updatedAt).toEqual(dto.updatedAt);
    });

    it('should create a PlantViewModel from DTO with null plantedDate', () => {
      const now = new Date();
      const dto: IPlantCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.plantedDate).toBeNull();
    });

    it('should create a PlantViewModel from DTO with null notes', () => {
      const now = new Date();
      const dto: IPlantCreateViewModelDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: null,
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.create(dto);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.notes).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a PlantViewModel from primitives with all fields', () => {
      const now = new Date();
      const primitives: PlantPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.id).toBe(primitives.id);
      expect(viewModel.containerId).toBe(primitives.containerId);
      expect(viewModel.name).toBe(primitives.name);
      expect(viewModel.species).toBe(primitives.species);
      expect(viewModel.plantedDate).toEqual(primitives.plantedDate);
      expect(viewModel.notes).toBe(primitives.notes);
      expect(viewModel.status).toBe(primitives.status);
      expect(viewModel.createdAt).toEqual(primitives.createdAt);
      expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
    });

    it('should create a PlantViewModel from primitives with null plantedDate', () => {
      const now = new Date();
      const primitives: PlantPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: null,
        notes: 'Keep in indirect sunlight',
        status: PlantStatusEnum.PLANTED,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.plantedDate).toBeNull();
    });

    it('should create a PlantViewModel from primitives with null notes', () => {
      const now = new Date();
      const primitives: PlantPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        containerId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aloe Vera',
        species: 'Aloe barbadensis',
        plantedDate: new Date('2024-01-15'),
        notes: null,
        status: PlantStatusEnum.GROWING,
        createdAt: now,
        updatedAt: now,
      };

      const viewModel = factory.fromPrimitives(primitives);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.notes).toBeNull();
    });
  });

  describe('fromAggregate', () => {
    it('should create a PlantViewModel from PlantAggregate with all fields', () => {
      const now = new Date();
      const aggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          containerId: new ContainerUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
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

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.id).toBe(aggregate.id.value);
      expect(viewModel.containerId).toBe(aggregate.containerId.value);
      expect(viewModel.name).toBe(aggregate.name.value);
      expect(viewModel.species).toBe(aggregate.species.value);
      expect(viewModel.plantedDate).toEqual(aggregate.plantedDate?.value);
      expect(viewModel.notes).toBe(aggregate.notes?.value);
      expect(viewModel.status).toBe(aggregate.status.value);
      expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
      expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
    });

    it('should create a PlantViewModel from PlantAggregate with null plantedDate', () => {
      const now = new Date();
      const aggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
          containerId: new ContainerUuidValueObject(
            '223e4567-e89b-12d3-a456-426614174000',
          ),
          name: new PlantNameValueObject('Aloe Vera'),
          species: new PlantSpeciesValueObject('Aloe barbadensis'),
          plantedDate: null,
          notes: new PlantNotesValueObject('Keep in indirect sunlight'),
          status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
          createdAt: new DateValueObject(now),
          updatedAt: new DateValueObject(now),
        },
        false,
      );

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.plantedDate).toBeNull();
    });

    it('should create a PlantViewModel from PlantAggregate with null notes', () => {
      const now = new Date();
      const aggregate = new PlantAggregate(
        {
          id: new PlantUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
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

      const viewModel = factory.fromAggregate(aggregate);

      expect(viewModel).toBeInstanceOf(PlantViewModel);
      expect(viewModel.notes).toBeNull();
    });
  });
});
