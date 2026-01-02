import { Injectable, Logger } from '@nestjs/common';

import { ILocationViewModelDto } from '@/core/plant-context/domain/dtos/view-models/location/location-view-model.dto';
import { LocationPrimitives } from '@/core/plant-context/domain/primitives/location/location.primitives';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { LocationViewModelIdRequiredException } from '@/core/plant-context/domain/exceptions/location-view-model/location-view-model-id-required/location-view-model-id-required.exception';
import { LocationViewModelNameRequiredException } from '@/core/plant-context/domain/exceptions/location-view-model/location-view-model-name-required/location-view-model-name-required.exception';
import { LocationViewModelTypeRequiredException } from '@/core/plant-context/domain/exceptions/location-view-model/location-view-model-type-required/location-view-model-type-required.exception';

/**
 * Builder class responsible for constructing {@link LocationViewModel} instances using a fluent interface.
 * This builder pattern allows for flexible and readable construction of view models from different sources
 * such as DTOs and primitives.
 *
 * @remarks
 * The builder provides methods to set individual properties and supports building from different data sources.
 * It automatically handles timestamp generation for `createdAt` and `updatedAt` when not explicitly provided.
 *
 * @example
 * ```typescript
 * const builder = new LocationViewModelBuilder();
 * const viewModel = builder
 *   .withId('location-1')
 *   .withName('Living Room')
 *   .withType('INDOOR')
 *   .build();
 * ```
 *
 * @example
 * ```typescript
 * const builder = new LocationViewModelBuilder();
 * const viewModel = builder.fromPrimitives(primitives).build();
 * ```
 */
@Injectable()
export class LocationViewModelBuilder {
	private readonly logger = new Logger(LocationViewModelBuilder.name);

	private _id: string | null = null;
	private _name: string | null = null;
	private _type: string | null = null;
	private _description: string | null = null;
	private _createdAt: Date | null = null;
	private _updatedAt: Date | null = null;

	/**
	 * Sets the location identifier.
	 *
	 * @param id - The location identifier
	 * @returns The builder instance for method chaining
	 */
	public withId(id: string): this {
		this._id = id;
		return this;
	}

	/**
	 * Sets the location name.
	 *
	 * @param name - The location name
	 * @returns The builder instance for method chaining
	 */
	public withName(name: string): this {
		this._name = name;
		return this;
	}

	/**
	 * Sets the location type.
	 *
	 * @param type - The location type
	 * @returns The builder instance for method chaining
	 */
	public withType(type: string): this {
		this._type = type;
		return this;
	}

	/**
	 * Sets the location description.
	 *
	 * @param description - The location description, or null if none
	 * @returns The builder instance for method chaining
	 */
	public withDescription(description: string | null): this {
		this._description = description;
		return this;
	}

	/**
	 * Sets the creation timestamp.
	 *
	 * @param createdAt - The creation timestamp
	 * @returns The builder instance for method chaining
	 */
	public withCreatedAt(createdAt: Date): this {
		this._createdAt = createdAt;
		return this;
	}

	/**
	 * Sets the update timestamp.
	 *
	 * @param updatedAt - The update timestamp
	 * @returns The builder instance for method chaining
	 */
	public withUpdatedAt(updatedAt: Date): this {
		this._updatedAt = updatedAt;
		return this;
	}

	/**
	 * Populates the builder from a DTO.
	 *
	 * @param dto - The DTO containing location view model data
	 * @returns The builder instance for method chaining
	 */
	public fromDto(dto: ILocationViewModelDto): this {
		this.logger.log(`Populating builder from DTO: ${JSON.stringify(dto)}`);

		this._id = dto.id;
		this._name = dto.name;
		this._type = dto.type;
		this._description = dto.description ?? null;
		this._createdAt = dto.createdAt ?? null;
		this._updatedAt = dto.updatedAt ?? null;

		return this;
	}

	/**
	 * Populates the builder from primitives.
	 *
	 * @param primitives - The primitives object representing low-level location data
	 * @returns The builder instance for method chaining
	 */
	public fromPrimitives(primitives: LocationPrimitives): this {
		this.logger.log(
			`Populating builder from primitives: ${JSON.stringify(primitives)}`,
		);

		const now = new Date();

		this._id = primitives.id;
		this._name = primitives.name;
		this._type = primitives.type;
		this._description = primitives.description ?? null;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Resets the builder to its initial state.
	 *
	 * @returns The builder instance for method chaining
	 */
	public reset(): this {
		this._id = null;
		this._name = null;
		this._type = null;
		this._description = null;
		this._createdAt = null;
		this._updatedAt = null;

		return this;
	}

	/**
	 * Builds and returns the {@link LocationViewModel} instance.
	 *
	 * @returns The constructed {@link LocationViewModel}
	 * @throws {LocationViewModelIdRequiredException} If id is missing
	 * @throws {LocationViewModelNameRequiredException} If name is missing
	 * @throws {LocationViewModelTypeRequiredException} If type is missing
	 */
	public build(): LocationViewModel {
		this.logger.log('Building LocationViewModel from builder');

		const now = new Date();

		// Validate required fields
		if (!this._id) {
			throw new LocationViewModelIdRequiredException();
		}

		if (!this._name) {
			throw new LocationViewModelNameRequiredException();
		}

		if (!this._type) {
			throw new LocationViewModelTypeRequiredException();
		}

		// Optional field: description can be null
		const dto: ILocationViewModelDto = {
			id: this._id,
			name: this._name,
			type: this._type,
			description: this._description ?? null,
			createdAt: this._createdAt ?? now,
			updatedAt: this._updatedAt ?? now,
		};

		return new LocationViewModel(dto);
	}
}

