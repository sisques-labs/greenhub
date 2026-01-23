import { Injectable, Logger } from '@nestjs/common';

import { LocationAggregate } from '@/core/location-context/domain/aggregates/location.aggregate';
import type { ILocationViewModelDto } from '@/core/location-context/domain/dtos/view-models/location/location-view-model.dto';
import type { LocationPrimitives } from '@/core/location-context/domain/primitives/location.primitives';
import { LocationViewModel } from '@/core/location-context/domain/view-models/location/location.view-model';
import { IReadBuilder } from '@/shared/domain/interfaces/read-builder.interface';

/**
 * Builder for constructing {@link LocationViewModel} instances using a fluent API.
 *
 * @remarks
 * This builder provides a step-by-step approach to creating `LocationViewModel`
 * instances for the presentation layer. It supports creation from scratch,
 * reconstruction from primitives, and conversion from aggregates.
 *
 * @example
 * ```typescript
 * // Creating a new view model
 * const viewModel = new LocationViewModelBuilder()
 *   .withId('location-id')
 *   .withName('Greenhouse 1')
 *   .withType('GREENHOUSE')
 *   .withDescription('Main greenhouse')
 *   .withCreatedAt(new Date())
 *   .withUpdatedAt(new Date())
 *   .build();
 *
 * // From primitives
 * const viewModel = new LocationViewModelBuilder()
 *   .fromPrimitives(primitives)
 *   .build();
 *
 * // From aggregate
 * const viewModel = new LocationViewModelBuilder()
 *   .fromAggregate(locationAggregate)
 *   .build();
 * ```
 *
 * @see LocationViewModel
 */
@Injectable()
export class LocationViewModelBuilder
	implements IReadBuilder<LocationViewModel, LocationPrimitives>
{
	private readonly logger = new Logger(LocationViewModelBuilder.name);

	private _id?: string;
	private _name?: string;
	private _type?: string;
	private _description: string | null = null;
	private _createdAt?: Date;
	private _updatedAt?: Date;

	/**
	 * Sets the location identifier.
	 *
	 * @param id - The location identifier string.
	 * @returns The builder instance for method chaining.
	 */
	public withId(id: string): this {
		this._id = id;
		return this;
	}

	/**
	 * Sets the location name.
	 *
	 * @param name - The location name.
	 * @returns The builder instance for method chaining.
	 */
	public withName(name: string): this {
		this._name = name;
		return this;
	}

	/**
	 * Sets the location type.
	 *
	 * @param type - The location type.
	 * @returns The builder instance for method chaining.
	 */
	public withType(type: string): this {
		this._type = type;
		return this;
	}

	/**
	 * Sets the location description.
	 *
	 * @param description - The location description or null.
	 * @returns The builder instance for method chaining.
	 */
	public withDescription(description: string | null): this {
		this._description = description;
		return this;
	}

	/**
	 * Sets the creation date.
	 *
	 * @param createdAt - The creation date.
	 * @returns The builder instance for method chaining.
	 */
	public withCreatedAt(createdAt: Date): this {
		this._createdAt = createdAt;
		return this;
	}

	/**
	 * Sets the update date.
	 *
	 * @param updatedAt - The update date.
	 * @returns The builder instance for method chaining.
	 */
	public withUpdatedAt(updatedAt: Date): this {
		this._updatedAt = updatedAt;
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
			`Initializing LocationViewModelBuilder from primitives: ${JSON.stringify(primitives)}`,
		);

		const now = new Date();

		this._id = primitives.id;
		this._name = primitives.name;
		this._type = primitives.type;
		this._description = primitives.description;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Initializes the builder from an aggregate.
	 *
	 * @param aggregate - The location aggregate.
	 * @returns The builder instance for method chaining.
	 */
	public fromAggregate(aggregate: LocationAggregate): this {
		this.logger.log(
			`Initializing LocationViewModelBuilder from aggregate: ${aggregate.id.value}`,
		);

		const now = new Date();

		this._id = aggregate.id.value;
		this._name = aggregate.name.value;
		this._type = aggregate.type.value;
		this._description = aggregate.description?.value ?? null;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Builds the LocationViewModel instance.
	 *
	 * @returns The constructed LocationViewModel.
	 * @throws {Error} If required fields are not set.
	 */
	public build(): LocationViewModel {
		this.validate();

		this.logger.log(`Building LocationViewModel with id: ${this._id}`);

		const dto: ILocationViewModelDto = {
			id: this._id!,
			name: this._name!,
			type: this._type!,
			description: this._description,
			createdAt: this._createdAt!,
			updatedAt: this._updatedAt!,
		};

		return new LocationViewModel(dto);
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
		this._createdAt = undefined;
		this._updatedAt = undefined;
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
		if (!this._createdAt) missingFields.push('createdAt');
		if (!this._updatedAt) missingFields.push('updatedAt');

		if (missingFields.length > 0) {
			const errorMessage = `Cannot build LocationViewModel: missing required fields: ${missingFields.join(', ')}`;
			this.logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	}
}
