import { Injectable } from "@nestjs/common";
import { GrowingUnitAggregate } from "@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate";
import { IGrowingUnitWriteRepository } from "@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository";
import { GrowingUnitTypeormEntity } from "@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity";
import { GrowingUnitTypeormMapper } from "@/core/plant-context/infrastructure/database/typeorm/mappers/growing-unit/growing-unit-typeorm.mapper";
import { BaseTypeormMasterRepository } from "@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository";
import { TypeormMasterService } from "@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service";

/**
 * TypeORM implementation of the PlantWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to plant entities using TypeORM, with per-request scope.
 */
@Injectable()
export class GrowingUnitTypeormRepository
	extends BaseTypeormMasterRepository<GrowingUnitTypeormEntity>
	implements IGrowingUnitWriteRepository
{
	constructor(
		typeormMasterService: TypeormMasterService,
		private readonly growingUnitTypeormMapper: GrowingUnitTypeormMapper,
	) {
		super(typeormMasterService, GrowingUnitTypeormEntity);
	}

	/**
	 * Finds a growing unit aggregate by its unique ID.
	 *
	 * @param id - The growing unit ID to search for
	 * @returns A GrowingUnitAggregate instance if found, otherwise `null`
	 */
	async findById(id: string): Promise<GrowingUnitAggregate | null> {
		this.logger.log(`Finding growing unit by id: ${id}`);
		const growingUnitEntity = await this.repository.findOne({
			where: { id },
			relations: {
				plants: true,
			},
		});

		return growingUnitEntity
			? this.growingUnitTypeormMapper.toDomainEntity(growingUnitEntity)
			: null;
	}

	/**
	 * Saves a plant aggregate.
	 *
	 * @param plant - The plant aggregate to save
	 * @returns The saved plant aggregate
	 */
	async save(growingUnit: GrowingUnitAggregate): Promise<GrowingUnitAggregate> {
		this.logger.log(`Saving growing unit: ${growingUnit.id.value}`);
		const growingUnitEntity =
			this.growingUnitTypeormMapper.toTypeormEntity(growingUnit);

		const savedEntity = await this.repository.save(growingUnitEntity);

		return this.growingUnitTypeormMapper.toDomainEntity(savedEntity);
	}

	/**
	 * Deletes a growing unit by its ID (soft delete).
	 *
	 * @param id - The ID of the growing unit to delete
	 * @returns Promise that resolves when the growing unit is deleted
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Soft deleting growing unit by id: ${id}`);

		await this.repository.softDelete(id);
	}
}
