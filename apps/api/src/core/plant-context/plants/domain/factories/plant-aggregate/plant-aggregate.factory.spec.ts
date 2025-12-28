import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { IPlantCreateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-create/plant-create.dto';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantAggregateFactory } from '@/core/plant-context/plants/domain/factories/plant-aggregate/plant-aggregate.factory';
import { PlantPrimitives } from '@/core/plant-context/plants/domain/primitives/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantAggregateFactory', () => {
  let factory: PlantAggregateFactory;

  beforeEach(() => {
    factory = new PlantAggregateFactory();
  });

  describe('create', () => {
    it('should create a PlantAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date();

      const dto: IPlantCreateDto = {
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
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.containerId?.value).toBe(dto.containerId?.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.species.value).toBe(dto.species.value);
      expect(aggregate.plantedDate?.value).toEqual(dto.plantedDate?.value);
      expect(aggregate.notes?.value).toBe(dto.notes?.value);
      expect(aggregate.status.value).toBe(dto.status.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(PlantCreatedEvent);
    });

    it('should create a PlantAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date();

      const dto: IPlantCreateDto = {
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
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.containerId?.value).toBe(dto.containerId?.value);
      expect(aggregate.name.value).toBe(dto.name.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });

    it('should create a PlantAggregate from DTO with null plantedDate', () => {
      const now = new Date();

      const dto: IPlantCreateDto = {
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
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.plantedDate).toBeNull();
    });

    it('should create a PlantAggregate from DTO with null notes', () => {
      const now = new Date();

      const dto: IPlantCreateDto = {
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
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.notes).toBeNull();
    });
  });

  describe('fromPrimitives', () => {
    it('should create a PlantAggregate from primitives with all fields', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.containerId?.value).toBe(primitives.containerId);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.species.value).toBe(primitives.species);
      expect(aggregate.plantedDate?.value).toEqual(primitives.plantedDate);
      expect(aggregate.notes?.value).toBe(primitives.notes);
      expect(aggregate.status.value).toBe(primitives.status);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create a PlantAggregate from primitives with null plantedDate', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.species.value).toBe(primitives.species);
      expect(aggregate.plantedDate).toBeNull();
      expect(aggregate.notes?.value).toBe(primitives.notes);
      expect(aggregate.status.value).toBe(primitives.status);
    });

    it('should create a PlantAggregate from primitives with null notes', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.species.value).toBe(primitives.species);
      expect(aggregate.plantedDate?.value).toEqual(primitives.plantedDate);
      expect(aggregate.notes).toBeNull();
      expect(aggregate.status.value).toBe(primitives.status);
    });

    it('should create value objects correctly from primitives', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.id).toBeInstanceOf(PlantUuidValueObject);
      expect(aggregate.containerId).toBeInstanceOf(ContainerUuidValueObject);
      expect(aggregate.name).toBeInstanceOf(PlantNameValueObject);
      expect(aggregate.species).toBeInstanceOf(PlantSpeciesValueObject);
      expect(aggregate.plantedDate).toBeInstanceOf(PlantPlantedDateValueObject);
      expect(aggregate.notes).toBeInstanceOf(PlantNotesValueObject);
      expect(aggregate.status).toBeInstanceOf(PlantStatusValueObject);
      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
    });

    it('should not generate events when creating from primitives', () => {
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

      const aggregate = factory.fromPrimitives(primitives);

      // fromPrimitives calls new PlantAggregate with generateEvent = false
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });
});
