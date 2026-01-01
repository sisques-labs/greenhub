import { Injectable, Logger } from '@nestjs/common';

import { ILocationReadRepository } from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { LocationMongoDBMapper } from '@/core/location-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

/**
 * MongoDB implementation of the LocationReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to location view models using MongoDB,
 * with per-request scope. Optimized for read operations with
 * support for complex queries, filtering, sorting, and pagination.
 */
@Injectable()
export class LocationMongoRepository
	extends BaseMongoMasterRepository
	implements ILocationReadRepository
{
	private readonly collectionName = 'locations';

	constructor(
		mongoMasterService: MongoMasterService,
		private readonly locationMongoDBMapper: LocationMongoDBMapper,
	) {
		super(mongoMasterService);
		this.logger = new Logger(LocationMongoRepository.name);
	}

	/**
	 * Finds a location view model by id.
	 *
	 * @param id - The id of the location to find
	 * @returns The location view model if found, null otherwise
	 */
	async findById(id: string): Promise<LocationViewModel | null> {
		this.logger.log(`Finding location by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const locationMongoDbDto = await collection.findOne({ id });

		return locationMongoDbDto
			? this.locationMongoDBMapper.toViewModel({
					id: locationMongoDbDto.id,
					name: locationMongoDbDto.name,
					type: locationMongoDbDto.type,
					description: locationMongoDbDto.description,
					createdAt: locationMongoDbDto.createdAt,
					updatedAt: locationMongoDbDto.updatedAt,
				})
			: null;
	}

	/**
	 * Finds location view models by criteria.
	 *
	 * @param criteria - The criteria to find locations by
	 * @returns The locations found with pagination
	 */
	async findByCriteria(
		criteria: Criteria,
	): Promise<PaginatedResult<LocationViewModel>> {
		this.logger.log(
			`Finding locations by criteria: ${JSON.stringify(criteria)}`,
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
		const locations = items.map((doc) =>
			this.locationMongoDBMapper.toViewModel({
				id: doc.id,
				name: doc.name,
				type: doc.type,
				description: doc.description,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			}),
		);

		return new PaginatedResult<LocationViewModel>(
			locations,
			total,
			page,
			limit,
		);
	}

	/**
	 * Saves a location view model (upsert operation).
	 *
	 * @param locationViewModel - The location view model to save
	 */
	async save(locationViewModel: LocationViewModel): Promise<void> {
		this.logger.log(
			`Saving location view model with id: ${locationViewModel.id}`,
		);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const mongoData = this.locationMongoDBMapper.toMongoData(locationViewModel);

		// 01: Use upsert to either insert or update the location view model
		await collection.replaceOne({ id: locationViewModel.id }, mongoData, {
			upsert: true,
		});
	}

	/**
	 * Deletes a location view model by id.
	 *
	 * @param id - The id of the location view model to delete
	 * @returns Promise that resolves when the location is deleted
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Deleting location view model by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		// 01: Delete the location view model from the collection
		await collection.deleteOne({ id });
	}
}
