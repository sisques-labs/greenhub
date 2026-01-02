import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { IGrowingUnitViewModelDto } from '@/core/plant-context/domain/dtos/view-models/growing-unit/growing-unit-view-model.dto';
import { GrowingUnitViewModelCapacityRequiredException } from '@/core/plant-context/domain/exceptions/growing-unit-view-model/growing-unit-view-model-capacity-required/growing-unit-view-model-capacity-required.exception';
import { GrowingUnitViewModelIdRequiredException } from '@/core/plant-context/domain/exceptions/growing-unit-view-model/growing-unit-view-model-id-required/growing-unit-view-model-id-required.exception';
import { GrowingUnitViewModelLocationRequiredException } from '@/core/plant-context/domain/exceptions/growing-unit-view-model/growing-unit-view-model-location-required/growing-unit-view-model-location-required.exception';
import { GrowingUnitViewModelNameRequiredException } from '@/core/plant-context/domain/exceptions/growing-unit-view-model/growing-unit-view-model-name-required/growing-unit-view-model-name-required.exception';
import { GrowingUnitViewModelTypeRequiredException } from '@/core/plant-context/domain/exceptions/growing-unit-view-model/growing-unit-view-model-type-required/growing-unit-view-model-type-required.exception';
import { GrowingUnitPrimitives } from '@/core/plant-context/domain/primitives/growing-unit/growing-unit.primitives';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Builder class responsible for constructing {@link GrowingUnitViewModel} instances using a fluent interface.
 * This builder pattern allows for flexible and readable construction of view models from different sources
 * such as DTOs, primitives, and aggregates.
 *
 * @remarks
 * The builder provides methods to set individual properties and supports building from different data sources.
 * It automatically handles timestamp generation for `createdAt` and `updatedAt` when not explicitly provided.
 *
 * @example
 * ```typescript
 * const builder = new GrowingUnitViewModelBuilder(plantViewModelFactory, locationViewModelFactory);
 * const viewModel = builder
 *   .withId('growing-unit-1')
 *   .withName('Garden Bed 1')
 *   .withType('GARDEN_BED')
 *   .withCapacity(10)
 *   .withLocation(locationViewModel)
 *   .build();
 * ```
 *
 * @example
 * ```typescript
 * const builder = new GrowingUnitViewModelBuilder(plantViewModelFactory, locationViewModelFactory);
 * const viewModel = builder.fromPrimitives(primitives).build();
 * ```
 */
@Injectable()
export class GrowingUnitViewModelBuilder {
	private readonly logger = new Logger(GrowingUnitViewModelBuilder.name);

	private _id: string | null = null;
	private _location: LocationViewModel | null = null;
	private _name: string | null = null;
	private _type: string | null = null;
	private _capacity: number | null = null;
	private _dimensions: {
		length: number;
		width: number;
		height: number;
		unit: string;
	} | null = null;
	private _plants: PlantViewModel[] = [];
	private _remainingCapacity: number | null = null;
	private _numberOfPlants: number | null = null;
	private _volume: number | null = null;
	private _createdAt: Date | null = null;
	private _updatedAt: Date | null = null;

	constructor(
		private readonly plantViewModelBuilder: PlantViewModelBuilder,
		private readonly locationViewModelBuilder: LocationViewModelBuilder,
	) {}

	/**
	 * Sets the growing unit identifier.
	 *
	 * @param id - The growing unit identifier
	 * @returns The builder instance for method chaining
	 */
	public withId(id: string): this {
		this._id = id;
		return this;
	}

	/**
	 * Sets the location view model.
	 *
	 * @param location - The location view model
	 * @returns The builder instance for method chaining
	 */
	public withLocation(location: LocationViewModel): this {
		this._location = location;
		return this;
	}

	/**
	 * Sets the growing unit name.
	 *
	 * @param name - The growing unit name
	 * @returns The builder instance for method chaining
	 */
	public withName(name: string): this {
		this._name = name;
		return this;
	}

	/**
	 * Sets the growing unit type.
	 *
	 * @param type - The growing unit type
	 * @returns The builder instance for method chaining
	 */
	public withType(type: string): this {
		this._type = type;
		return this;
	}

	/**
	 * Sets the growing unit capacity.
	 *
	 * @param capacity - The growing unit capacity
	 * @returns The builder instance for method chaining
	 */
	public withCapacity(capacity: number): this {
		this._capacity = capacity;
		return this;
	}

	/**
	 * Sets the growing unit dimensions.
	 *
	 * @param dimensions - The growing unit dimensions, or null if none
	 * @returns The builder instance for method chaining
	 */
	public withDimensions(
		dimensions: {
			length: number;
			width: number;
			height: number;
			unit: string;
		} | null,
	): this {
		this._dimensions = dimensions;
		return this;
	}

	/**
	 * Sets the plants array.
	 *
	 * @param plants - The array of plant view models
	 * @returns The builder instance for method chaining
	 */
	public withPlants(plants: PlantViewModel[]): this {
		this._plants = plants;
		return this;
	}

	/**
	 * Sets the remaining capacity.
	 *
	 * @param remainingCapacity - The remaining capacity
	 * @returns The builder instance for method chaining
	 */
	public withRemainingCapacity(remainingCapacity: number): this {
		this._remainingCapacity = remainingCapacity;
		return this;
	}

	/**
	 * Sets the number of plants.
	 *
	 * @param numberOfPlants - The number of plants
	 * @returns The builder instance for method chaining
	 */
	public withNumberOfPlants(numberOfPlants: number): this {
		this._numberOfPlants = numberOfPlants;
		return this;
	}

	/**
	 * Sets the volume.
	 *
	 * @param volume - The volume
	 * @returns The builder instance for method chaining
	 */
	public withVolume(volume: number): this {
		this._volume = volume;
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
	 * @param dto - The DTO containing growing unit view model data
	 * @returns The builder instance for method chaining
	 */
	public fromDto(dto: IGrowingUnitViewModelDto): this {
		this.logger.log(`Populating builder from DTO: ${JSON.stringify(dto)}`);

		this._id = dto.id;
		this._location = dto.location;
		this._name = dto.name;
		this._type = dto.type;
		this._capacity = dto.capacity;
		this._dimensions = dto.dimensions ?? null;
		this._plants = dto.plants;
		this._remainingCapacity = dto.remainingCapacity;
		this._numberOfPlants = dto.numberOfPlants;
		this._volume = dto.volume;
		this._createdAt = dto.createdAt ?? null;
		this._updatedAt = dto.updatedAt ?? null;

		return this;
	}

	/**
	 * Populates the builder from primitives.
	 *
	 * @param primitives - The primitives object representing low-level growing unit data
	 * @returns The builder instance for method chaining
	 */
	public fromPrimitives(primitives: GrowingUnitPrimitives): this {
		this.logger.log(
			`Populating builder from primitives: ${JSON.stringify(primitives)}`,
		);

		const now = new Date();

		// 01: Create plant view models from primitives
		const plants = primitives.plants.map((plant) =>
			this.plantViewModelBuilder.reset().fromPrimitives(plant).build(),
		);

		// 02: Calculate volume from dimensions
		const volume = primitives.dimensions
			? new DimensionsValueObject(primitives.dimensions).getVolume()
			: 0;

		this._id = primitives.id;
		this._location = null; // Location must be set using withLocation() as primitives don't contain location details
		this._name = primitives.name;
		this._type = primitives.type;
		this._capacity = primitives.capacity;
		this._dimensions = primitives.dimensions;
		this._plants = plants;
		this._remainingCapacity = 0;
		this._numberOfPlants = primitives.plants.length;
		this._volume = volume;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Populates the builder from a growing unit aggregate.
	 *
	 * @param aggregate - The growing unit aggregate
	 * @returns The builder instance for method chaining
	 *
	 * @remarks
	 * Creates a minimal location view model from the aggregate's locationId.
	 * Use `withLocation()` to set a complete location view model if available.
	 */
	public fromAggregate(aggregate: GrowingUnitAggregate): this {
		this.logger.log(`Populating builder from aggregate: ${aggregate.id.value}`);

		const now = new Date();

		// 01: Create plant view models from aggregate
		const plants = aggregate.plants.map((plant) =>
			this.plantViewModelBuilder.reset().fromEntity(plant).build(),
		);

		this._id = aggregate.id.value;
		this._location = null; // Location must be set using withLocation() as aggregate doesn't contain location details
		this._name = aggregate.name.value;
		this._type = aggregate.type.value;
		this._capacity = aggregate.capacity.value;
		this._dimensions = aggregate.dimensions?.toPrimitives() ?? null;
		this._plants = plants;
		this._remainingCapacity = aggregate.getRemainingCapacity();
		this._numberOfPlants = aggregate.plants.length;
		this._volume = aggregate.dimensions?.getVolume() ?? 0;
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
		this._location = null;
		this._name = null;
		this._type = null;
		this._capacity = null;
		this._dimensions = null;
		this._plants = [];
		this._remainingCapacity = null;
		this._numberOfPlants = null;
		this._volume = null;
		this._createdAt = null;
		this._updatedAt = null;

		return this;
	}

	/**
	 * Builds and returns the {@link GrowingUnitViewModel} instance.
	 *
	 * @returns The constructed {@link GrowingUnitViewModel}
	 * @throws {GrowingUnitViewModelIdRequiredException} If id is missing
	 * @throws {GrowingUnitViewModelLocationRequiredException} If location is missing
	 * @throws {GrowingUnitViewModelNameRequiredException} If name is missing
	 * @throws {GrowingUnitViewModelTypeRequiredException} If type is missing
	 * @throws {GrowingUnitViewModelCapacityRequiredException} If capacity is missing
	 */
	public build(): GrowingUnitViewModel {
		this.logger.log('Building GrowingUnitViewModel from builder');

		const now = new Date();

		// Validate required fields
		if (!this._id) {
			throw new GrowingUnitViewModelIdRequiredException();
		}

		if (!this._location) {
			throw new GrowingUnitViewModelLocationRequiredException();
		}

		if (!this._name) {
			throw new GrowingUnitViewModelNameRequiredException();
		}

		if (!this._type) {
			throw new GrowingUnitViewModelTypeRequiredException();
		}

		if (this._capacity === null || this._capacity === undefined) {
			throw new GrowingUnitViewModelCapacityRequiredException();
		}

		// Optional fields: dimensions can be null
		// Calculated fields: use provided values or calculate from current state
		const remainingCapacity =
			this._remainingCapacity ?? this._capacity - this._plants.length;
		const numberOfPlants = this._numberOfPlants ?? this._plants.length;
		const volume =
			this._volume ??
			(this._dimensions
				? new DimensionsValueObject(this._dimensions).getVolume()
				: 0);

		const dto: IGrowingUnitViewModelDto = {
			id: this._id,
			location: this._location,
			name: this._name,
			type: this._type,
			capacity: this._capacity,
			dimensions: this._dimensions ?? null,
			plants: this._plants,
			remainingCapacity,
			numberOfPlants,
			volume,
			createdAt: this._createdAt ?? now,
			updatedAt: this._updatedAt ?? now,
		};

		return new GrowingUnitViewModel(dto);
	}
}
