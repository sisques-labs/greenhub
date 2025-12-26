import { ContainerAggregate } from '@/features/plant-context/containers/domain/aggregates/container.aggregate';
import { ContainerWriteRepository } from '@/features/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerTypeormEntity } from '@/features/plant-context/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { ContainerTypeormMapper } from '@/features/plant-context/containers/infrastructure/database/typeorm/mappers/container-typeorm.mapper';
import { BaseTypeormTenantRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-tenant/base-typeorm-tenant.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Injectable, Logger, Scope } from '@nestjs/common';

/**
 * TypeORM implementation of the ContainerWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to container entities using TypeORM, with tenant
 * separation and per-request scope. Extends BaseTypeormTenantRepository which automatically
 * filters all queries by tenantId.
 */
@Injectable({ scope: Scope.REQUEST })
export class ContainerTypeormRepository
  extends BaseTypeormTenantRepository<ContainerTypeormEntity>
  implements ContainerWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    tenantContextService: TenantContextService,
    private readonly containerTypeormMapper: ContainerTypeormMapper,
  ) {
    super(typeormMasterService, tenantContextService, ContainerTypeormEntity);
    this.logger = new Logger(ContainerTypeormRepository.name);
  }

  /**
   * Finds a container aggregate by its unique ID within the current tenant context.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
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
   * Saves a container aggregate within the current tenant context.
   * Tenant ID is automatically set by BaseTypeormTenantRepository.
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
   * Deletes a container by its ID (soft delete) within the current tenant context.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
   *
   * @param id - The ID of the container to delete
   * @returns Promise that resolves when the container is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Soft deleting container by id: ${id}`);

    await this.repository.softDelete(id);
  }
}
