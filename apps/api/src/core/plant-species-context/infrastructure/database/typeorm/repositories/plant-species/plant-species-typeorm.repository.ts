import { Injectable } from '@nestjs/common';

import { PlantSpeciesAggregate } from '@/core/plant-species-context/domain/aggregates/plant-species/plant-species.aggregate';
import { IPlantSpeciesWriteRepository } from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { PlantSpeciesCommonNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-common-name/plant-species-common-name.vo';
import { PlantSpeciesScientificNameValueObject } from '@/core/plant-species-context/domain/value-objects/plant-species/plant-species-scientific-name/plant-species-scientific-name.vo';
import { PlantSpeciesTypeormEntity } from '@/core/plant-species-context/infrastructure/database/typeorm/entities/plant-species-typeorm.entity';
import { PlantSpeciesTypeormMapper } from '@/core/plant-species-context/infrastructure/database/typeorm/mappers/plant-species/plant-species-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';

/**
 * TypeORM implementation of the PlantSpeciesWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions for plant species aggregates using TypeORM and PostgreSQL.
 */
@Injectable()
export class PlantSpeciesTypeormRepository
	extends BaseTypeormMasterRepository<PlantSpeciesTypeormEntity>
	implements IPlantSpeciesWriteRepository
{
	constructor(
		typeormMasterService: TypeormMasterService,
		private readonly plantSpeciesTypeormMapper: PlantSpeciesTypeormMapper,
	) {
		super(typeormMasterService, PlantSpeciesTypeormEntity);
	}

	/**
	 * Finds a plant species aggregate by its unique ID.
	 *
	 * @param id - The plant species ID to search for
	 * @returns A PlantSpeciesAggregate instance if found, otherwise `null`
	 */
	async findById(id: string): Promise<PlantSpeciesAggregate | null> {
		this.logger.log(`Finding plant species by id: ${id}`);

		const entity = await this.repository.findOne({ where: { id } });

		return entity
			? this.plantSpeciesTypeormMapper.toDomainEntity(entity)
			: null;
	}

	/**
	 * Saves a plant species aggregate to the database.
	 *
	 * @param aggregate - The plant species aggregate to save
	 * @returns The saved plant species aggregate
	 */
	async save(
		aggregate: PlantSpeciesAggregate,
	): Promise<PlantSpeciesAggregate> {
		this.logger.log(`Saving plant species: ${aggregate.id.value}`);

		const entity =
			this.plantSpeciesTypeormMapper.toTypeormEntity(aggregate);
		const savedEntity = await this.repository.save(entity);

		return this.plantSpeciesTypeormMapper.toDomainEntity(savedEntity);
	}

	/**
	 * Soft deletes a plant species by its ID.
	 *
	 * @param id - The ID of the plant species to delete
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Soft deleting plant species by id: ${id}`);

		await this.repository.softDelete(id);
	}

	/**
	 * Finds a plant species aggregate by its scientific name.
	 *
	 * @param scientificName - The scientific name value object to search for
	 * @returns A PlantSpeciesAggregate instance if found, otherwise `null`
	 */
	async findByScientificName(
		scientificName: PlantSpeciesScientificNameValueObject,
	): Promise<PlantSpeciesAggregate | null> {
		this.logger.log(
			`Finding plant species by scientific name: ${scientificName.value}`,
		);

		const entity = await this.repository.findOne({
			where: { scientificName: scientificName.value },
		});

		return entity
			? this.plantSpeciesTypeormMapper.toDomainEntity(entity)
			: null;
	}

	/**
	 * Finds a plant species aggregate by its common name.
	 *
	 * @param commonName - The common name value object to search for
	 * @returns A PlantSpeciesAggregate instance if found, otherwise `null`
	 */
	async findByCommonName(
		commonName: PlantSpeciesCommonNameValueObject,
	): Promise<PlantSpeciesAggregate | null> {
		this.logger.log(
			`Finding plant species by common name: ${commonName.value}`,
		);

		const entity = await this.repository.findOne({
			where: { commonName: commonName.value },
		});

		return entity
			? this.plantSpeciesTypeormMapper.toDomainEntity(entity)
			: null;
	}
}
