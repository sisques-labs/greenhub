import { IContainerCreateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-create/container-create.dto';
import { IContainerUpdateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-update/container-update.dto';
import { ContainerPrimitives } from '@/core/plant-context/containers/domain/primitives/container.primitives';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { BaseAggregate } from '@/shared/domain/aggregates/base-aggregate/base.aggregate';
import { ContainerCreatedEvent } from '@/shared/domain/events/features/containers/container-created/container-created.event';
import { ContainerDeletedEvent } from '@/shared/domain/events/features/containers/container-deleted/container-deleted.event';
import { ContainerUpdatedEvent } from '@/shared/domain/events/features/containers/container-updated/container-updated.event';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Aggregate root for the Container domain entity.
 *
 * @remarks
 * Encapsulates all domain logic for a container entity, manages its lifecycle,
 * and generates domain events corresponding to changes in the container.
 */
export class ContainerAggregate extends BaseAggregate {
  private readonly _id: ContainerUuidValueObject;
  private _name: ContainerNameValueObject;
  private _type: ContainerTypeValueObject;

  /**
   * Creates an instance of ContainerAggregate.
   *
   * @param props - Properties used to initialize the container aggregate.
   * @param generateEvent - Whether to emit a ContainerCreatedEvent. Defaults to `true`.
   */
  constructor(props: IContainerCreateDto, generateEvent: boolean = true) {
    super(props.createdAt, props.updatedAt);

    // Initialize value objects from input DTO
    this._id = props.id;
    this._name = props.name;
    this._type = props.type;

    // Optionally emit the creation domain event
    if (generateEvent) {
      this.apply(
        new ContainerCreatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: ContainerAggregate.name,
            eventType: ContainerCreatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Updates container properties.
   *
   * @param props - Properties to update on the container aggregate.
   * @param generateEvent - Whether to emit a ContainerUpdatedEvent. Defaults to `true`.
   */
  public update(props: IContainerUpdateDto, generateEvent: boolean = true) {
    // Update only properties provided (including explicit nulls).
    this._name = props.name !== undefined ? props.name : this._name;
    this._type = props.type !== undefined ? props.type : this._type;

    this._updatedAt = new DateValueObject(new Date());

    // Optionally emit the update domain event
    if (generateEvent) {
      this.apply(
        new ContainerUpdatedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: ContainerAggregate.name,
            eventType: ContainerUpdatedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Marks the container as deleted and emits a ContainerDeletedEvent if specified.
   *
   * @param generateEvent - Whether to emit a ContainerDeletedEvent. Defaults to `true`.
   */
  public delete(generateEvent: boolean = true) {
    if (generateEvent) {
      this.apply(
        new ContainerDeletedEvent(
          {
            aggregateId: this._id.value,
            aggregateType: ContainerAggregate.name,
            eventType: ContainerDeletedEvent.name,
          },
          this.toPrimitives(),
        ),
      );
    }
  }

  /**
   * Gets the unique identifier of the container.
   *
   * @returns The container's unique identifier value object.
   */
  public get id(): ContainerUuidValueObject {
    return this._id;
  }

  /**
   * Gets the name of the container.
   *
   * @returns The container's name value object.
   */
  public get name(): ContainerNameValueObject {
    return this._name;
  }

  /**
   * Gets the type of the container.
   *
   * @returns The container's type value object.
   */
  public get type(): ContainerTypeValueObject {
    return this._type;
  }

  /**
   * Converts the container aggregate to a primitive object representation.
   *
   * @returns An object containing primitive values representing the container.
   */
  public toPrimitives(): ContainerPrimitives {
    return {
      id: this._id.value,
      name: this._name.value,
      type: this._type.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
