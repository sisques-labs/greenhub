import { Injectable, Logger } from '@nestjs/common';

import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import type { ILocationDto } from '@/core/location-context/domain/dtos/entities/location/location.dto';
import type { LocationPrimitives } from '@/core/location-context/domain/primitives/location.primitives';
import { LocationDescriptionValueObject } from '@/core/location-context/domain/value-objects/location/location-description/location-description.vo';
import { LocationNameValueObject } from '@/core/location-context/domain/value-objects/location/location-name/location-name.vo';
import { LocationTypeValueObject } from '@/core/location-context/domain/value-objects/location/location-type/location-type.vo';
import { IWriteBuilder } from '@/shared/domain/interfaces/write-builder.interface';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Builder for constructing {@link LocationAggregate} instances using a fluent API.
 *
 * @remarks
 * This builder provides a step-by-step approach to creating `LocationAggregate`
 * entities with validation and encapsulation. It supports both new creation
 * and reconstruction from primitive data.
 *
 * @example
 * ```typescript
 * // Creating a new location
 * const location = new LocationAggregateBuilder()
 *   .withId(new LocationUuidValueObject())
 *   .withName(new LocationNameValueObject('Greenhouse 1'))
 *   .withType(new LocationTypeValueObject('GREENHOUSE'))
 *   .withDescription(new LocationDescriptionValueObject('Main greenhouse'))
 *   .build();
 *
 * // Reconstructing from primitives
 * const location = new LocationAggregateBuilder()
 *   .fromPrimitives(primitives)
 *   .build();
 * ```
 *
 * @see LocationAggregate
 */
@Injectable()
export class LocationAggregateBuilder
	implements IWriteBuilder<LocationAggregate, LocationPrimitives>
{
	private readonly logger = new Logger(LocationAggregateBuilder.name);

	private _id?: LocationUuidValueObject;
	private _name?: LocationNameValueObject;
	private _type?: LocationTypeValueObject;
	private _description: LocationDescriptionValueObject | null = null;

	/**
	 * Sets the location identifier.
	 *
	 * @param id - The location UUID value object.
	 * @returns The builder instance for method chaining.
	 */
	public withId(id: LocationUuidValueObject): this {
		this._id = id;
		return this;
	}

	/**
	 * Sets the location name.
	 *
	 * @param name - The location name value object.
	 * @returns The builder instance for method chaining.
	 */
	public withName(name: LocationNameValueObject): this {
		this._name = name;
		return this;
	}

	/**
	 * Sets the location type.
	 *
	 * @param type - The location type value object.
	 * @returns The builder instance for method chaining.
	 */
	public withType(type: LocationTypeValueObject): this {
		this._type = type;
		return this;
	}

	/**
	 * Sets the location description.
	 *
	 * @param description - The location description value object or null.
	 * @returns The builder instance for method chaining.
	 */
	public withDescription(
		description: LocationDescriptionValueObject | null,
	): this {
		this._description = description;
		return this;
	}

	/**
	 * Initializes the builder from primitive data.
	 *
	 * @param primitives - The primitive location data.
	 * @returns The builder instance for method chaining.
	 */
	public fromPrimitives(primitives: LocationPrimitives): this {
		this.logger.log(
			`Initializing LocationAggregateBuilder from primitives: ${JSON.stringify(primitives)}`,
		);

		this._id = new LocationUuidValueObject(primitives.id);
		this._name = new LocationNameValueObject(primitives.name);
		this._type = new LocationTypeValueObject(primitives.type);
		this._description = primitives.description
			? new LocationDescriptionValueObject(primitives.description)
			: null;

		return this;
	}

	/**
	 * Builds the LocationAggregate instance.
	 *
	 * @returns The constructed LocationAggregate.
	 * @throws {Error} If required fields are not set.
	 */
	public build(): LocationAggregate {
		this.validate();

		this.logger.log(
			`Building LocationAggregate with id: ${this._id!.value}`,
		);

		const dto: ILocationDto = {
			id: this._id!,
			name: this._name!,
			type: this._type!,
			description: this._description,
		};

		return new LocationAggregate(dto);
	}

	/**
	 * Resets the builder to its initial state.
	 *
	 * @returns The builder instance for method chaining.
	 */
	public reset(): this {
		this._id = undefined;
		this._name = undefined;
		this._type = undefined;
		this._description = null;
		return this;
	}

	/**
	 * Validates that all required fields are set.
	 *
	 * @throws {Error} If any required field is missing.
	 */
	private validate(): void {
		const missingFields: string[] = [];

		if (!this._id) missingFields.push('id');
		if (!this._name) missingFields.push('name');
		if (!this._type) missingFields.push('type');

		if (missingFields.length > 0) {
			const errorMessage = `Cannot build LocationAggregate: missing required fields: ${missingFields.join(', ')}`;
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}
