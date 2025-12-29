import { IGrowingUnitDto } from '@/core/plant-context/domain/dtos/entities/growing-unit/growing-unit.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { GrowingUnitPrimitives } from '@/core/plant-context/domain/primitives/growing-unit.primitives';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { PlantNameValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/domain/value-objects/plant/plant-status/plant-status.vo';
import { GrowingUnitCapacityChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-capacity-changed/growing-unit-capacity-changed.event';
import { GrowingUnitDimensionsChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-dimensions-changed/growing-unit-dimensions-changed.event';
import { GrowingUnitNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-name-changed/growing-unit-name-changed.event';
import { GrowingUnitTypeChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/field-changed/growing-unit-type-changed/growing-unit-type-changed.event';
import { GrowingUnitCreatedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-created/growing-unit-created.event';
import { GrowingUnitDeletedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-deleted/growing-unit-deleted.event';
import { GrowingUnitPlantAddedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-plant-added/growing-unit-plant-added.event';
import { GrowingUnitPlantRemovedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/growing-unit/growing-unit-plant-removed/growing-unit-plant-removed.event';
import { GrowingUnitPlantGrowingUnitChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-growing-unit-changed/growing-unit-plant-growing-unit-changed.event';
import { GrowingUnitPlantNameChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-name-changed/growing-unit-plant-name-changed.event';
import { GrowingUnitPlantNotesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-notes-changed/growing-unit-plant-notes-changed.event';
import { GrowingUnitPlantPlantedDateChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-planted-date-changed/growing-unit-plant-planted-date-changed.event';
import { GrowingUnitPlantSpeciesChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-species-changed/growing-unit-plant-species-changed.event';
import { GrowingUnitPlantStatusChangedEvent } from '@/shared/domain/events/features/plant-context/growing-unit/plant/field-changed/growing-unit-plant-status-changed/growing-unit-plant-status-changed.event';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { AggregateRoot } from '@nestjs/cqrs';

/**
 * The aggregate root representing a growing unit, which manages a collection of plants
 * and their life-cycle domain events within the plant context.
 *
 * @remarks
 *  - Handles changes to plants within the unit.
 *  - Emits domain events for state changes.
 */
export class GrowingUnitAggregate extends AggregateRoot {
  /**
   * The unique identifier of this growing unit.
   */
  private readonly _id: GrowingUnitUuidValueObject;
  /**
   * The name of this growing unit.
   */
  private _name: GrowingUnitNameValueObject;
  /**
   * The type of this growing unit.
   */
  private _type: GrowingUnitTypeValueObject;
  /**
   * The capacity of this growing unit.
   */
  private _capacity: GrowingUnitCapacityValueObject;

  /**
   * The dimensions of this growing unit (length, width, height).
   */
  private _dimensions: DimensionsValueObject | null;

  /**
   * The plants in this growing unit.
   */
  private _plants: PlantEntity[];

  /**
   * Creates a new GrowingUnitAggregate.
   *
   * @param props - The properties to initialize the growing unit with.
   * @param generateEvent - Whether or not to generate a GrowingUnitCreatedEvent.
   */
  constructor(props: IGrowingUnitDto, generateEvent: boolean = true) {
    super();

    this._id = props.id;
    this._name = props.name;
    this._type = props.type;
    this._capacity = props.capacity;
    this._dimensions = props.dimensions ?? null;
    this._plants = props.plants;

    if (generateEvent) {
      this.apply(
        new GrowingUnitCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Adds a plant to this growing unit.
   * @param plantToAdd - The plant entity to add.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public addPlant(plantToAdd: PlantEntity, generateEvent: boolean = true) {
    this._plants.push(plantToAdd);
    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantAddedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantAddedEvent.name,
          },
          {
            growingUnitId: this._id.value,
            plant: plantToAdd.toPrimitives(),
          },
        ),
      );
    }
  }

  /**
   * Removes a plant from this growing unit.
   * @param plantToRemove - The plant entity to remove.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public removePlant(
    plantToRemove: PlantEntity,
    generateEvent: boolean = true,
  ) {
    const plantPrimitives = plantToRemove.toPrimitives();
    this._plants = this._plants.filter(
      (plant) => plant.id !== plantToRemove.id,
    );
    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantRemovedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantRemovedEvent.name,
          },
          {
            growingUnitId: this._id.value,
            plant: plantPrimitives,
          },
        ),
      );
    }
  }

  /**
   * Changes the status value object of a plant in this growing unit.
   * @param plantId - The ID of the plant to update.
   * @param status - The new status value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changePlantStatus(
    plantId: string,
    status: PlantStatusValueObject,
    generateEvent: boolean = true,
  ) {
    const plant = this.getPlantById(plantId);
    if (!plant) {
      return;
    }

    const oldValue = plant.status.value;
    plant.changeStatus(status);

    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantStatusChangedEvent.name,
          },
          {
            id: plantId,
            oldValue,
            newValue: plant.status.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the name value object of a plant in this growing unit.
   * @param plantId - The ID of the plant to update.
   * @param name - The new name value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changePlantName(
    plantId: string,
    name: PlantNameValueObject,
    generateEvent: boolean = true,
  ) {
    const plant = this.getPlantById(plantId);
    if (!plant) {
      return;
    }

    const oldValue = plant.name.value;
    plant.changeName(name);

    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantNameChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantNameChangedEvent.name,
          },
          {
            id: plantId,
            oldValue,
            newValue: plant.name.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the species value object of a plant in this growing unit.
   * @param plantId - The ID of the plant to update.
   * @param species - The new species value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changePlantSpecies(
    plantId: string,
    species: PlantSpeciesValueObject,
    generateEvent: boolean = true,
  ) {
    const plant = this.getPlantById(plantId);
    if (!plant) {
      return;
    }

    const oldValue = plant.species.value;
    plant.changeSpecies(species);

    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantSpeciesChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantSpeciesChangedEvent.name,
          },
          {
            id: plantId,
            oldValue,
            newValue: plant.species.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the planted date value object of a plant in this growing unit.
   * @param plantId - The ID of the plant to update.
   * @param plantedDate - The new planted date value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changePlantPlantedDate(
    plantId: string,
    plantedDate: PlantPlantedDateValueObject,
    generateEvent: boolean = true,
  ) {
    const plant = this.getPlantById(plantId);
    if (!plant) {
      return;
    }

    const oldValue = plant.plantedDate.value;
    plant.changePlantedDate(plantedDate);

    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantPlantedDateChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantPlantedDateChangedEvent.name,
          },
          {
            id: plantId,
            oldValue,
            newValue: plant.plantedDate.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the notes value object of a plant in this growing unit.
   * @param plantId - The ID of the plant to update.
   * @param notes - The new notes value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changePlantNotes(
    plantId: string,
    notes: PlantNotesValueObject,
    generateEvent: boolean = true,
  ) {
    const plant = this.getPlantById(plantId);
    if (!plant) {
      return;
    }

    const oldValue = plant.notes.value;
    plant.changeNotes(notes);

    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantNotesChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantNotesChangedEvent.name,
          },
          {
            id: plantId,
            oldValue,
            newValue: plant.notes.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the growing unit association of a plant (moves plant to another unit).
   * @param plantId - The ID of the plant to update.
   * @param newGrowingUnitId - The new growing unit ID value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changePlantGrowingUnit(
    plantId: string,
    newGrowingUnitId: GrowingUnitUuidValueObject,
    generateEvent: boolean = true,
  ) {
    const plant = this.getPlantById(plantId);
    if (!plant) {
      return;
    }

    const oldValue = plant.growingUnitId.value;
    plant.changeGrowingUnit(newGrowingUnitId);

    if (generateEvent) {
      this.apply(
        new GrowingUnitPlantGrowingUnitChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitPlantGrowingUnitChangedEvent.name,
          },
          {
            id: plantId,
            oldValue,
            newValue: plant.growingUnitId.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the name of this growing unit.
   * @param name - The new name value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changeName(
    name: GrowingUnitNameValueObject,
    generateEvent: boolean = true,
  ) {
    const oldValue = this._name.value;
    this._name = name;
    if (generateEvent) {
      this.apply(
        new GrowingUnitNameChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitNameChangedEvent.name,
          },
          {
            id: this._id.value,
            oldValue,
            newValue: this._name.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the type of this growing unit.
   * @param type - The new type value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changeType(
    type: GrowingUnitTypeValueObject,
    generateEvent: boolean = true,
  ) {
    const oldValue = this._type.value;
    this._type = type;

    if (generateEvent) {
      this.apply(
        new GrowingUnitTypeChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitTypeChangedEvent.name,
          },
          {
            id: this._id.value,
            oldValue,
            newValue: this._type.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the capacity of this growing unit.
   * @param capacity - The new capacity value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changeCapacity(
    capacity: GrowingUnitCapacityValueObject,
    generateEvent: boolean = true,
  ) {
    const oldValue = this._capacity.value;
    this._capacity = capacity;

    if (generateEvent) {
      this.apply(
        new GrowingUnitCapacityChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitCapacityChangedEvent.name,
          },
          {
            id: this._id.value,
            oldValue,
            newValue: this._capacity.value,
          },
        ),
      );
    }
  }

  /**
   * Changes the dimensions of this growing unit.
   * @param dimensions - The new dimensions value object.
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public changeDimensions(
    dimensions: DimensionsValueObject,
    generateEvent: boolean = true,
  ) {
    const oldValue = this._dimensions?.toPrimitives() ?? null;
    this._dimensions = dimensions;

    if (generateEvent) {
      this.apply(
        new GrowingUnitDimensionsChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitDimensionsChangedEvent.name,
          },
          {
            id: this._id.value,
            oldValue,
            newValue: this._dimensions.toPrimitives(),
          },
        ),
      );
    }
  }

  /**
   * Marks this growing unit as deleted (soft-delete).
   * @param generateEvent - Whether to emit the corresponding domain event.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new GrowingUnitDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: GrowingUnitAggregate.name,
            eventType: GrowingUnitDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Returns the plant entity with the given plant ID.
   * @param plantId - The string representation of the plant identifier value object.
   * @returns The PlantEntity if found, null otherwise.
   */
  public getPlantById(plantId: string): PlantEntity | null {
    return this._plants.find((plant) => plant.id.value === plantId) || null;
  }

  /**
   * Checks if there is remaining plant capacity in this unit.
   * @returns True if at least one slot is available, false otherwise.
   */
  public hasCapacity(): boolean {
    return this._capacity.hasCapacity(this._plants.length);
  }

  /**
   * Calculates the remaining number of plant slots available in this unit.
   * @returns Number of available slots.
   */
  public getRemainingCapacity(): number {
    return this._capacity.getRemainingCapacity(this._plants.length);
  }

  /**
   * The unique identifier of this growing unit.
   */
  public get id(): GrowingUnitUuidValueObject {
    return this._id;
  }

  /**
   * The name of this growing unit.
   */
  public get name(): GrowingUnitNameValueObject {
    return this._name;
  }

  /**
   * The type of this growing unit.
   */
  public get type(): GrowingUnitTypeValueObject {
    return this._type;
  }

  /**
   * The capacity value object for this growing unit.
   */
  public get capacity(): GrowingUnitCapacityValueObject {
    return this._capacity;
  }

  /**
   * The dimensions value object for this growing unit.
   */
  public get dimensions(): DimensionsValueObject | null {
    return this._dimensions;
  }

  /**
   * Gets the collection of current plants in this growing unit.
   */
  public get plants(): PlantEntity[] {
    return this._plants;
  }

  /**
   * Converts the growing unit to its primitive representation for serialization.
   * @returns Primitives representing the growing unit.
   */
  public toPrimitives(): GrowingUnitPrimitives {
    return {
      id: this._id.value,
      name: this._name.value,
      type: this._type.value,
      capacity: this._capacity.value,
      dimensions: this._dimensions?.toPrimitives() ?? null,
      plants: this._plants.map((plant) => plant.toPrimitives()),
    };
  }
}
