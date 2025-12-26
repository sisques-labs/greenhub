import { PlantReadRepository } from '@/features/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/features/plants/domain/view-models/plant.view-model';
import { PlantMongoDBMapper } from '@/features/plants/infrastructure/database/mongodb/mappers/plant-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoTenantRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-tenant/base-mongo-tenant.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { TenantContextService } from '@/shared/infrastructure/services/tenant-context/tenant-context.service';
import { Injectable, Logger, Scope } from '@nestjs/common';

/**
 * MongoDB implementation of the PlantReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to plant view models using MongoDB,
 * with tenant separation and per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable({ scope: Scope.REQUEST })
export class PlantMongoRepository
  extends BaseMongoTenantRepository
  implements PlantReadRepository
{
  private readonly collectionName = 'plants';

  constructor(
    mongoMasterService: MongoMasterService,
    tenantContextService: TenantContextService,
    private readonly plantMongoDBMapper: PlantMongoDBMapper,
  ) {
    super(mongoMasterService, tenantContextService);
    this.logger = new Logger(PlantMongoRepository.name);
  }

  /**
   * Finds a plant view model by id within the current tenant context.
   *
   * @param id - The id of the plant to find
   * @returns The plant view model if found, null otherwise
   */
  async findById(id: string): Promise<PlantViewModel | null> {
    this.logger.log(`Finding plant by id: ${id}`);

    const collection = this.getCollection(this.collectionName);
    const plantViewModel = await this.findOneById(collection, id);

    return plantViewModel
      ? this.plantMongoDBMapper.toViewModel({
          id: plantViewModel.id,
          tenantId: plantViewModel.tenantId,
          containerId: plantViewModel.containerId,
          name: plantViewModel.name,
          species: plantViewModel.species,
          plantedDate: plantViewModel.plantedDate,
          notes: plantViewModel.notes,
          status: plantViewModel.status,
          createdAt: plantViewModel.createdAt,
          updatedAt: plantViewModel.updatedAt,
        })
      : null;
  }

  /**
   * Finds plant view models by criteria within the current tenant context.
   *
   * @param criteria - The criteria to find plants by
   * @returns The plants found with pagination
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<PlantViewModel>> {
    this.logger.log(`Finding plants by criteria: ${JSON.stringify(criteria)}`);

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
    const plants = items.map((doc) =>
      this.plantMongoDBMapper.toViewModel({
        id: doc.id,
        tenantId: doc.tenantId,
        containerId: doc.containerId,
        name: doc.name,
        species: doc.species,
        plantedDate: doc.plantedDate,
        notes: doc.notes,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );

    return new PaginatedResult<PlantViewModel>(plants, total, page, limit);
  }

  /**
   * Saves a plant view model (upsert operation) within the current tenant context.
   *
   * @param plantViewModel - The plant view model to save
   */
  async save(plantViewModel: PlantViewModel): Promise<void> {
    this.logger.log(`Saving plant view model with id: ${plantViewModel.id}`);

    const collection = this.getCollection(this.collectionName);
    const mongoData = this.plantMongoDBMapper.toMongoData(plantViewModel);

    // 01: Use upsert to either insert or update the plant view model
    await this.saveWithTenant(collection, plantViewModel.id, mongoData);
  }

  /**
   * Deletes a plant view model by id within the current tenant context.
   *
   * @param id - The id of the plant view model to delete
   * @returns Promise that resolves when the plant is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting plant view model by id: ${id}`);

    const collection = this.getCollection(this.collectionName);

    // 01: Delete the plant view model from the collection with tenant filter
    await this.deleteById(collection, id);
  }
}
