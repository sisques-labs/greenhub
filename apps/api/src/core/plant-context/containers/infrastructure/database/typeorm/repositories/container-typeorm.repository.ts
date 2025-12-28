import { ContainerAggregate } from '@/core/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerWriteRepository } from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerTypeormEntity } from '@/core/plant-context/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { ContainerTypeormMapper } from '@/core/plant-context/containers/infrastructure/database/typeorm/mappers/container-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Injectable, Scope } from '@nestjs/common';

/**
 * TypeORM implementation of the ContainerWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to container entities using TypeORM, with per-request scope.
 */
@Injectable({ scope: Scope.REQUEST })
export class ContainerTypeormRepository
  extends BaseTypeormMasterRepository<ContainerTypeormEntity>
  implements ContainerWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    private readonly containerTypeormMapper: ContainerTypeormMapper,
  ) {
    super(typeormMasterService, ContainerTypeormEntity);
  }

  /**
   * Finds a container aggregate by its unique ID.
   *
   * @param id - The container ID to search for
   * @returns A ContainerAggregate instance if found, otherwise `null`
   */
  async findById(id: string): Promise<ContainerAggregate | null> {
    this.logger.log(`Finding container by id: ${id}`);
    const containerEntity = await this.repository.findOne({
      where: { id },
    });

    return containerEntity
      ? this.containerTypeormMapper.toDomainEntity(containerEntity)
      : null;
  }

  /**
   * Saves a container aggregate.
   *
   * @param container - The container aggregate to save
   * @returns The saved container aggregate
   */
  async save(container: ContainerAggregate): Promise<ContainerAggregate> {
    this.logger.log(`Saving container: ${container.id.value}`);
    const containerEntity =
      this.containerTypeormMapper.toTypeormEntity(container);

    const savedEntity = await this.repository.save(containerEntity);

    return this.containerTypeormMapper.toDomainEntity(savedEntity);
  }

  /**
   * Deletes a container by its ID (soft delete).
   *
   * @param id - The ID of the container to delete
   * @returns Promise that resolves when the container is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Soft deleting container by id: ${id}`);

    await this.repository.softDelete(id);
  }
}
