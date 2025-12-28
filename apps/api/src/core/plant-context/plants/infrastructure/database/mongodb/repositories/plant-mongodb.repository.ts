import { PlantReadRepository } from '@/core/plant-context/plants/domain/repositories/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/plants/domain/view-models/plant.view-model';
import { PlantMongoDBMapper } from '@/core/plant-context/plants/infrastructure/database/mongodb/mappers/plant-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Scope } from '@nestjs/common';

/**
 * MongoDB implementation of the PlantReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to plant view models using MongoDB,
 * with per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable({ scope: Scope.REQUEST })
export class PlantMongoRepository
  extends BaseMongoMasterRepository
  implements PlantReadRepository
{
  private readonly collectionName = 'plants';

  constructor(
    mongoMasterService: MongoMasterService,
    private readonly plantMongoDBMapper: PlantMongoDBMapper,
  ) {
    super(mongoMasterService);
  }

  /**
   * Finds a plant view model by id.
   *
   * @param id - The id of the plant to find
   * @returns The plant view model if found, null otherwise
   */
  async findById(id: string): Promise<PlantViewModel | null> {
    this.logger.log(`Finding plant by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const plantViewModel = await collection.findOne({ id });

    return plantViewModel
      ? this.plantMongoDBMapper.toViewModel({
          id: plantViewModel.id,
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
   * Finds plant view models by criteria.
   *
   * @param criteria - The criteria to find plants by
   * @returns The plants found with pagination
   */
  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<PlantViewModel>> {
    this.logger.log(`Finding plants by criteria: ${JSON.stringify(criteria)}`);

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
    const plants = items.map((doc) =>
      this.plantMongoDBMapper.toViewModel({
        id: doc.id,
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
   * Saves a plant view model (upsert operation).
   *
   * @param plantViewModel - The plant view model to save
   */
  async save(plantViewModel: PlantViewModel): Promise<void> {
    this.logger.log(`Saving plant view model with id: ${plantViewModel.id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );
    const mongoData = this.plantMongoDBMapper.toMongoData(plantViewModel);

    // 01: Use upsert to either insert or update the plant view model
    await collection.replaceOne({ id: plantViewModel.id }, mongoData, {
      upsert: true,
    });
  }

  /**
   * Deletes a plant view model by id.
   *
   * @param id - The id of the plant view model to delete
   * @returns Promise that resolves when the plant is deleted
   */
  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting plant view model by id: ${id}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Delete the plant view model from the collection
    await collection.deleteOne({ id });
  }

  /**
   * Finds all plant view models by container ID.
   *
   * @param containerId - The container ID to search for
   * @returns Promise that resolves to an array of PlantViewModel instances
   */
  async findByContainerId(containerId: string): Promise<PlantViewModel[]> {
    this.logger.log(`Finding plants by container id: ${containerId}`);

    const collection = this.mongoMasterService.getCollection(
      this.collectionName,
    );

    // 01: Find all plants with the given containerId
    const plants = await collection.find({ containerId }).toArray();

    // 02: Convert MongoDB documents to view models
    return plants.map((doc) =>
      this.plantMongoDBMapper.toViewModel({
        id: doc.id,
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
  }
}
