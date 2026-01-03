import { Injectable, Logger } from '@nestjs/common';

import { ITenantReadRepository } from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantMongoDBMapper } from '@/generic/tenants/infrastructure/database/mongodb/mappers/tenant-mongodb.mapper';
import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';
import { BaseMongoMasterRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

@Injectable()
export class TenantMongoRepository
	extends BaseMongoMasterRepository
	implements ITenantReadRepository
{
	private readonly collectionName = 'tenants';

	constructor(
		mongoMasterService: MongoMasterService,
		private readonly tenantMongoDBMapper: TenantMongoDBMapper,
	) {
		super(mongoMasterService);
		this.logger = new Logger(TenantMongoRepository.name);
	}

	/**
	 * Finds a tenant by id
	 *
	 * @param id - The id of the tenant to find
	 * @returns The tenant if found, null otherwise
	 */
	async findById(id: string): Promise<TenantViewModel | null> {
		this.logger.log(`Finding tenant by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const doc = await collection.findOne({ id });

		return doc
			? this.tenantMongoDBMapper.toViewModel({
					id: doc.id,
					clerkId: doc.clerkId,
					name: doc.name,
					status: doc.status,
					createdAt: doc.createdAt,
					updatedAt: doc.updatedAt,
				})
			: null;
	}

	/**
	 * Finds tenants by criteria
	 *
	 * @param criteria - The criteria to find tenants by
	 * @returns The tenants found
	 */
	async findByCriteria(
		criteria: Criteria,
	): Promise<PaginatedResult<TenantViewModel>> {
		this.logger.log(`Finding tenants by criteria: ${JSON.stringify(criteria)}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		// 01: Build MongoDB query from criteria
		const mongoQuery = this.buildMongoQuery(criteria);
		const sortQuery = this.buildSortQuery(criteria);

		// 02: Calculate pagination
		const { page, limit, skip } = await this.calculatePagination(criteria);

		// 03: Execute query with pagination
		const [data, total] = await Promise.all([
			collection
				.find(mongoQuery)
				.sort(sortQuery)
				.skip(skip)
				.limit(limit)
				.toArray(),
			collection.countDocuments(mongoQuery),
		]);

		// 04: Convert MongoDB documents to view models
		const tenants = data.map((doc) =>
			this.tenantMongoDBMapper.toViewModel({
				id: doc.id,
				clerkId: doc.clerkId,
				name: doc.name,
				status: doc.status,
				createdAt: doc.createdAt,
				updatedAt: doc.updatedAt,
			}),
		);

		return new PaginatedResult<TenantViewModel>(tenants, total, page, limit);
	}

	/**
	 * Saves a tenant view model (upsert operation)
	 *
	 * @param viewModel - The tenant view model to save
	 */
	async save(viewModel: TenantViewModel): Promise<void> {
		this.logger.log(`Saving tenant view model with id: ${viewModel.id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const mongoData = this.tenantMongoDBMapper.toMongoData(viewModel);

		// 01: Use upsert to either insert or update the view model
		await collection.replaceOne({ id: viewModel.id }, mongoData, {
			upsert: true,
		});
	}

	/**
	 * Deletes a tenant view model by id
	 *
	 * @param id - The id of the tenant view model to delete
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Deleting tenant view model by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		await collection.deleteOne({ id });
	}
}
