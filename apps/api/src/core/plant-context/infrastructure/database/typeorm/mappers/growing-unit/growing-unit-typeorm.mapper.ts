import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitAggregateFactory } from '@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory';
import { GrowingUnitTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity';
import { PlantTypeormMapper } from '@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between PlantAggregate domain entities and PlantTypeormEntity database entities.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (PlantAggregate) and the
 * infrastructure layer (PlantTypeormEntity), ensuring proper conversion of value objects
 * and primitives.
 */
@Injectable()
export class GrowingUnitTypeormMapper {
  private readonly logger = new Logger(GrowingUnitTypeormMapper.name);

  constructor(
    private readonly growingUnitAggregateFactory: GrowingUnitAggregateFactory,
    private readonly plantTypeormMapper: PlantTypeormMapper,
  ) {}

  /**
   * Converts a TypeORM entity to a growing unit aggregate.
   *
   * @param growingUnitEntity - The TypeORM entity to convert
   * @returns The growing unit aggregate
   */
  toDomainEntity(
    growingUnitEntity: GrowingUnitTypeormEntity,
  ): GrowingUnitAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${growingUnitEntity.id}`,
    );

    const plants = growingUnitEntity.plants.map((plant) =>
      this.plantTypeormMapper.toDomainEntity(plant),
    );

    return this.growingUnitAggregateFactory.fromPrimitives({
      id: growingUnitEntity.id,
      name: growingUnitEntity.name,
      type: growingUnitEntity.type,
      capacity: growingUnitEntity.capacity,
      dimensions: {
        length: growingUnitEntity.length,
        width: growingUnitEntity.width,
        height: growingUnitEntity.height,
        unit: growingUnitEntity.unit,
      },
      plants: plants.map((plant) => plant.toPrimitives()),
    });
  }

  /**
   * Converts a plant aggregate to a TypeORM entity.
   *
   * @param growingUnit - The growing unit aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(growingUnit: GrowingUnitAggregate): GrowingUnitTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${growingUnit.id.value} to TypeORM entity`,
    );

    const primitives = growingUnit.toPrimitives();

    const entity = new GrowingUnitTypeormEntity();

    entity.id = primitives.id;
    entity.name = primitives.name;
    entity.type = primitives.type as GrowingUnitTypeEnum;
    entity.capacity = primitives.capacity;
    entity.length = primitives.dimensions.length;
    entity.width = primitives.dimensions.width;
    entity.height = primitives.dimensions.height;
    entity.unit = primitives.dimensions.unit as LengthUnitEnum;
    entity.plants = growingUnit.plants.map((plant) =>
      this.plantTypeormMapper.toTypeormEntity(plant),
    );

    return entity;
  }
}
