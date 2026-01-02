import { Injectable, Logger } from '@nestjs/common';

import { IGrowingUnitReadRepository } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { GrowingUnitMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/growing-unit/growing-unit-mongodb.mapper';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

/**
 * MongoDB implementation of the GrowingUnitReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to growing unit view models using MongoDB,
 * with per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable()
export class GrowingUnitMongoRepository
	extends BaseMongoMasterRepository
	implements IGrowingUnitReadRepository
{
	private readonly collectionName = 'growing-units';

	constructor(
		mongoMasterService: MongoMasterService,
		private readonly growingUnitMongoDBMapper: GrowingUnitMongoDBMapper,
		private readonly plantMongoDBMapper: PlantMongoDBMapper,
	) {
		super(mongoMasterService);
		this.logger = new Logger(GrowingUnitMongoRepository.name);
	}

	/**
	 * Finds a growing unit view model by id.
	 *
	 * @param id - The id of the growing unit to find
	 * @returns The growing unit view model if found, null otherwise
	 */
	async findById(id: string): Promise<GrowingUnitViewModel | null> {
		this.logger.log(`Finding growing unit by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const growingUnitMongoDbDto = await collection.findOne({ id });

		return growingUnitMongoDbDto
			? this.growingUnitMongoDBMapper.toViewModel({
					id: growingUnitMongoDbDto.id,
					location: growingUnitMongoDbDto.location,
					name: growingUnitMongoDbDto.name,
					type: growingUnitMongoDbDto.type,
					capacity: growingUnitMongoDbDto.capacity,
					dimensions: growingUnitMongoDbDto.dimensions,
					plants: growingUnitMongoDbDto.plants.map((plant) =>
						this.plantMongoDBMapper.toViewModel(plant),
					),
					remainingCapacity: growingUnitMongoDbDto.remainingCapacity,
					numberOfPlants: growingUnitMongoDbDto.numberOfPlants,
					volume: growingUnitMongoDbDto.volume,
					createdAt: growingUnitMongoDbDto.createdAt,
					updatedAt: growingUnitMongoDbDto.updatedAt,
				})
			: null;
	}

	/**
	 * Finds growing unit view models by criteria.
	 *
	 * @param criteria - The criteria to find growing units by
	 * @returns The growing units found with pagination
	 */
	async findByCriteria(
		criteria: Criteria,
	): Promise<PaginatedResult<GrowingUnitViewModel>> {
		this.logger.log(
			`Finding growing units by criteria: ${JSON.stringify(criteria)}`,
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
		const growingUnits = items.map((doc) =>
			this.growingUnitMongoDBMapper.toViewModel({
				id: doc.id,
				location: doc.location,
				name: doc.name,
				type: doc.type,
				capacity: doc.capacity,
				dimensions: doc.dimensions,
				plants: doc.plants.map((plant) =>
					this.plantMongoDBMapper.toViewModel(plant),
				),
				remainingCapacity: doc.remainingCapacity,
				numberOfPlants: doc.numberOfPlants,
				volume: doc.volume,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			}),
		);

		return new PaginatedResult<GrowingUnitViewModel>(
			growingUnits,
			total,
			page,
			limit,
		);
	}

	/**
	 * Saves a growing unit view model (upsert operation).
	 *
	 * @param growingUnitViewModel - The growing unit view model to save
	 */
	async save(growingUnitViewModel: GrowingUnitViewModel): Promise<void> {
		this.logger.log(
			`Saving growing unit view model with id: ${growingUnitViewModel.id}`,
		);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const mongoData =
			this.growingUnitMongoDBMapper.toMongoData(growingUnitViewModel);

		// 01: Use upsert to either insert or update the growing unit view model
		await collection.replaceOne({ id: growingUnitViewModel.id }, mongoData, {
			upsert: true,
		});
	}

	/**
	 * Deletes a growing unit view model by id.
	 *
	 * @param id - The id of the growing unit view model to delete
	 * @returns Promise that resolves when the growing unit is deleted
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Deleting growing unit view model by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		// 01: Delete the growing unit view model from the collection
		await collection.deleteOne({ id });
	}

	/**
	 * Finds all growing units by container ID.
	 *
	 * @param containerId - The container ID to search for growing units by
	 * @returns Promise that resolves to an array of GrowingUnitViewModel instances
	 */
	async findByContainerId(
		containerId: string,
	): Promise<GrowingUnitViewModel[]> {
		this.logger.log(`Finding growing units by container id: ${containerId}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		// 01: Find all growing units with the given containerId
		const growingUnits = await collection.find({ containerId }).toArray();

		// 02: Convert MongoDB documents to view models
		return growingUnits.map((doc) =>
			this.growingUnitMongoDBMapper.toViewModel({
				id: doc.id,
				location: doc.location,
				name: doc.name,
				type: doc.type,
				capacity: doc.capacity,
				dimensions: doc.dimensions,
				plants: doc.plants.map((plant) =>
					this.plantMongoDBMapper.toViewModel(plant),
				),
				remainingCapacity: doc.remainingCapacity,
				numberOfPlants: doc.numberOfPlants,
				volume: doc.volume,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			}),
		);
	}

	/**
	 * Finds all growing units by location ID.
	 *
	 * @param locationId - The location ID to search for growing units by
	 * @returns Promise that resolves to an array of GrowingUnitViewModel instances
	 */
	async findByLocationId(locationId: string): Promise<GrowingUnitViewModel[]> {
		this.logger.log(`Finding growing units by location id: ${locationId}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		// 01: Find all growing units with the given locationId
		const growingUnits = await collection.find({ locationId }).toArray();

		// 02: Convert MongoDB documents to view models
		return growingUnits.map((doc) =>
			this.growingUnitMongoDBMapper.toViewModel({
				id: doc.id,
				location: doc.location,
				name: doc.name,
				type: doc.type,
				capacity: doc.capacity,
				dimensions: doc.dimensions,
				plants: doc.plants.map((plant) =>
					this.plantMongoDBMapper.toViewModel(plant),
				),
				remainingCapacity: doc.remainingCapacity,
				numberOfPlants: doc.numberOfPlants,
				volume: doc.volume,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			}),
		);
	}
}
