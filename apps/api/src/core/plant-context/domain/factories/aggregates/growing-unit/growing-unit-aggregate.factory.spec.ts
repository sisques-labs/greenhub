import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { IContainerCreateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-create/container-create.dto';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerAggregateFactory } from '@/core/plant-context/containers/domain/factories/container-aggregate/container-aggregate.factory';
import { ContainerPrimitives } from '@/core/plant-context/containers/domain/primitives/container.primitives';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerCreatedEvent } from '@/shared/domain/events/features/plant-context/containers/container-created/container-created.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

describe('ContainerAggregateFactory', () => {
  let factory: ContainerAggregateFactory;

  beforeEach(() => {
    factory = new ContainerAggregateFactory();
  });

  describe('create', () => {
    it('should create a ContainerAggregate from DTO with all fields and generate event by default', () => {
      const now = new Date();

      const dto: IContainerCreateDto = {
        id: new ContainerUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new ContainerNameValueObject('Garden Bed 1'),
        type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto);

      expect(aggregate).toBeInstanceOf(ContainerAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);
      expect(aggregate.type.value).toBe(dto.type.value);
      expect(aggregate.createdAt.value).toEqual(dto.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(dto.updatedAt.value);

      // Check that event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(1);
      expect(uncommittedEvents[0]).toBeInstanceOf(ContainerCreatedEvent);
    });

    it('should create a ContainerAggregate from DTO without generating event when generateEvent is false', () => {
      const now = new Date();

      const dto: IContainerCreateDto = {
        id: new ContainerUuidValueObject(
          '123e4567-e89b-12d3-a456-426614174000',
        ),
        name: new ContainerNameValueObject('Garden Bed 1'),
        type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
        createdAt: new DateValueObject(now),
        updatedAt: new DateValueObject(now),
      };

      const aggregate = factory.create(dto, false);

      expect(aggregate).toBeInstanceOf(ContainerAggregate);
      expect(aggregate.id.value).toBe(dto.id.value);
      expect(aggregate.name.value).toBe(dto.name.value);

      // Check that no event was generated
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });

  describe('fromPrimitives', () => {
    it('should create a ContainerAggregate from primitives with all fields', () => {
      const now = new Date();
      const primitives: ContainerPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate).toBeInstanceOf(ContainerAggregate);
      expect(aggregate.id.value).toBe(primitives.id);
      expect(aggregate.name.value).toBe(primitives.name);
      expect(aggregate.type.value).toBe(primitives.type);
      expect(aggregate.createdAt.value).toEqual(primitives.createdAt);
      expect(aggregate.updatedAt.value).toEqual(primitives.updatedAt);
    });

    it('should create value objects correctly from primitives', () => {
      const now = new Date();
      const primitives: ContainerPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      expect(aggregate.id).toBeInstanceOf(ContainerUuidValueObject);
      expect(aggregate.name).toBeInstanceOf(ContainerNameValueObject);
      expect(aggregate.type).toBeInstanceOf(ContainerTypeValueObject);
      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
    });

    it('should not generate events when creating from primitives', () => {
      const now = new Date();
      const primitives: ContainerPrimitives = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Garden Bed 1',
        type: ContainerTypeEnum.GARDEN_BED,
        createdAt: now,
        updatedAt: now,
      };

      const aggregate = factory.fromPrimitives(primitives);

      // fromPrimitives calls new ContainerAggregate with generateEvent = false
      const uncommittedEvents = aggregate.getUncommittedEvents();
      expect(uncommittedEvents).toHaveLength(0);
    });
  });
});
