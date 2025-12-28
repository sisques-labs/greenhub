import { PlantAggregate } from '@/core/plant-context/plants/domain/aggregates/plant.aggregate';
import { PlantWriteRepository } from '@/core/plant-context/plants/domain/repositories/plant-write/plant-write.repository';
import { PlantTypeormEntity } from '@/core/plant-context/plants/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { PlantTypeormMapper } from '@/core/plant-context/plants/infrastructure/database/typeorm/mappers/plant-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Scope } from '@nestjs/common';

/**
 * TypeORM implementation of the PlantWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to plant entities using TypeORM, with per-request scope.
 */
@Injectable({ scope: Scope.REQUEST })
export class PlantTypeormRepository
  extends BaseTypeormMasterRepository<PlantTypeormEntity>
  implements PlantWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly plantTypeormMapper: PlantTypeormMapper,
  ) {
    super(typeormMasterService, PlantTypeormEntity);
  }

  /**
   * Finds a plant aggregate by its unique ID.
   *
   * @param id - The plant ID to search for
   * @returns A PlantAggregate instance if found, otherwise `null`
   */
  async findById(id: string): Promise<PlantAggregate | null> {
    this.logger.log(`Finding plant by id: ${id}`);
    const plantEntity = await this.repository.findOne({
      where: { id },
    });

    return plantEntity
      ? this.plantTypeormMapper.toDomainEntity(plantEntity)
      : null;
  }

  /**
   * Saves a plant aggregate.
   *
   * @param plant - The plant aggregate to save
   * @returns The saved plant aggregate
   */
  async save(plant: PlantAggregate): Promise<PlantAggregate> {
    this.logger.log(`Saving plant: ${plant.id.value}`);
    const plantEntity = this.plantTypeormMapper.toTypeormEntity(plant);

    const savedEntity = await this.repository.save(plantEntity);

    return this.plantTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a plant by its ID (soft delete).
   *
   * @param id - The ID of the plant to delete
   * @returns Promise that resolves when the plant is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Soft deleting plant by id: ${id}`);

    await this.repository.softDelete(id);
  }

  /**
   * Finds all plants by container ID.
   *
   * @param containerId - The container ID to search for
   * @returns Promise that resolves to an array of PlantAggregate instances
   */
  async findByContainerId(containerId: string): Promise<PlantAggregate[]> {
    this.logger.log(`Finding plants by container id: ${containerId}`);
    const plantEntities = await this.repository.find({
      where: { containerId },
    });

    return plantEntities.map((entity) =>
      this.plantTypeormMapper.toDomainEntity(entity),
    );
  }
}
