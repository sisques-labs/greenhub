import { Injectable, Logger } from '@nestjs/common';

import { IPlantReadRepository } from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { PlantMongoDbDto } from '@/core/plant-context/infrastructure/database/mongodb/dtos/plant/plant-mongodb.dto';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

/**
 * MongoDB implementation of the PlantReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to plant view models using MongoDB,
 * with per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable()
export class PlantMongoRepository
	extends BaseMongoMasterRepository
	implements IPlantReadRepository
{
	private readonly collectionName = 'plants';

	constructor(
		mongoMasterService: MongoMasterService,
		private readonly plantMongoDBMapper: PlantMongoDBMapper,
	) {
		super(mongoMasterService);
		this.logger = new Logger(PlantMongoRepository.name);
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
		const plantMongoDbDto = (await collection.findOne({
			id,
		})) as unknown as PlantMongoDbDto | null;

		return plantMongoDbDto
			? this.plantMongoDBMapper.toViewModel(plantMongoDbDto)
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
			this.plantMongoDBMapper.toViewModel(doc as unknown as PlantMongoDbDto),
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
}
