import { Injectable, Logger } from '@nestjs/common';

import {
	IPlantGrowingUnitReference,
	IPlantViewModelDto,
} from '@/core/plant-context/domain/dtos/view-models/plant/plant-view-model.dto';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { PlantViewModelIdRequiredException } from '@/core/plant-context/domain/exceptions/plant-view-model/plant-view-model-id-required/plant-view-model-id-required.exception';
import { PlantViewModelNameRequiredException } from '@/core/plant-context/domain/exceptions/plant-view-model/plant-view-model-name-required/plant-view-model-name-required.exception';
import { PlantViewModelSpeciesRequiredException } from '@/core/plant-context/domain/exceptions/plant-view-model/plant-view-model-species-required/plant-view-model-species-required.exception';
import { PlantViewModelStatusRequiredException } from '@/core/plant-context/domain/exceptions/plant-view-model/plant-view-model-status-required/plant-view-model-status-required.exception';
import { PlantPrimitives } from '@/core/plant-context/domain/primitives/plant/plant.primitives';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';

/**
 * Builder class responsible for constructing {@link PlantViewModel} instances using a fluent interface.
 * This builder pattern allows for flexible and readable construction of view models from different sources
 * such as DTOs, primitives, and aggregates.
 *
 * @remarks
 * The builder provides methods to set individual properties and supports building from different data sources.
 * It automatically handles timestamp generation for `createdAt` and `updatedAt` when not explicitly provided.
 *
 * @example
 * ```typescript
 * const builder = new PlantViewModelBuilder();
 * const viewModel = builder
 *   .withId('plant-1')
 *   .withName('Basil')
 *   .withSpecies('Ocimum basilicum')
 *   .withStatus('PLANTED')
 *   .build();
 * ```
 *
 * @example
 * ```typescript
 * const builder = new PlantViewModelBuilder();
 * const viewModel = builder.fromPrimitives(primitives).build();
 * ```
 */
@Injectable()
export class PlantViewModelBuilder {
	private readonly logger = new Logger(PlantViewModelBuilder.name);

	private _id: string | null = null;
	private _growingUnitId: string | null = null;
	private _location: LocationViewModel | null = null;
	private _growingUnit: IPlantGrowingUnitReference | null = null;
	private _name: string | null = null;
	private _species: string | null = null;
	private _plantedDate: Date | null = null;
	private _notes: string | null = null;
	private _status: string | null = null;
	private _createdAt: Date | null = null;
	private _updatedAt: Date | null = null;

	/**
	 * Sets the plant identifier.
	 *
	 * @param id - The plant identifier
	 * @returns The builder instance for method chaining
	 */
	public withId(id: string): this {
		this._id = id;
		return this;
	}

	/**
	 * Sets the growing unit identifier.
	 *
	 * @param growingUnitId - The growing unit identifier
	 * @returns The builder instance for method chaining
	 */
	public withGrowingUnitId(growingUnitId: string): this {
		this._growingUnitId = growingUnitId;
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
	 * Sets the growing unit reference with basic information.
	 *
	 * @param growingUnit - The growing unit reference
	 * @returns The builder instance for method chaining
	 */
	public withGrowingUnit(growingUnit: IPlantGrowingUnitReference): this {
		this._growingUnit = growingUnit;
		return this;
	}

	/**
	 * Sets the plant name.
	 *
	 * @param name - The plant name
	 * @returns The builder instance for method chaining
	 */
	public withName(name: string): this {
		this._name = name;
		return this;
	}

	/**
	 * Sets the plant species.
	 *
	 * @param species - The plant species
	 * @returns The builder instance for method chaining
	 */
	public withSpecies(species: string): this {
		this._species = species;
		return this;
	}

	/**
	 * Sets the planted date.
	 *
	 * @param plantedDate - The planted date, or null if unknown
	 * @returns The builder instance for method chaining
	 */
	public withPlantedDate(plantedDate: Date | null): this {
		this._plantedDate = plantedDate;
		return this;
	}

	/**
	 * Sets the plant notes.
	 *
	 * @param notes - The plant notes, or null if none
	 * @returns The builder instance for method chaining
	 */
	public withNotes(notes: string | null): this {
		this._notes = notes;
		return this;
	}

	/**
	 * Sets the plant status.
	 *
	 * @param status - The plant status
	 * @returns The builder instance for method chaining
	 */
	public withStatus(status: string): this {
		this._status = status;
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
	 * @param dto - The DTO containing plant view model data
	 * @returns The builder instance for method chaining
	 */
	public fromDto(dto: IPlantViewModelDto): this {
		this.logger.log(`Populating builder from DTO: ${JSON.stringify(dto)}`);

		this._id = dto.id;
		this._growingUnitId = dto.growingUnitId ?? null;
		this._location = dto.location ?? null;
		this._growingUnit = dto.growingUnit ?? null;
		this._name = dto.name;
		this._species = dto.species;
		this._plantedDate = dto.plantedDate;
		this._notes = dto.notes;
		this._status = dto.status;
		this._createdAt = dto.createdAt ?? null;
		this._updatedAt = dto.updatedAt ?? null;

		return this;
	}

	/**
	 * Populates the builder from primitives.
	 *
	 * @param primitives - The primitives object representing low-level plant data
	 * @returns The builder instance for method chaining
	 */
	public fromPrimitives(primitives: PlantPrimitives): this {
		this.logger.log(
			`Populating builder from primitives: ${JSON.stringify(primitives)}`,
		);

		const now = new Date();

		this._id = primitives.id;
		this._growingUnitId = null;
		this._name = primitives.name;
		this._species = primitives.species;
		this._plantedDate = primitives.plantedDate;
		this._notes = primitives.notes;
		this._status = primitives.status;
		this._createdAt = now;
		this._updatedAt = now;

		return this;
	}

	/**
	 * Populates the builder from a plant entity.
	 *
	 * @param entity - The plant entity
	 * @returns The builder instance for method chaining
	 */
	public fromEntity(entity: PlantEntity): this {
		this.logger.log(`Populating builder from entity: ${entity.id.value}`);

		const now = new Date();

		this._id = entity.id.value;
		this._growingUnitId = null;
		this._name = entity.name.value;
		this._species = entity.species.value;
		this._plantedDate = entity.plantedDate?.value ?? null;
		this._notes = entity.notes?.value ?? null;
		this._status = entity.status.value;
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
		this._growingUnitId = null;
		this._location = null;
		this._growingUnit = null;
		this._name = null;
		this._species = null;
		this._plantedDate = null;
		this._notes = null;
		this._status = null;
		this._createdAt = null;
		this._updatedAt = null;

		return this;
	}

	/**
	 * Builds and returns the {@link PlantViewModel} instance.
	 *
	 * @returns The constructed {@link PlantViewModel}
	 * @throws {Error} If required fields are missing
	 */
	public build(): PlantViewModel {
		this.logger.log('Building PlantViewModel from builder');

		const now = new Date();

		// Validate required fields
		if (!this._id) {
			throw new PlantViewModelIdRequiredException();
		}

		if (!this._name) {
			throw new PlantViewModelNameRequiredException();
		}

		if (!this._species) {
			throw new PlantViewModelSpeciesRequiredException();
		}

		if (!this._status) {
			throw new PlantViewModelStatusRequiredException();
		}

		// Optional fields: notes, plantedDate, growingUnitId, location, and growingUnit can be null/undefined
		const dto: IPlantViewModelDto = {
			id: this._id,
			growingUnitId: this._growingUnitId ?? undefined,
			location: this._location ?? undefined,
			growingUnit: this._growingUnit ?? undefined,
			name: this._name,
			species: this._species,
			plantedDate: this._plantedDate ?? null,
			notes: this._notes ?? null,
			status: this._status,
			createdAt: this._createdAt ?? now,
			updatedAt: this._updatedAt ?? now,
		};

		return new PlantViewModel(dto);
	}
}
