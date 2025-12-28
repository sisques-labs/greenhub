import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { ContainerAggregateFactory } from '@/core/plant-context/containers/domain/factories/container-aggregate/container-aggregate.factory';
import { ContainerTypeormEntity } from '@/core/plant-context/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Mapper for converting between ContainerAggregate domain entities and ContainerTypeormEntity database entities.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (ContainerAggregate) and the
 * infrastructure layer (ContainerTypeormEntity), ensuring proper conversion of value objects
 * and primitives.
 */
@Injectable()
export class ContainerTypeormMapper {
  private readonly logger = new Logger(ContainerTypeormMapper.name);

  constructor(
    private readonly containerAggregateFactory: ContainerAggregateFactory,
  ) {}

  /**
   * Converts a TypeORM entity to a container aggregate.
   *
   * @param containerEntity - The TypeORM entity to convert
   * @returns The container aggregate
   */
  toDomainEntity(containerEntity: ContainerTypeormEntity): ContainerAggregate {
    this.logger.log(
      `Converting TypeORM entity to domain entity with id ${containerEntity.id}`,
    );

    return this.containerAggregateFactory.fromPrimitives({
      id: containerEntity.id,
      name: containerEntity.name,
      type: containerEntity.type,
      createdAt: containerEntity.createdAt,
      updatedAt: containerEntity.updatedAt,
    });
  }

  /**
   * Converts a container aggregate to a TypeORM entity.
   *
   * @param container - The container aggregate to convert
   * @returns The TypeORM entity
   */
  toTypeormEntity(container: ContainerAggregate): ContainerTypeormEntity {
    this.logger.log(
      `Converting domain entity with id ${container.id.value} to TypeORM entity`,
    );

    const primitives = container.toPrimitives();

    const entity = new ContainerTypeormEntity();

    entity.id = primitives.id;
    entity.name = primitives.name;
    entity.type = primitives.type as ContainerTypeEnum;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;
    entity.deletedAt = null;

    return entity;
  }
}
