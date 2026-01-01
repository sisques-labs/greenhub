import { Injectable, Logger } from '@nestjs/common';

import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import type { ILocationDto } from '@/core/location-context/domain/dtos/entities/location/location.dto';
import type { LocationPrimitives } from '@/core/location-context/domain/primitives/location.primitives';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import type { IWriteFactory } from '@/shared/domain/interfaces/write-factory.interface';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Factory responsible for creating {@link LocationAggregate} entities.
 *
 * @remarks
 * This factory encapsulates logic for constructing `LocationAggregate`
 * instances from DTOs or primitive values. It utilizes value objects to
 * enforce invariants, encapsulate domain logic, and ensure the integrity of location data.
 *
 * @example
 * ```typescript
 * const locationAggregate = locationAggregateFactory.create(locationCreateDto);
 * ```
 *
 * @see LocationAggregate
 */
@Injectable()
export class LocationAggregateFactory
	implements IWriteFactory<LocationAggregate, ILocationDto>
{
	private readonly logger = new Logger(LocationAggregateFactory.name);

	/**
	 * Creates a new {@link LocationAggregate} entity using the provided DTO data.
	 *
	 * @param data - The location creation data transfer object.
	 * @returns The created LocationAggregate entity.
	 */
	public create(data: ILocationDto): LocationAggregate {
		this.logger.log(
			`Creating LocationAggregate from DTO: ${JSON.stringify(data)}`,
		);
		return new LocationAggregate(data);
	}

	/**
	 * Creates a new {@link LocationAggregate} entity from its primitive property values.
	 *
	 * @param data - The primitive values representing a location aggregate.
	 * @param data.id - UUID string representing the location identifier.
	 * @param data.name - Name of the location.
	 * @param data.type - Type of the location.
	 * @param data.description - Description of the location (optional).
	 * @returns The created LocationAggregate entity, using value objects mapped from the provided primitives.
	 */
	public fromPrimitives(data: LocationPrimitives): LocationAggregate {
		this.logger.log(
			`Creating LocationAggregate from primitives: ${JSON.stringify(data)}`,
		);
		return new LocationAggregate({
			id: new LocationUuidValueObject(data.id),
			name: new LocationNameValueObject(data.name),
			type: new LocationTypeValueObject(data.type),
			description: data.description
				? new LocationDescriptionValueObject(data.description)
				: null,
		});
	}
}
