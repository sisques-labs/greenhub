import { IPlantSpeciesReadRepository } from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PlantSpeciesViewModel } from '@/core/plant-species-context/domain/view-models/plant-species/plant-species.view-model';
import { PlantSpeciesMongoDbDto } from '@/core/plant-species-context/infrastructure/database/mongodb/dtos/plant-species/plant-species-mongodb.dto';
import { PlantSpeciesMongoDBMapper } from '@/core/plant-species-context/infrastructure/database/mongodb/mappers/plant-species/plant-species-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';
import { Injectable, Logger } from '@nestjs/common';

/**
 * MongoDB implementation of the PlantSpeciesReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to plant species view models using MongoDB.
 * Optimized for read operations with support for complex queries, filtering, sorting, and pagination.
 */
@Injectable()
export class PlantSpeciesMongoRepository
	extends BaseMongoMasterRepository
	implements IPlantSpeciesReadRepository
{
	private readonly collectionName = 'plant-species';

	constructor(
		mongoMasterService: MongoMasterService,
		private readonly plantSpeciesMongoDBMapper: PlantSpeciesMongoDBMapper,
	) {
		super(mongoMasterService);
		this.logger = new Logger(PlantSpeciesMongoRepository.name);
	}

	/**
	 * Finds a plant species view model by id.
	 *
	 * @param id - The id of the plant species to find
	 * @returns The plant species view model if found, null otherwise
	 */
	async findById(id: string): Promise<PlantSpeciesViewModel | null> {
		this.logger.log(`Finding plant species by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const doc = (await collection.findOne({
			id,
		})) as unknown as PlantSpeciesMongoDbDto | null;

		return doc ? this.plantSpeciesMongoDBMapper.toViewModel(doc) : null;
	}

	/**
	 * Finds plant species view models by criteria.
	 *
	 * @param criteria - The criteria to find plant species by
	 * @returns The plant species found with pagination
	 */
	async findByCriteria(
		criteria: Criteria,
	): Promise<PaginatedResult<PlantSpeciesViewModel>> {
		this.logger.log(
			`Finding plant species by criteria: ${JSON.stringify(criteria)}`,
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
		const plantSpecies = items.map((doc) =>
			this.plantSpeciesMongoDBMapper.toViewModel(
				doc as unknown as PlantSpeciesMongoDbDto,
			),
		);

		return new PaginatedResult<PlantSpeciesViewModel>(
			plantSpecies,
			total,
			page,
			limit,
		);
	}

	/**
	 * Saves a plant species view model (upsert operation).
	 *
	 * @param viewModel - The plant species view model to save
	 */
	async save(viewModel: PlantSpeciesViewModel): Promise<void> {
		this.logger.log(`Saving plant species view model with id: ${viewModel.id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const mongoData = this.plantSpeciesMongoDBMapper.toMongoData(viewModel);

		// 01: Use upsert to either insert or update the plant species view model
		await collection.replaceOne({ id: viewModel.id }, mongoData, {
			upsert: true,
		});
	}

	/**
	 * Deletes a plant species view model by id.
	 *
	 * @param id - The id of the plant species view model to delete
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Deleting plant species view model by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		// 01: Delete the plant species view model from the collection
		await collection.deleteOne({ id });
	}
}
