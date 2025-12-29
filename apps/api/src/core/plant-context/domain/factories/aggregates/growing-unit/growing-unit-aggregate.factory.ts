import { Injectable, Logger } from '@nestjs/common';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { IGrowingUnitDto } from '@/core/plant-context/domain/dtos/entities/growing-unit/growing-unit.dto';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { GrowingUnitPrimitives } from '@/core/plant-context/domain/primitives/growing-unit.primitives';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

/**
 * Factory responsible for creating {@link GrowingUnitAggregate} entities.
 *
 * @remarks
 * This factory encapsulates logic for constructing `GrowingUnitAggregate`
 * instances from DTOs or primitive values. It utilizes value objects to
 * enforce invariants, encapsulate domain logic, and ensure the integrity of growing unit data.
 *
 * @example
 * ```typescript
 * const growingUnitAggregate = growingUnitAggregateFactory.create(growingUnitCreateDto);
 * ```
 *
 * @see GrowingUnitAggregate
 */
@Injectable()
export class GrowingUnitAggregateFactory
  implements IWriteFactory<GrowingUnitAggregate, IGrowingUnitDto>
{
  private readonly logger = new Logger(GrowingUnitAggregateFactory.name);

  /**
   * Creates a new instance of the GrowingUnitAggregateFactory.
   *
   * @param plantEntityFactory - The factory used for constructing plant entities within the aggregate.
   */
  constructor(private readonly plantEntityFactory: PlantEntityFactory) {}

  /**
   * Creates a new {@link GrowingUnitAggregate} entity using the provided DTO data.
   *
   * @param data - The growing unit creation data transfer object.
   * @param generateEvent - Whether to generate a creation event for the aggregate (default: true).
   * @returns The created GrowingUnitAggregate entity.
   */
  public create(
    data: IGrowingUnitDto,
    generateEvent: boolean = true,
  ): GrowingUnitAggregate {
    this.logger.log(
      `Creating GrowingUnitAggregate from DTO: ${JSON.stringify(data)}`,
    );
    return new GrowingUnitAggregate(data, generateEvent);
  }

  /**
   * Creates a new {@link GrowingUnitAggregate} entity from its primitive property values.
   *
   * @param data - The primitive values representing a growing unit aggregate.
   * @param data.id - UUID string representing the growing unit identifier.
   * @param data.name - Name of the growing unit.
   * @param data.type - Type of the growing unit.
   * @param data.capacity - Capacity value for the growing unit.
   * @param data.dimensions - Dimensions (length, width, height) for the growing unit (optional).
   * @param data.plants - Array of primitive plant representations associated with this unit.
   * @returns The created GrowingUnitAggregate entity, using value objects mapped from the provided primitives.
   */
  public fromPrimitives(data: GrowingUnitPrimitives): GrowingUnitAggregate {
    this.logger.log(
      `Creating GrowingUnitAggregate from primitives: ${JSON.stringify(data)}`,
    );
    return new GrowingUnitAggregate(
      {
        id: new GrowingUnitUuidValueObject(data.id),
        name: new GrowingUnitNameValueObject(data.name),
        type: new GrowingUnitTypeValueObject(data.type),
        capacity: new GrowingUnitCapacityValueObject(data.capacity),
        dimensions: data.dimensions
          ? new DimensionsValueObject(data.dimensions)
          : null,
        plants: data.plants.map((plant) =>
          this.plantEntityFactory.fromPrimitives(plant),
        ),
      },
      false,
    );
  }
}
