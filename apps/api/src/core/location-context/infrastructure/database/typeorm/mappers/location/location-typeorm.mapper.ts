import { Injectable, Logger } from '@nestjs/common';

import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import { LocationTypeEnum } from '@/core/location-context/domain/enums/location-type/location-type.enum';
import { LocationAggregateFactory } from '@/core/location-context/domain/factories/aggregates/location-aggregate/location-aggregate.factory';
import { LocationTypeormEntity } from '@/core/location-context/infrastructure/database/typeorm/entities/location-typeorm.entity';

/**
 * Mapper for converting between LocationAggregate domain entities and LocationTypeormEntity database entities.
 *
 * @remarks
 * This mapper handles the transformation between the domain layer (LocationAggregate) and the
 * infrastructure layer (LocationTypeormEntity), ensuring proper conversion of value objects
 * and primitives.
 */
@Injectable()
export class LocationTypeormMapper {
	private readonly logger = new Logger(LocationTypeormMapper.name);

	constructor(
		private readonly locationAggregateFactory: LocationAggregateFactory,
	) {}

	/**
	 * Converts a TypeORM entity to a location aggregate.
	 *
	 * @param locationEntity - The TypeORM entity to convert
	 * @returns The location aggregate
	 */
	toDomainEntity(locationEntity: LocationTypeormEntity): LocationAggregate {
		this.logger.log(
			`Converting TypeORM entity to domain entity with id ${locationEntity.id}`,
		);

		return this.locationAggregateFactory.fromPrimitives({
			id: locationEntity.id,
			name: locationEntity.name,
			type: locationEntity.type,
			description: locationEntity.description,
		});
	}

	/**
	 * Converts a location aggregate to a TypeORM entity.
	 *
	 * @param location - The location aggregate to convert
	 * @returns The TypeORM entity
	 */
	toTypeormEntity(location: LocationAggregate): LocationTypeormEntity {
		this.logger.log(
			`Converting domain entity with id ${location.id.value} to TypeORM entity`,
		);

		const primitives = location.toPrimitives();

		const entity = new LocationTypeormEntity();

		entity.id = primitives.id;
		entity.name = primitives.name;
		entity.type = primitives.type as LocationTypeEnum;
		entity.description = primitives.description;

		return entity;
	}
}
