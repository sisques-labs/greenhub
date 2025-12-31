import { Injectable, Logger } from "@nestjs/common";
import { IOverviewReadRepository } from "@/generic/overview/domain/repositories/overview-read/overview-read.repository";
import { OverviewViewModel } from "@/generic/overview/domain/view-models/plant/overview.view-model";
import { OverviewMongoDBMapper } from "@/generic/overview/infrastructure/database/mongodb/mappers/overview-mongodb.mapper";
import { Criteria } from "@/shared/domain/entities/criteria";
import { PaginatedResult } from "@/shared/domain/entities/paginated-result.entity";
import { BaseMongoMasterRepository } from "@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-master/base-mongo-master.repository";
import { MongoMasterService } from "@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service";

/**
 * MongoDB implementation of the OverviewReadRepository interface.
 *
 * @remarks
 * Handles all read database interactions related to overview view models using MongoDB.
 * Since there is only one overview entity, this repository provides simple find operations.
 */
@Injectable()
export class OverviewMongoRepository
	extends BaseMongoMasterRepository
	implements IOverviewReadRepository
{
	private readonly collectionName = "overviews";

	constructor(
		mongoMasterService: MongoMasterService,
		private readonly overviewMongoDBMapper: OverviewMongoDBMapper,
	) {
		super(mongoMasterService);
		this.logger = new Logger(OverviewMongoRepository.name);
	}

	/**
	 * Finds the overview view model by id.
	 *
	 * @param id - The id of the overview to find
	 * @returns The overview view model if found, null otherwise
	 */
	async findById(id: string): Promise<OverviewViewModel | null> {
		this.logger.log(`Finding overview by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const overviewMongoDbDto = await collection.findOne({ id });

		return overviewMongoDbDto
			? this.overviewMongoDBMapper.toViewModel({
					id: overviewMongoDbDto.id,
					totalPlants: overviewMongoDbDto.totalPlants,
					totalActivePlants: overviewMongoDbDto.totalActivePlants,
					averagePlantsPerGrowingUnit:
						overviewMongoDbDto.averagePlantsPerGrowingUnit,
					plantsPlanted: overviewMongoDbDto.plantsPlanted,
					plantsGrowing: overviewMongoDbDto.plantsGrowing,
					plantsHarvested: overviewMongoDbDto.plantsHarvested,
					plantsDead: overviewMongoDbDto.plantsDead,
					plantsArchived: overviewMongoDbDto.plantsArchived,
					plantsWithoutPlantedDate: overviewMongoDbDto.plantsWithoutPlantedDate,
					plantsWithNotes: overviewMongoDbDto.plantsWithNotes,
					recentPlants: overviewMongoDbDto.recentPlants,
					totalGrowingUnits: overviewMongoDbDto.totalGrowingUnits,
					activeGrowingUnits: overviewMongoDbDto.activeGrowingUnits,
					emptyGrowingUnits: overviewMongoDbDto.emptyGrowingUnits,
					growingUnitsPot: overviewMongoDbDto.growingUnitsPot,
					growingUnitsGardenBed: overviewMongoDbDto.growingUnitsGardenBed,
					growingUnitsHangingBasket:
						overviewMongoDbDto.growingUnitsHangingBasket,
					growingUnitsWindowBox: overviewMongoDbDto.growingUnitsWindowBox,
					totalCapacity: overviewMongoDbDto.totalCapacity,
					totalCapacityUsed: overviewMongoDbDto.totalCapacityUsed,
					averageOccupancy: overviewMongoDbDto.averageOccupancy,
					growingUnitsAtLimit: overviewMongoDbDto.growingUnitsAtLimit,
					growingUnitsFull: overviewMongoDbDto.growingUnitsFull,
					totalRemainingCapacity: overviewMongoDbDto.totalRemainingCapacity,
					growingUnitsWithDimensions:
						overviewMongoDbDto.growingUnitsWithDimensions,
					totalVolume: overviewMongoDbDto.totalVolume,
					averageVolume: overviewMongoDbDto.averageVolume,
					minPlantsPerGrowingUnit: overviewMongoDbDto.minPlantsPerGrowingUnit,
					maxPlantsPerGrowingUnit: overviewMongoDbDto.maxPlantsPerGrowingUnit,
					medianPlantsPerGrowingUnit:
						overviewMongoDbDto.medianPlantsPerGrowingUnit,
					createdAt: overviewMongoDbDto.createdAt,
					updatedAt: overviewMongoDbDto.updatedAt,
				})
			: null;
	}

	/**
	 * Finds overview view models by criteria.
	 *
	 * @param criteria - The criteria to find overviews by
	 * @returns The overviews found with pagination
	 */
	async findByCriteria(
		criteria: Criteria,
	): Promise<PaginatedResult<OverviewViewModel>> {
		this.logger.log(
			`Finding overviews by criteria: ${JSON.stringify(criteria)}`,
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

		// 04: Convert MongoDB documents to view models
		const overviews = items.map((doc) =>
			this.overviewMongoDBMapper.toViewModel(doc),
		);

		return new PaginatedResult<OverviewViewModel>(
			overviews,
			total,
			page,
			limit,
		);
	}

	/**
	 * Saves an overview view model (upsert operation).
	 *
	 * @param overviewViewModel - The overview view model to save
	 */
	async save(overviewViewModel: OverviewViewModel): Promise<void> {
		this.logger.log(
			`Saving overview view model with id: ${overviewViewModel.id}`,
		);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);
		const mongoData = this.overviewMongoDBMapper.toMongoData(overviewViewModel);

		// 01: Use upsert to either insert or update the overview view model
		await collection.replaceOne({ id: overviewViewModel.id }, mongoData, {
			upsert: true,
		});
	}

	/**
	 * Deletes an overview view model by id.
	 *
	 * @param id - The id of the overview view model to delete
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Deleting overview view model by id: ${id}`);

		const collection = this.mongoMasterService.getCollection(
			this.collectionName,
		);

		await collection.deleteOne({ id });
	}
}
