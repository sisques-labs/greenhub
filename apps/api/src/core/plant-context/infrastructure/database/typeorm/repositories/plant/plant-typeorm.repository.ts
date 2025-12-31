import { Injectable } from "@nestjs/common";
import { PlantEntity } from "@/core/plant-context/domain/entities/plant/plant.entity";
import { IPlantWriteRepository } from "@/core/plant-context/domain/repositories/plant/plant-write/plant-write.repository";
import { PlantTypeormEntity } from "@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity";
import { PlantTypeormMapper } from "@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper";
import { BaseTypeormMasterRepository } from "@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository";
import { TypeormMasterService } from "@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service";

/**
 * TypeORM implementation of the PlantWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to plant entities using TypeORM, with per-request scope.
 */
@Injectable()
export class PlantTypeormRepository
	extends BaseTypeormMasterRepository<PlantTypeormEntity>
	implements IPlantWriteRepository
{
	constructor(
		typeormMasterService: TypeormMasterService,
		private readonly plantTypeormMapper: PlantTypeormMapper,
	) {
		super(typeormMasterService, PlantTypeormEntity);
	}

	/**
	 * Finds a growing unit aggregate by its unique ID.
	 *
	 * @param id - The growing unit ID to search for
	 * @returns A GrowingUnitAggregate instance if found, otherwise `null`
	 */
	async findById(id: string): Promise<PlantEntity | null> {
		this.logger.log(`Finding plant by id: ${id}`);
		const plantEntity = await this.repository.findOne({
			where: { id },
		});

		return plantEntity
			? this.plantTypeormMapper.toDomainEntity(plantEntity)
			: null;
	}

	/**
	 * Saves a plant aggregate.
	 *
	 * @param plant - The plant aggregate to save
	 * @returns The saved plant aggregate
	 */
	async save(plant: PlantEntity): Promise<PlantEntity> {
		this.logger.log(`Saving plant: ${plant.id.value}`);
		const plantEntity = this.plantTypeormMapper.toTypeormEntity(plant);

		const savedEntity = await this.repository.save(plantEntity);

		return this.plantTypeormMapper.toDomainEntity(savedEntity);
	}

	/**
	 * Deletes a growing unit by its ID (soft delete).
	 *
	 * @param id - The ID of the growing unit to delete
	 * @returns Promise that resolves when the growing unit is deleted
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Soft deleting plant by id: ${id}`);

		await this.repository.softDelete(id);
	}

	/**
	 * Finds all growing units by growing unit ID.
	 *
	 * @param growingUnitId - The growing unit ID to search for
	 * @returns Promise that resolves to an array of GrowingUnitAggregate instances
	 */
	async findByGrowingUnitId(growingUnitId: string): Promise<PlantEntity[]> {
		this.logger.log(`Finding plants by growing unit id: ${growingUnitId}`);
		const plantEntities = await this.repository.find({
			where: { growingUnitId: growingUnitId },
		});

		return plantEntities.map((entity) =>
			this.plantTypeormMapper.toDomainEntity(entity),
		);
	}
}
