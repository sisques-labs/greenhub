import { IGrowingUnitDto } from '@/core/plant-context/domain/dtos/entities/growing-unit/growing-unit.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { IPlantDto } from '@/core/plant-context/domain/dtos/entities/plant/plant.dto';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { GrowingUnitCreatedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-created/growing-unit-created.event';
import { GrowingUnitDeletedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { GrowingUnitPlantAddedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { GrowingUnitPlantRemovedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import { GrowingUnitNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-name-changed/growing-unit-name-changed.event';
import { GrowingUnitTypeChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-type-changed/growing-unit-type-changed.event';
import { GrowingUnitCapacityChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-capacity-changed/growing-unit-capacity-changed.event';
import { GrowingUnitDimensionsChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-dimensions-changed/growing-unit-dimensions-changed.event';
import { GrowingUnitPlantStatusChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-status-changed/growing-unit-plant-status-changed.event';
import { GrowingUnitPlantNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-name-changed/growing-unit-plant-name-changed.event';
import { GrowingUnitPlantSpeciesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-species-changed/growing-unit-plant-species-changed.event';
import { GrowingUnitPlantPlantedDateChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-planted-date-changed/growing-unit-plant-planted-date-changed.event';
import { GrowingUnitPlantNotesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-notes-changed/growing-unit-plant-notes-changed.event';
import { GrowingUnitPlantGrowingUnitChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-growing-unit-changed/growing-unit-plant-growing-unit-changed.event';

describe('GrowingUnitAggregate', () => {
  const createPlantEntity = (overrides?: Partial<IPlantDto>): PlantEntity => {
    const props: IPlantDto = {
      id: new PlantUuidValueObject('333e4567-e89b-12d3-a456-426614174000'),
      growingUnitId: new GrowingUnitUuidValueObject(
        '223e4567-e89b-12d3-a456-426614174000',
      ),
      name: new PlantNameValueObject('Aloe Vera'),
      species: new PlantSpeciesValueObject('Aloe barbadensis'),
      plantedDate: new PlantPlantedDateValueObject(new Date('2024-01-15')),
      notes: new PlantNotesValueObject('Keep in indirect sunlight'),
      status: new PlantStatusValueObject(PlantStatusEnum.PLANTED),
      ...overrides,
    };
    return new PlantEntity(props);
  };

  const createProps = (
    overrides?: Partial<IGrowingUnitDto>,
  ): IGrowingUnitDto => {
    return {
      id: new GrowingUnitUuidValueObject(
        '123e4567-e89b-12d3-a456-426614174000',
      ),
      name: new GrowingUnitNameValueObject('Garden Bed 1'),
      type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
      capacity: new GrowingUnitCapacityValueObject(10),
      dimensions: new DimensionsValueObject({
        length: 100,
        width: 50,
        height: 30,
        unit: LengthUnitEnum.CENTIMETER,
      }),
      plants: [],
      ...overrides,
    };
  };

  describe('constructor', () => {
    it('should create a GrowingUnitAggregate with all properties', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate).toBeInstanceOf(GrowingUnitAggregate);
      expect(aggregate.id.value).toBe(props.id.value);
      expect(aggregate.name.value).toBe(props.name.value);
      expect(aggregate.type.value).toBe(props.type.value);
      expect(aggregate.capacity.value).toBe(props.capacity.value);
      expect(aggregate.dimensions?.toPrimitives()).toEqual(
        props.dimensions?.toPrimitives(),
      );
      expect(aggregate.plants).toEqual([]);
    });

    it('should create a GrowingUnitAggregate with null dimensions', () => {
      const props = createProps({ dimensions: null });
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.dimensions).toBeNull();
    });

    it('should create a GrowingUnitAggregate with plants', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.plants).toHaveLength(1);
      expect(aggregate.plants[0].id.value).toBe(plant.id.value);
    });

    it('should emit GrowingUnitCreatedEvent on creation by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props);

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitCreatedEvent);

      const event = events[0] as GrowingUnitCreatedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(GrowingUnitAggregate.name);
      expect(event.eventType).toBe(GrowingUnitCreatedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit GrowingUnitCreatedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('addPlant', () => {
    it('should add a plant to the growing unit', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const plant = createPlantEntity();

      aggregate.addPlant(plant, false);

      expect(aggregate.plants).toHaveLength(1);
      expect(aggregate.plants[0].id.value).toBe(plant.id.value);
    });

    it('should emit GrowingUnitPlantAddedEvent on add by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const plant = createPlantEntity();

      aggregate.addPlant(plant);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantAddedEvent);

      const event = events[0] as GrowingUnitPlantAddedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.growingUnitId).toBe(props.id.value);
      expect(event.data.plant.id).toBe(plant.id.value);
    });

    it('should not emit GrowingUnitPlantAddedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const plant = createPlantEntity();

      aggregate.addPlant(plant, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('removePlant', () => {
    it('should remove a plant from the growing unit', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);

      aggregate.removePlant(plant, false);

      expect(aggregate.plants).toHaveLength(0);
    });

    it('should emit GrowingUnitPlantRemovedEvent on remove by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);

      aggregate.removePlant(plant);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantRemovedEvent);

      const event = events[0] as GrowingUnitPlantRemovedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.growingUnitId).toBe(props.id.value);
      expect(event.data.plant.id).toBe(plant.id.value);
    });

    it('should not emit GrowingUnitPlantRemovedEvent when generateEvent is false', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);

      aggregate.removePlant(plant, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('changePlantStatus', () => {
    it('should change the status of a plant', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      aggregate.changePlantStatus(plant.id.value, newStatus, false);

      expect(aggregate.getPlantById(plant.id.value)?.status.value).toBe(
        PlantStatusEnum.GROWING,
      );
    });

    it('should emit GrowingUnitPlantStatusChangedEvent on change by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      aggregate.changePlantStatus(plant.id.value, newStatus);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantStatusChangedEvent);

      const event = events[0] as GrowingUnitPlantStatusChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(plant.id.value);
      expect(event.data.oldValue).toBe(PlantStatusEnum.PLANTED);
      expect(event.data.newValue).toBe(PlantStatusEnum.GROWING);
    });

    it('should not change status if plant is not found', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newStatus = new PlantStatusValueObject(PlantStatusEnum.GROWING);

      aggregate.changePlantStatus('non-existent-id', newStatus, false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('changePlantName', () => {
    it('should change the name of a plant', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newName = new PlantNameValueObject('Basil');

      aggregate.changePlantName(plant.id.value, newName, false);

      expect(aggregate.getPlantById(plant.id.value)?.name.value).toBe('Basil');
    });

    it('should emit GrowingUnitPlantNameChangedEvent on change by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newName = new PlantNameValueObject('Basil');

      aggregate.changePlantName(plant.id.value, newName);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantNameChangedEvent);

      const event = events[0] as GrowingUnitPlantNameChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(plant.id.value);
      expect(event.data.oldValue).toBe('Aloe Vera');
      expect(event.data.newValue).toBe('Basil');
    });
  });

  describe('changePlantSpecies', () => {
    it('should change the species of a plant', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newSpecies = new PlantSpeciesValueObject('Ocimum basilicum');

      aggregate.changePlantSpecies(plant.id.value, newSpecies, false);

      expect(aggregate.getPlantById(plant.id.value)?.species.value).toBe(
        'Ocimum basilicum',
      );
    });

    it('should emit GrowingUnitPlantSpeciesChangedEvent on change by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newSpecies = new PlantSpeciesValueObject('Ocimum basilicum');

      aggregate.changePlantSpecies(plant.id.value, newSpecies);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantSpeciesChangedEvent);

      const event = events[0] as GrowingUnitPlantSpeciesChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(plant.id.value);
      expect(event.data.oldValue).toBe('Aloe barbadensis');
      expect(event.data.newValue).toBe('Ocimum basilicum');
    });
  });

  describe('changePlantPlantedDate', () => {
    it('should change the planted date of a plant', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newPlantedDate = new PlantPlantedDateValueObject(
        new Date('2024-02-15'),
      );

      aggregate.changePlantPlantedDate(plant.id.value, newPlantedDate, false);

      expect(
        aggregate.getPlantById(plant.id.value)?.plantedDate?.value,
      ).toEqual(newPlantedDate.value);
    });

    it('should emit GrowingUnitPlantPlantedDateChangedEvent on change by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newPlantedDate = new PlantPlantedDateValueObject(
        new Date('2024-02-15'),
      );

      aggregate.changePlantPlantedDate(plant.id.value, newPlantedDate);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantPlantedDateChangedEvent);
    });
  });

  describe('changePlantNotes', () => {
    it('should change the notes of a plant', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newNotes = new PlantNotesValueObject('Updated notes');

      aggregate.changePlantNotes(plant.id.value, newNotes, false);

      expect(aggregate.getPlantById(plant.id.value)?.notes.value).toBe(
        'Updated notes',
      );
    });

    it('should emit GrowingUnitPlantNotesChangedEvent on change by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newNotes = new PlantNotesValueObject('Updated notes');

      aggregate.changePlantNotes(plant.id.value, newNotes);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantNotesChangedEvent);

      const event = events[0] as GrowingUnitPlantNotesChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(plant.id.value);
      expect(event.data.oldValue).toBe('Keep in indirect sunlight');
      expect(event.data.newValue).toBe('Updated notes');
    });
  });

  describe('changePlantGrowingUnit', () => {
    it('should change the growing unit of a plant', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newGrowingUnitId = new GrowingUnitUuidValueObject(
        '423e4567-e89b-12d3-a456-426614174000',
      );

      aggregate.changePlantGrowingUnit(plant.id.value, newGrowingUnitId, false);

      expect(aggregate.getPlantById(plant.id.value)?.growingUnitId.value).toBe(
        newGrowingUnitId.value,
      );
    });

    it('should emit GrowingUnitPlantGrowingUnitChangedEvent on change by default', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newGrowingUnitId = new GrowingUnitUuidValueObject(
        '423e4567-e89b-12d3-a456-426614174000',
      );

      aggregate.changePlantGrowingUnit(plant.id.value, newGrowingUnitId);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitPlantGrowingUnitChangedEvent);

      const event = events[0] as GrowingUnitPlantGrowingUnitChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(plant.id.value);
      expect(event.data.oldValue).toBe(props.id.value);
      expect(event.data.newValue).toBe(newGrowingUnitId.value);
    });
  });

  describe('changeName', () => {
    it('should change the name of the growing unit', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newName = new GrowingUnitNameValueObject('Garden Bed 2');

      aggregate.changeName(newName, false);

      expect(aggregate.name.value).toBe('Garden Bed 2');
    });

    it('should emit GrowingUnitNameChangedEvent on change by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newName = new GrowingUnitNameValueObject('Garden Bed 2');

      aggregate.changeName(newName);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitNameChangedEvent);

      const event = events[0] as GrowingUnitNameChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(props.id.value);
      expect(event.data.oldValue).toBe('Garden Bed 1');
      expect(event.data.newValue).toBe('Garden Bed 2');
    });
  });

  describe('changeType', () => {
    it('should change the type of the growing unit', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newType = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);

      aggregate.changeType(newType, false);

      expect(aggregate.type.value).toBe(GrowingUnitTypeEnum.POT);
    });

    it('should emit GrowingUnitTypeChangedEvent on change by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newType = new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.POT);

      aggregate.changeType(newType);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitTypeChangedEvent);

      const event = events[0] as GrowingUnitTypeChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(props.id.value);
      expect(event.data.oldValue).toBe(GrowingUnitTypeEnum.GARDEN_BED);
      expect(event.data.newValue).toBe(GrowingUnitTypeEnum.POT);
    });
  });

  describe('changeCapacity', () => {
    it('should change the capacity of the growing unit', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newCapacity = new GrowingUnitCapacityValueObject(20);

      aggregate.changeCapacity(newCapacity, false);

      expect(aggregate.capacity.value).toBe(20);
    });

    it('should emit GrowingUnitCapacityChangedEvent on change by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newCapacity = new GrowingUnitCapacityValueObject(20);

      aggregate.changeCapacity(newCapacity);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitCapacityChangedEvent);

      const event = events[0] as GrowingUnitCapacityChangedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.data.id).toBe(props.id.value);
      expect(event.data.oldValue).toBe(10);
      expect(event.data.newValue).toBe(20);
    });
  });

  describe('changeDimensions', () => {
    it('should change the dimensions of the growing unit', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newDimensions = new DimensionsValueObject({
        length: 200,
        width: 100,
        height: 50,
        unit: LengthUnitEnum.CENTIMETER,
      });

      aggregate.changeDimensions(newDimensions, false);

      expect(aggregate.dimensions?.toPrimitives()).toEqual(
        newDimensions.toPrimitives(),
      );
    });

    it('should emit GrowingUnitDimensionsChangedEvent on change by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);
      const newDimensions = new DimensionsValueObject({
        length: 200,
        width: 100,
        height: 50,
        unit: LengthUnitEnum.CENTIMETER,
      });

      aggregate.changeDimensions(newDimensions);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitDimensionsChangedEvent);
    });

    it('should handle null old dimensions when changing dimensions', () => {
      const props = createProps({ dimensions: null });
      const aggregate = new GrowingUnitAggregate(props, false);
      const newDimensions = new DimensionsValueObject({
        length: 200,
        width: 100,
        height: 50,
        unit: LengthUnitEnum.CENTIMETER,
      });

      aggregate.changeDimensions(newDimensions);

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      const event = events[0] as GrowingUnitDimensionsChangedEvent;
      expect(event.data.oldValue).toBeNull();
    });
  });

  describe('delete', () => {
    it('should emit GrowingUnitDeletedEvent on delete by default', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      aggregate.delete();

      const events = aggregate.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(GrowingUnitDeletedEvent);

      const event = events[0] as GrowingUnitDeletedEvent;
      expect(event.aggregateId).toBe(props.id.value);
      expect(event.aggregateType).toBe(GrowingUnitAggregate.name);
      expect(event.eventType).toBe(GrowingUnitDeletedEvent.name);
      expect(event.data).toEqual(aggregate.toPrimitives());
    });

    it('should not emit GrowingUnitDeletedEvent when generateEvent is false', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      aggregate.delete(false);

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });
  });

  describe('getPlantById', () => {
    it('should return the plant with the given id', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);

      const foundPlant = aggregate.getPlantById(plant.id.value);

      expect(foundPlant).not.toBeNull();
      expect(foundPlant?.id.value).toBe(plant.id.value);
    });

    it('should return null if plant is not found', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      const foundPlant = aggregate.getPlantById('non-existent-id');

      expect(foundPlant).toBeNull();
    });
  });

  describe('hasCapacity', () => {
    it('should return true when there is remaining capacity', () => {
      const props = createProps({
        capacity: new GrowingUnitCapacityValueObject(10),
      });
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.hasCapacity()).toBe(true);
    });

    it('should return false when capacity is full', () => {
      const plants = Array.from({ length: 10 }, (_, i) =>
        createPlantEntity({
          id: new PlantUuidValueObject(
            `${i}33e4567-e89b-12d3-a456-42661417400`,
          ),
        }),
      );
      const props = createProps({
        capacity: new GrowingUnitCapacityValueObject(10),
        plants,
      });
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.hasCapacity()).toBe(false);
    });
  });

  describe('getRemainingCapacity', () => {
    it('should return the correct remaining capacity', () => {
      const props = createProps({
        capacity: new GrowingUnitCapacityValueObject(10),
      });
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.getRemainingCapacity()).toBe(10);
    });

    it('should return 0 when capacity is full', () => {
      const plants = Array.from({ length: 10 }, (_, i) =>
        createPlantEntity({
          id: new PlantUuidValueObject(
            `${i}33e4567-e89b-12d3-a456-42661417400`,
          ),
        }),
      );
      const props = createProps({
        capacity: new GrowingUnitCapacityValueObject(10),
        plants,
      });
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.getRemainingCapacity()).toBe(0);
    });
  });

  describe('getters', () => {
    it('should expose value objects through getters', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      expect(aggregate.id).toBeInstanceOf(GrowingUnitUuidValueObject);
      expect(aggregate.name).toBeInstanceOf(GrowingUnitNameValueObject);
      expect(aggregate.type).toBeInstanceOf(GrowingUnitTypeValueObject);
      expect(aggregate.capacity).toBeInstanceOf(GrowingUnitCapacityValueObject);
      if (aggregate.dimensions) {
        expect(aggregate.dimensions).toBeInstanceOf(DimensionsValueObject);
      }
      expect(Array.isArray(aggregate.plants)).toBe(true);
    });
  });

  describe('toPrimitives', () => {
    it('should convert aggregate to primitives correctly', () => {
      const props = createProps();
      const aggregate = new GrowingUnitAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives).toEqual({
        id: props.id.value,
        name: props.name.value,
        type: props.type.value,
        capacity: props.capacity.value,
        dimensions: props.dimensions?.toPrimitives() ?? null,
        plants: props.plants.map((plant) => plant.toPrimitives()),
      });
    });

    it('should convert aggregate to primitives with null dimensions', () => {
      const props = createProps({ dimensions: null });
      const aggregate = new GrowingUnitAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.dimensions).toBeNull();
    });

    it('should convert aggregate to primitives with plants', () => {
      const plant = createPlantEntity();
      const props = createProps({ plants: [plant] });
      const aggregate = new GrowingUnitAggregate(props, false);

      const primitives = aggregate.toPrimitives();

      expect(primitives.plants).toHaveLength(1);
      expect(primitives.plants[0]).toEqual(plant.toPrimitives());
    });
  });
});
