import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { IContainerCreateDto } from '@/core/plant-context/containers/domain/dtos/entities/container-create/container-create.dto';
import { ContainerPrimitives } from '@/core/plant-context/containers/domain/primitives/container.primitives';
import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory responsible for creating {@link ContainerAggregate} entities.
 *
 * @remarks
 * This factory encapsulates logic for constructing `ContainerAggregate`
 * instances from DTOs or primitive values. It utilizes value objects to
 * enforce invariants, encapsulate domain logic, and ensure the integrity of container data.
 *
 * @example
 * const containerAggregate = containerAggregateFactory.create(containerCreateDto);
 *
 * @see ContainerAggregate
 */
@Injectable()
export class ContainerAggregateFactory
  implements IWriteFactory<ContainerAggregate, IContainerCreateDto>
{
  /**
   * Creates a new {@link ContainerAggregate} entity using the provided DTO data.
   *
   * @param data - The container creation data transfer object
   * @param generateEvent - Whether to generate a creation event for the aggregate (default: true)
   * @returns The created ContainerAggregate entity
   */
  public create(
    data: IContainerCreateDto,
    generateEvent: boolean = true,
  ): ContainerAggregate {
    return new ContainerAggregate(data, generateEvent);
  }

  /**
   * Creates a new {@link ContainerAggregate} entity from its primitive property values.
   *
   * @param data - The primitive values representing a container aggregate
   * @param data.id - UUID string representing the container identifier
   * @param data.name - Name of the container
   * @param data.type - Type of the container
   * @param data.createdAt - Date when the container was created
   * @param data.updatedAt - Date when the container was last updated
   * @returns The created ContainerAggregate entity using value objects mapped from the provided primitives
   */
  public fromPrimitives(data: ContainerPrimitives): ContainerAggregate {
    return new ContainerAggregate(
      {
        id: new ContainerUuidValueObject(data.id),
        name: new ContainerNameValueObject(data.name),
        type: new ContainerTypeValueObject(data.type),
        createdAt: new DateValueObject(data.createdAt),
        updatedAt: new DateValueObject(data.updatedAt),
      },
      false,
    );
  }
}
