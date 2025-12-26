import { ContainerReadRepository } from '@/features/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/features/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerMongoDBMapper } from '@/features/plant-context/containers/infrastructure/database/mongodb/mappers/container-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoTenantRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-tenant/base-mongo-tenant.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Injectable, Logger, Scope } from '@nestjs/common';

/**
 * MongoDB implementation of the ContainerReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to container view models using MongoDB,
 * with tenant separation and per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable({ scope: Scope.REQUEST })
export class ContainerMongoRepository
  extends BaseMongoTenantRepository
  implements ContainerReadRepository
{
  private readonly collectionName = 'containers';

  constructor(
    mongoMasterService: MongoMasterService,
    tenantContextService: TenantContextService,
    private readonly containerMongoDBMapper: ContainerMongoDBMapper,
  ) {
    super(mongoMasterService, tenantContextService);
    this.logger = new Logger(ContainerMongoRepository.name);
  }

  /**
   * Finds a container view model by id within the current tenant context.
   *
   * @param id - The id of the container to find
   * @returns The container view model if found, null otherwise
   */
  async findById(id: string): Promise<ContainerViewModel | null> {
    this.logger.log(`Finding container by id: ${id}`);

    const collection = this.getCollection(this.collectionName);
    const containerDoc = await this.findOneById(collection, id);

    return containerDoc
      ? this.containerMongoDBMapper.toViewModel({
          id: containerDoc.id,
          tenantId: containerDoc.tenantId,
          name: containerDoc.name,
          type: containerDoc.type,
          numberOfPlants: containerDoc.numberOfPlants,
          createdAt: containerDoc.createdAt,
          updatedAt: containerDoc.updatedAt,
        })
      : null;
  }

  /**
   * Finds container view models by criteria within the current tenant context.
   *
   * @param criteria - The criteria to find containers by
   * @returns The containers found with pagination
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<ContainerViewModel>> {
    this.logger.log(
      `Finding containers by criteria: ${JSON.stringify(criteria)}`,
    );

    const collection = this.getCollection(this.collectionName);

    // 01: Build MongoDB query from criteria with tenant filter
    const mongoQuery = this.buildMongoQueryWithTenant(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const page = criteria.pagination.page || 1;
    const limit = criteria.pagination.perPage || 10;
    const skip = (page - 1) * limit;

    // 03: Execute query with pagination
    const [items, total] = await this.executeQueryWithPagination(
      collection,
      mongoQuery,
      sortQuery,
      skip,
      limit,
    );

    // 04: Convert MongoDB documents to domain entities
    const containers = items.map((doc) =>
      this.containerMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        name: doc.name,
        type: doc.type,
        numberOfPlants: doc.numberOfPlants,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<ContainerViewModel>(
      containers,
      total,
      page,
      limit,
    );
  }

  /**
   * Saves a container view model (upsert operation) within the current tenant context.
   *
   * @param containerViewModel - The container view model to save
   */
  async save(containerViewModel: ContainerViewModel): Promise<void> {
    this.logger.log(
      `Saving container view model with id: ${containerViewModel.id}`,
    );

    const collection = this.getCollection(this.collectionName);
    const mongoData =
      this.containerMongoDBMapper.toMongoData(containerViewModel);

    // 01: Use upsert to either insert or update the container view model
    await this.saveWithTenant(collection, containerViewModel.id, mongoData);
  }

  /**
   * Deletes a container view model by id within the current tenant context.
   *
   * @param id - The id of the container view model to delete
   * @returns Promise that resolves when the container is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting container view model by id: ${id}`);

    const collection = this.getCollection(this.collectionName);

    // 01: Delete the container view model from the collection with tenant filter
    await this.deleteById(collection, id);
  }
}
