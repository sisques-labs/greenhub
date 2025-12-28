import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { IContainerCreateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-create/container-create.dto';
import { IContainerUpdateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-update/container-update.dto';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { ContainerCreatedEvent } from '@/shared/domain/events/features/containers/container-created/container-created.event';
import { ContainerDeletedEvent } from '@/shared/domain/events/features/containers/container-deleted/container-deleted.event';
import { ContainerUpdatedEvent } from '@/shared/domain/events/features/containers/container-updated/container-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

describe('ContainerAggregate', () => {
  const createProps = (): IContainerCreateDto => {
    const now = new Date();
    return {
      id: new ContainerUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
      name: new ContainerNameValueObject('Garden Bed 1'),
      type: new ContainerTypeValueObject(ContainerTypeEnum.GARDEN_BED),
      createdAt: new DateValueObject(now),
      updatedAt: new DateValueObject(now),
    };
  };

  describe('constructor', () => {
    it('should create a ContainerAggregate with all properties', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      expect(aggregate).toBeInstanceOf(ContainerAggregate);
      expect(aggregate.id.value).toBe(props.id.value);
      expect(aggregate.name.value).toBe(props.name.value);
      expect(aggregate.type.value).toBe(props.type.value);
      expect(aggregate.createdAt.value).toEqual(props.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(props.updatedAt.value);
    });

    it('should emit ContainerCreatedEvent on creation by default', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props);

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ContainerCreatedEvent);

      const event = events[0] as ContainerCreatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(ContainerAggregate.name);
      expect(event.eventType).toBe(ContainerCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit ContainerCreatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update the name and type', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      const beforeUpdate = aggregate.updatedAt.value.getTime();
      const updateDto: IContainerUpdateDto = {
        name: new ContainerNameValueObject('Garden Bed 2'),
        type: new ContainerTypeValueObject(ContainerTypeEnum.POT),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe('Garden Bed 2');
      expect(aggregate.type.value).toBe(ContainerTypeEnum.POT);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update properties when they are undefined', () => {
      const props = createProps();
      const originalName = props.name.value;
      const originalType = props.type.value;
      const aggregate = new ContainerAggregate(props, false);

      const updateDto: IContainerUpdateDto = {};

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe(originalName);
      expect(aggregate.type.value).toBe(originalType);
    });

    it('should update only provided properties', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      const updateDto: IContainerUpdateDto = {
        name: new ContainerNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe('Updated Name');
      expect(aggregate.type.value).toBe(props.type.value);
    });

    it('should emit ContainerUpdatedEvent on update by default', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      const updateDto: IContainerUpdateDto = {
        name: new ContainerNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ContainerUpdatedEvent);

      const event = events[0] as ContainerUpdatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(ContainerAggregate.name);
      expect(event.eventType).toBe(ContainerUpdatedEvent.name);
    });

    it('should not emit ContainerUpdatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      const updateDto: IContainerUpdateDto = {
        name: new ContainerNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should emit ContainerDeletedEvent on delete by default', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ContainerDeletedEvent);

      const event = events[0] as ContainerDeletedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(ContainerAggregate.name);
      expect(event.eventType).toBe(ContainerDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit ContainerDeletedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: props.id.value,
        name: props.name.value,
        type: props.type.value,
        createdAt: props.createdAt.value,
        updatedAt: props.updatedAt.value,
      });
    });
  });

  describe('getters', () => {
    it('should expose value objects through getters', () => {
      const props = createProps();
      const aggregate = new ContainerAggregate(props, false);

      expect(aggregate.id).toBeInstanceOf(ContainerUuidValueObject);
      expect(aggregate.name).toBeInstanceOf(ContainerNameValueObject);
      expect(aggregate.type).toBeInstanceOf(ContainerTypeValueObject);
      expect(aggregate.createdAt).toBeInstanceOf(DateValueObject);
      expect(aggregate.updatedAt).toBeInstanceOf(DateValueObject);
    });
  });
});
