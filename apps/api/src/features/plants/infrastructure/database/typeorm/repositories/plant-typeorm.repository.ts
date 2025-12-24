import { PlantAggregate } from '@/features/plants/domain/aggregates/plant.aggregate';
import { PlantWriteRepository } from '@/features/plants/domain/repositories/plant-write/plant-write.repository';
import { PlantTypeormEntity } from '@/features/plants/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { PlantTypeormMapper } from '@/features/plants/infrastructure/database/typeorm/mappers/plant-typeorm.mapper';
import { BaseTypeormTenantRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-tenant/base-typeorm-tenant.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Injectable, Logger, Scope } from '@nestjs/common';

/**
 * TypeORM implementation of the PlantWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to plant entities using TypeORM, with tenant
 * separation and per-request scope. Extends BaseTypeormTenantRepository which automatically
 * filters all queries by tenantId.
 */
@Injectable({ scope: Scope.REQUEST })
export class PlantTypeormRepository
  extends BaseTypeormTenantRepository<PlantTypeormEntity>
  implements PlantWriteRepository
{
  constructor(
    typeormMasterService: TypeormMasterService,
    tenantContextService: TenantContextService,
    private readonly plantTypeormMapper: PlantTypeormMapper,
  ) {
    super(typeormMasterService, tenantContextService, PlantTypeormEntity);
    this.logger = new Logger(PlantTypeormRepository.name);
  }

  /**
   * Finds a plant aggregate by its unique ID within the current tenant context.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
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
   * Saves a plant aggregate within the current tenant context.
   * Tenant ID is automatically set by BaseTypeormTenantRepository.
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
   * Deletes a plant by its ID (soft delete) within the current tenant context.
   * Tenant filtering is automatically applied by BaseTypeormTenantRepository.
   *
   * @param id - The ID of the plant to delete
   * @returns Promise that resolves when the plant is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Soft deleting plant by id: ${id}`);

    await this.repository.softDelete(id);
  }
}
