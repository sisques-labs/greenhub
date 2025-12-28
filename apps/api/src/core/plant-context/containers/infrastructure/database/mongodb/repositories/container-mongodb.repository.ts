import { ContainerReadRepository } from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { ContainerViewModel } from '@/core/plant-context/containers/domain/view-models/container/container.view-model';
import { ContainerMongoDBMapper } from '@/core/plant-context/containers/infrastructure/database/mongodb/mappers/container-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Scope } from '@nestjs/common';

/**
 * MongoDB implementation of the ContainerReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to container view models using MongoDB,
 * with per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable({ scope: Scope.REQUEST })
export class ContainerMongoRepository
  extends BaseMongoMasterRepository
  implements ContainerReadRepository
{
  private readonly collectionName = 'containers';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly containerMongoDBMapper: ContainerMongoDBMapper,
  ) {
    super(mongoMasterService);
  }

  /**
   * Finds a container view model by id.
   *
   * @param id - The id of the container to find
   * @returns The container view model if found, null otherwise
   */
  async findById(id: string): Promise<ContainerViewModel | null> {
    this.logger.log(`Finding container by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const containerDoc = await collection.findOne({ id });

    return containerDoc
      ? this.containerMongoDBMapper.toViewModel({
          id: containerDoc.id,
          name: containerDoc.name,
          type: containerDoc.type,
          numberOfPlants: containerDoc.numberOfPlants,
          createdAt: containerDoc.createdAt,
          updatedAt: containerDoc.updatedAt,
        })
      : null;
  }

  /**
   * Finds container view models by criteria.
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

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Build MongoDB query from criteria
    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    // 02: Calculate pagination
    const { page, limit, skip } = await this.calculatePagination(criteria);

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
   * Saves a container view model (upsert operation).
   *
   * @param containerViewModel - The container view model to save
   */
  async save(containerViewModel: ContainerViewModel): Promise<void> {
    this.logger.log(
      `Saving container view model with id: ${containerViewModel.id}`,
    );

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData =
      this.containerMongoDBMapper.toMongoData(containerViewModel);

    // 01: Use upsert to either insert or update the container view model
    await collection.replaceOne({ id: containerViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a container view model by id.
   *
   * @param id - The id of the container view model to delete
   * @returns Promise that resolves when the container is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting container view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the container view model from the collection
    await collection.deleteOne({ id });
  }
}
