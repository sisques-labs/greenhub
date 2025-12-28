import { IPlantCreateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-create/plant-create.dto';
import { IPlantUpdateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-update/plant-update.dto';
import { PlantPrimitives } from '@/core/plant-context/plants/domain/primitives/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { PlantContainerChangedEvent } from '@/shared/domain/events/features/plants/plant-container-changed/plant-container-changed.event';
import { PlantCreatedEvent } from '@/shared/domain/events/features/plants/plant-created/plant-created.event';
import { PlantDeletedEvent } from '@/shared/domain/events/features/plants/plant-deleted/plant-deleted.event';
import { PlantStatusChangedEvent } from '@/shared/domain/events/features/plants/plant-status-changed/plant-status-changed.event';
import { PlantUpdatedEvent } from '@/shared/domain/events/features/plants/plant-updated/plant-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Aggregate root for the Plant domain entity.
 *
 * @remarks
 * Encapsulates all domain logic for a plant entity, manages its lifecycle,
 * and generates domain events corresponding to changes in the plant.
 */
export class PlantAggregate extends BaseAggregate {
  private readonly _id: PlantUuidValueObject;
  private _containerId: ContainerUuidValueObject;
  private _name: PlantNameValueObject;
  private _species: PlantSpeciesValueObject;
  private _plantedDate: PlantPlantedDateValueObject | null;
  private _notes: PlantNotesValueObject | null;
  private _status: PlantStatusValueObject;

  /**
   * Creates an instance of PlantAggregate.
   *
   * @param props - Properties used to initialize the plant aggregate.
   * @param generateEvent - Whether to emit a PlantCreatedEvent. Defaults to `true`.
   */
  constructor(props: IPlantCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);

    // Initialize value objects from input DTO
    this._id = props.id;
    this._containerId = props.containerId;
    this._name = props.name;
    this._species = props.species;
    this._plantedDate = props.plantedDate;
    this._notes = props.notes;
    this._status = props.status;

    // Optionally emit the creation domain event
    if (generateEvent) {
      this.apply(
        new PlantCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PlantAggregate.name,
            eventType: PlantCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Updates plant properties.
   *
   * @param props - Properties to update on the plant aggregate.
   * @param generateEvent - Whether to emit a PlantUpdatedEvent. Defaults to `true`.
   */
  public update(props: IPlantUpdateDto, generateEvent: boolean = true) {
    // Update only properties provided (including explicit nulls).
    this._containerId =
      props.containerId !== undefined ? props.containerId : this._containerId;
    this._name = props.name !== undefined ? props.name : this._name;
    this._species = props.species !== undefined ? props.species : this._species;
    this._plantedDate =
      props.plantedDate !== undefined ? props.plantedDate : this._plantedDate;
    this._notes = props.notes !== undefined ? props.notes : this._notes;
    this._status = props.status !== undefined ? props.status : this._status;

    this._updatedAt = new DateValueObject(new Date());

    // Optionally emit the update domain event
    if (generateEvent) {
      this.apply(
        new PlantUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PlantAggregate.name,
            eventType: PlantUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Marks the plant as deleted and emits a PlantDeletedEvent if specified.
   *
   * @param generateEvent - Whether to emit a PlantDeletedEvent. Defaults to `true`.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new PlantDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PlantAggregate.name,
            eventType: PlantDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Changes the status of the plant and emits a PlantStatusChangedEvent if specified.
   *
   * @param status - The new plant status value object.
   * @param generateEvent - Whether to emit a PlantStatusChangedEvent. Defaults to `true`.
   */
  public changeStatus(
    status: PlantStatusValueObject,
    generateEvent: boolean = true,
  ) {
    this._status = status;
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      this.apply(
        new PlantStatusChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PlantAggregate.name,
            eventType: PlantStatusChangedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Changes the container of the plant and emits a PlantContainerChangedEvent if specified.
   *
   * @param newContainerId - The new container identifier value object.
   * @param generateEvent - Whether to emit a PlantContainerChangedEvent. Defaults to `true`.
   */
  public changeContainer(
    newContainerId: ContainerUuidValueObject,
    generateEvent: boolean = true,
  ) {
    const oldContainerId = this._containerId;
    this._containerId = newContainerId;
    this._updatedAt = new DateValueObject(new Date());

    if (generateEvent) {
      const primitives = this.toPrimitives();
      this.apply(
        new PlantContainerChangedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: PlantAggregate.name,
            eventType: PlantContainerChangedEvent.name,
          },
          {
            ...primitives,
            oldContainerId: oldContainerId.value,
            newContainerId: newContainerId.value,
          },
        ),
      );
    }
  }

  /**
   * Gets the unique identifier of the plant.
   *
   * @returns The plant's unique identifier value object.
   */
  public get id(): PlantUuidValueObject {
    return this._id;
  }

  /**
   * Gets the container identifier of the plant, or null if not assigned.
   *
   * @returns The container's unique identifier value object or null.
   */
  public get containerId(): ContainerUuidValueObject {
    return this._containerId;
  }

  /**
   * Gets the name of the plant.
   *
   * @returns The plant's name value object.
   */
  public get name(): PlantNameValueObject {
    return this._name;
  }

  /**
   * Gets the species of the plant.
   *
   * @returns The species value object.
   */
  public get species(): PlantSpeciesValueObject {
    return this._species;
  }

  /**
   * Gets the planted date of the plant, or null if not set.
   *
   * @returns The planted date value object or null.
   */
  public get plantedDate(): PlantPlantedDateValueObject | null {
    return this._plantedDate;
  }

  /**
   * Gets the notes associated with the plant, or null if not set.
   *
   * @returns The notes value object or null.
   */
  public get notes(): PlantNotesValueObject | null {
    return this._notes;
  }

  /**
   * Gets the status of the plant.
   *
   * @returns The status value object.
   */
  public get status(): PlantStatusValueObject {
    return this._status;
  }

  /**
   * Converts the plant aggregate to a primitive object representation.
   *
   * @returns An object containing primitive values representing the plant.
   */
  public toPrimitives(): PlantPrimitives {
    return {
      id: this._id.value,
      containerId: this._containerId.value,
      name: this._name.value,
      species: this._species.value,
      plantedDate: this._plantedDate ? this._plantedDate.value : null,
      notes: this._notes ? this._notes.value : null,
      status: this._status.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
