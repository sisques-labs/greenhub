import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantStatusEnum } from '@/core/plant-context/plants/domain/enums/plant-status/plant-status.enum';
import { PlantAggregateFactory } from '@/core/plant-context/plants/domain/factories/plant-aggregate/plant-aggregate.factory';
import { PlantTypeormEntity } from '@/core/plant-context/plants/infrastructure/database/typeorm/entities/plant-typeorm.entity';
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
export class PlantTypeormMapper {
  private readonly logger = new Logger(PlantTypeormMapper.name);

  constructor(private readonly plantAggregateFactory: PlantAggregateFactory) {}

  /**
   * Converts a TypeORM entity to a plant aggregate.
   *
   * @param plantEntity - The TypeORM entity to convert
   * @returns The plant aggregate
   */
  toDomainEntity(plantEntity: PlantTypeormEntity): PlantAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${plantEntity.id}`,
    );

    return this.plantAggregateFactory.fromPrimitives({
      id: plantEntity.id,
      containerId: plantEntity.containerId,
      name: plantEntity.name,
      species: plantEntity.species,
      plantedDate: plantEntity.plantedDate,
      notes: plantEntity.notes,
      status: plantEntity.status,
      createdAt: plantEntity.createdAt,
      updatedAt: plantEntity.updatedAt,
    });
  }

  /**
   * Converts a plant aggregate to a TypeORM entity.
   *
   * @param plant - The plant aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(plant: PlantAggregate): PlantTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${plant.id.value} to TypeORM entity`,
    );

    const primitives = plant.toPrimitives();

    const entity = new PlantTypeormEntity();

    entity.id = primitives.id;
    entity.containerId = primitives.containerId;
    entity.name = primitives.name;
    entity.species = primitives.species;
    entity.plantedDate = primitives.plantedDate;
    entity.notes = primitives.notes;
    entity.status = primitives.status as PlantStatusEnum;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
