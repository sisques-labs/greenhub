import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { IPlantCreateDto } from '@/core/plant-context/plants/domain/dtos/entities/plant-create/plant-create.dto';
import { PlantPrimitives } from '@/core/plant-context/plants/domain/primitives/plant.primitives';
import { PlantNameValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-name/plant-name.vo';
import { PlantNotesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-notes/plant-notes.vo';
import { PlantPlantedDateValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-planted-date/plant-planted-date.vo';
import { PlantSpeciesValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-species/plant-species.vo';
import { PlantStatusValueObject } from '@/core/plant-context/plants/domain/value-objects/plant-status/plant-status.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';
import { Injectable } from '@nestjs/common';

/**
 * Factory responsible for creating {@link PlantAggregate} entities.
 *
 * @remarks
 * This factory encapsulates logic for constructing `PlantAggregate`
 * instances from DTOs or primitive values. It utilizes value objects to
 * enforce invariants, encapsulate domain logic, and ensure the integrity of plant data.
 *
 * @example
 * const plantAggregate = plantAggregateFactory.create(plantCreateDto);
 *
 * @see PlantAggregate
 */
@Injectable()
export class PlantAggregateFactory
  implements IWriteFactory<PlantAggregate, IPlantCreateDto>
{
  /**
   * Creates a new {@link PlantAggregate} entity using the provided DTO data.
   *
   * @param data - The plant creation data transfer object
   * @param generateEvent - Whether to generate a creation event for the aggregate (default: true)
   * @returns The created PlantAggregate entity
   */
  public create(
    data: IPlantCreateDto,
    generateEvent: boolean = true,
  ): PlantAggregate {
    return new PlantAggregate(data, generateEvent);
  }

  /**
   * Creates a new {@link PlantAggregate} entity from its primitive property values.
   *
   * @param data - The primitive values representing a plant aggregate
   * @param data.id - UUID string representing the plant identifier
   * @param data.name - Name of the plant
   * @param data.species - Species of the plant
   * @param data.plantedDate - Date when the plant was planted (nullable)
   * @param data.notes - Notes related to the plant (nullable)
   * @param data.status - Status of the plant
   * @param data.createdAt - Date when the plant was created
   * @param data.updatedAt - Date when the plant was last updated
   * @returns The created PlantAggregate entity using value objects mapped from the provided primitives
   */
  public fromPrimitives(data: PlantPrimitives): PlantAggregate {
    return new PlantAggregate(
      {
        id: new PlantUuidValueObject(data.id),
        containerId: new ContainerUuidValueObject(data.containerId),
        name: new PlantNameValueObject(data.name),
        species: new PlantSpeciesValueObject(data.species),
        plantedDate: data.plantedDate
          ? new PlantPlantedDateValueObject(data.plantedDate)
          : null,
        notes: data.notes ? new PlantNotesValueObject(data.notes) : null,
        status: new PlantStatusValueObject(data.status),
        createdAt: new DateValueObject(data.createdAt),
        updatedAt: new DateValueObject(data.updatedAt),
      },
      false,
    );
  }
}
