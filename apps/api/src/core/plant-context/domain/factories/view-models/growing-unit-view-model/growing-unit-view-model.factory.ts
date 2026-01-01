import { Injectable, Logger } from '@nestjs/common';

import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { IGrowingUnitViewModelDto } from '@/core/plant-context/domain/dtos/view-models/growing-unit/growing-unit-view-model.dto';
import { PlantViewModelFactory } from '@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory';
import { GrowingUnitPrimitives } from '@/core/plant-context/domain/primitives/growing-unit.primitives';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';

/**
 * Factory class for constructing {@link GrowingUnitViewModel} instances from
 * various sources such as DTOs, primitives, and aggregates, promoting
 * uniformity in data transformation for presentation and API response.
 *
 * @remarks
 * Implements the {@link IReadFactory} to standardize the transformation methods
 * for the growing unit context.
 *
 * @public
 * @example
 * ```typescript
 * const factory = new GrowingUnitViewModelFactory(new PlantViewModelFactory());
 * const viewModel = factory.fromAggregate(growingUnitAggregate);
 * ```
 */
@Injectable()
export class GrowingUnitViewModelFactory
	implements
		IReadFactory<
			GrowingUnitViewModel,
			IGrowingUnitViewModelDto,
			GrowingUnitAggregate,
			GrowingUnitPrimitives
		>
{
	private readonly logger = new Logger(GrowingUnitViewModelFactory.name);

	/**
	 * Instantiates a new GrowingUnitViewModelFactory.
	 *
	 * @param plantViewModelFactory - A factory used to create view models for plants.
	 */
	constructor(private readonly plantViewModelFactory: PlantViewModelFactory) {}

	/**
	 * Converts an {@link IGrowingUnitViewModelDto} into a {@link GrowingUnitViewModel}.
	 *
	 * @param data - Data transfer object containing growing unit creation properties.
	 * @returns A new {@link GrowingUnitViewModel} instance created from the provided DTO.
	 *
	 * @example
	 * ```typescript
	 * const dto: IGrowingUnitViewModelDto = {...};
	 * const viewModel = factory.create(dto);
	 * ```
	 */
	public create(data: IGrowingUnitViewModelDto): GrowingUnitViewModel {
		this.logger.log(
			`Creating growing unit view model from DTO: ${JSON.stringify(data)}`,
		);
		return new GrowingUnitViewModel(data);
	}

	/**
	 * Creates a {@link GrowingUnitViewModel} from {@link GrowingUnitPrimitives}.
	 *
	 * @param growingUnitPrimitives - The basic primitive data describing the growing unit.
	 * @returns The constructed {@link GrowingUnitViewModel} instance.
	 *
	 * @example
	 * ```typescript
	 * const primitives: GrowingUnitPrimitives = {...};
	 * const viewModel = factory.fromPrimitives(primitives);
	 * ```
	 */
	public fromPrimitives(
		growingUnitPrimitives: GrowingUnitPrimitives,
	): GrowingUnitViewModel {
		this.logger.log(
			`Creating growing unit view model from primitives: ${growingUnitPrimitives}`,
		);

		const now = new Date();

		return new GrowingUnitViewModel({
			id: growingUnitPrimitives.id,
			locationId: growingUnitPrimitives.locationId,
			name: growingUnitPrimitives.name,
			type: growingUnitPrimitives.type,
			capacity: growingUnitPrimitives.capacity,
			dimensions: growingUnitPrimitives.dimensions,
			plants: growingUnitPrimitives.plants.map((plant) =>
				this.plantViewModelFactory.fromPrimitives(plant),
			),
			remainingCapacity: 0,
			numberOfPlants: growingUnitPrimitives.plants.length,
			volume: growingUnitPrimitives.dimensions
				? new DimensionsValueObject(
						growingUnitPrimitives.dimensions,
					).getVolume()
				: 0,
			createdAt: now,
			updatedAt: now,
		});
	}

	/**
	 * Converts a {@link GrowingUnitAggregate} into a {@link GrowingUnitViewModel}.
	 *
	 * @param growingUnitAggregate - The aggregate root containing the growing unit's domain properties and behaviors.
	 * @returns The populated {@link GrowingUnitViewModel} instance.
	 *
	 * @example
	 * ```typescript
	 * const viewModel = factory.fromAggregate(growingUnitAggregate);
	 * ```
	 */
	public fromAggregate(
		growingUnitAggregate: GrowingUnitAggregate,
	): GrowingUnitViewModel {
		this.logger.log(
			`Creating growing unit view model from aggregate: ${growingUnitAggregate}`,
		);

		const now = new Date();

		return new GrowingUnitViewModel({
			id: growingUnitAggregate.id.value,
			locationId: growingUnitAggregate.locationId.value,
			name: growingUnitAggregate.name.value,
			type: growingUnitAggregate.type.value,
			capacity: growingUnitAggregate.capacity.value,
			dimensions: growingUnitAggregate.dimensions?.toPrimitives() ?? null,
			plants: growingUnitAggregate.plants.map((plant) =>
				this.plantViewModelFactory.fromAggregate(plant),
			),
			remainingCapacity: growingUnitAggregate.getRemainingCapacity(),
			numberOfPlants: growingUnitAggregate.plants.length,
			volume: growingUnitAggregate.dimensions?.getVolume() ?? 0,
			createdAt: now,
			updatedAt: now,
		});
	}
}
