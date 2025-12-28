import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { IPlantCreateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-create/plant-create.dto';
import { IPlantUpdateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-update/plant-update.dto';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { PlantDeletedEvent } from '@/shared/domain/events/features/plants/plant-deleted/plant-deleted.event';
import { PlantStatusChangedEvent } from '@/shared/domain/events/features/plants/plant-status-changed/plant-status-changed.event';
import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

describe('PlantAggregate', () => {
  const createProps = (): IPlantCreateDto => {
    const now = new Date();
    return {
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
  };

  describe('constructor', () => {
    it('should create a PlantAggregate with all properties', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      expect(aggregate).toBeInstanceOf(PlantAggregate);
      expect(aggregate.id.value).toBe(props.id.value);
      expect(aggregate.containerId?.value).toBe(props.containerId?.value);
      expect(aggregate.name.value).toBe(props.name.value);
      expect(aggregate.species.value).toBe(props.species.value);
      expect(aggregate.plantedDate?.value).toEqual(props.plantedDate?.value);
      expect(aggregate.notes?.value).toBe(props.notes?.value);
      expect(aggregate.status.value).toBe(props.status.value);
      expect(aggregate.createdAt.value).toEqual(props.createdAt.value);
      expect(aggregate.updatedAt.value).toEqual(props.updatedAt.value);
    });

    it('should emit PlantCreatedEvent on creation by default', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props);

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PlantCreatedEvent);

      const event = events[0] as PlantCreatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(PlantAggregate.name);
      expect(event.eventType).toBe(PlantCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit PlantCreatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should create a PlantAggregate with null plantedDate', () => {
      const props = createProps();
      props.plantedDate = null;
      const aggregate = new PlantAggregate(props, false);

      expect(aggregate.plantedDate).toBeNull();
    });

    it('should create a PlantAggregate with null notes', () => {
      const props = createProps();
      props.notes = null;
      const aggregate = new PlantAggregate(props, false);

      expect(aggregate.notes).toBeNull();
    });
  });

  describe('update', () => {
    it('should update the containerId, name, species, plantedDate, notes, and status', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const beforeUpdate = aggregate.updatedAt.value.getTime();
      const newContainerId = new ContainerUuidValueObject(
        '323e4567-e89b-12d3-a456-426614174000',
      );
      const updateDto: IPlantUpdateDto = {
        containerId: newContainerId,
        name: new PlantNameValueObject('Basil'),
        species: new PlantSpeciesValueObject('Ocimum basilicum'),
        plantedDate: new PlantPlantedDateValueObject(new Date('2024-02-01')),
        notes: new PlantNotesValueObject('Water daily'),
        status: new PlantStatusValueObject(PlantStatusEnum.GROWING),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.containerId.value).toBe(newContainerId.value);
      expect(aggregate.name.value).toBe('Basil');
      expect(aggregate.species.value).toBe('Ocimum basilicum');
      expect(aggregate.plantedDate?.value).toEqual(new Date('2024-02-01'));
      expect(aggregate.notes?.value).toBe('Water daily');
      expect(aggregate.status.value).toBe(PlantStatusEnum.GROWING);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate,
      );
    });

    it('should not update properties when they are undefined', () => {
      const props = createProps();
      const originalName = props.name.value;
      const originalSpecies = props.species.value;
      const aggregate = new PlantAggregate(props, false);

      const updateDto: IPlantUpdateDto = {};

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe(originalName);
      expect(aggregate.species.value).toBe(originalSpecies);
    });

    it('should update only provided properties', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const updateDto: IPlantUpdateDto = {
        name: new PlantNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.name.value).toBe('Updated Name');
      expect(aggregate.species.value).toBe(props.species.value);
    });

    it('should update plantedDate to null', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const updateDto: IPlantUpdateDto = {
        plantedDate: null,
      };

      aggregate.update(updateDto, false);

      expect(aggregate.plantedDate).toBeNull();
    });

    it('should update notes to null', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const updateDto: IPlantUpdateDto = {
        notes: null,
      };

      aggregate.update(updateDto, false);

      expect(aggregate.notes).toBeNull();
    });

    it('should emit PlantUpdatedEvent on update by default', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const updateDto: IPlantUpdateDto = {
        name: new PlantNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PlantUpdatedEvent);

      const event = events[0] as PlantUpdatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(PlantAggregate.name);
      expect(event.eventType).toBe(PlantUpdatedEvent.name);
    });

    it('should not emit PlantUpdatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const updateDto: IPlantUpdateDto = {
        name: new PlantNameValueObject('Updated Name'),
      };

      aggregate.update(updateDto, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('changeStatus', () => {
    it('should change the status and update updatedAt timestamp', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const beforeChange = aggregate.updatedAt.value.getTime();
      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      aggregate.changeStatus(newStatus, false);

      expect(aggregate.status.value).toBe(PlantStatusEnum.GROWING);
      expect(aggregate.updatedAt.value.getTime()).toBeGreaterThanOrEqual(
        beforeChange,
      );
    });

    it('should emit PlantStatusChangedEvent on changeStatus by default', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      aggregate.changeStatus(newStatus);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PlantStatusChangedEvent);

      const event = events[0] as PlantStatusChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(PlantAggregate.name);
      expect(event.eventType).toBe(PlantStatusChangedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit PlantStatusChangedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      aggregate.changeStatus(newStatus, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('delete', () => {
    it('should emit PlantDeletedEvent on delete by default', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PlantDeletedEvent);

      const event = events[0] as PlantDeletedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(PlantAggregate.name);
      expect(event.eventType).toBe(PlantDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit PlantDeletedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: props.id.value,
        containerId: props.containerId.value,
        name: props.name.value,
        species: props.species.value,
        plantedDate: props.plantedDate?.value,
        notes: props.notes?.value,
        status: props.status.value,
        createdAt: props.createdAt.value,
        updatedAt: props.updatedAt.value,
      });
    });

    it('should convert aggregate with null plantedDate to primitives correctly', () => {
      const props = createProps();
      props.plantedDate = null;
      const aggregate = new PlantAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.plantedDate).toBeNull();
    });

    it('should convert aggregate with null notes to primitives correctly', () => {
      const props = createProps();
      props.notes = null;
      const aggregate = new PlantAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.notes).toBeNull();
    });
  });

  describe('getters', () => {
    it('should expose value objects through getters', () => {
      const props = createProps();
      const aggregate = new PlantAggregate(props, false);

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
  });
});
