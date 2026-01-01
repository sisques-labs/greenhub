import { Injectable } from '@nestjs/common';

import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { ILocationWriteRepository } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationTypeormEntity } from '@/core/location-context/infrastructure/database/typeorm/entities/location-typeorm.entity';
import { LocationTypeormMapper } from '@/core/location-context/infrastructure/database/typeorm/mappers/location/location-typeorm.mapper';
import { BaseTypeormMasterRepository } from '@/shared/infrastructure/database/typeorm/base-typeorm/base-typeorm-master/base-typeorm-master.repository';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';

/**
 * TypeORM implementation of the LocationWriteRepository interface.
 *
 * @remarks
 * Handles all database interactions related to location entities using TypeORM, with per-request scope.
 */
@Injectable()
export class LocationTypeormRepository
	extends BaseTypeormMasterRepository<LocationTypeormEntity>
	implements ILocationWriteRepository
{
	constructor(
		typeormMasterService: TypeormMasterService,
		private readonly locationTypeormMapper: LocationTypeormMapper,
	) {
		super(typeormMasterService, LocationTypeormEntity);
	}

	/**
	 * Finds a location aggregate by its unique ID.
	 *
	 * @param id - The location ID to search for
	 * @returns A LocationAggregate instance if found, otherwise `null`
	 */
	async findById(id: string): Promise<LocationAggregate | null> {
		this.logger.log(`Finding location by id: ${id}`);
		const locationEntity = await this.repository.findOne({
			where: { id },
		});

		return locationEntity
			? this.locationTypeormMapper.toDomainEntity(locationEntity)
			: null;
	}

	/**
	 * Saves a location aggregate.
	 *
	 * @param location - The location aggregate to save
	 * @returns The saved location aggregate
	 */
	async save(location: LocationAggregate): Promise<LocationAggregate> {
		this.logger.log(`Saving location: ${location.id.value}`);
		const locationEntity =
			this.locationTypeormMapper.toTypeormEntity(location);

		const savedEntity = await this.repository.save(locationEntity);

		return this.locationTypeormMapper.toDomainEntity(savedEntity);
	}

	/**
	 * Deletes a location by its ID (soft delete).
	 *
	 * @param id - The ID of the location to delete
	 * @returns Promise that resolves when the location is deleted
	 */
	async delete(id: string): Promise<void> {
		this.logger.log(`Soft deleting location by id: ${id}`);

		await this.repository.softDelete(id);
	}
}

