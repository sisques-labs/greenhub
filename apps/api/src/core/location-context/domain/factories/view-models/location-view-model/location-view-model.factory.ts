import { Injectable, Logger } from "@nestjs/common";
import type { ILocationViewModelDto } from "@/core/location-context/domain/dtos/view-models/location/location-view-model.dto";
import { LocationAggregate } from "@/core/location-context/domain/aggregates/location.aggregate";
import { LocationPrimitives } from "@/core/location-context/domain/primitives/location.primitives";
import { LocationViewModel } from "@/core/location-context/domain/view-models/location/location.view-model";
import { IReadFactory } from "@/shared/domain/interfaces/read-factory.interface";

/**
 * Factory class for constructing {@link LocationViewModel} instances from
 * various sources such as DTOs, primitives, and aggregates, promoting
 * uniformity in data transformation for presentation and API response.
 *
 * @remarks
 * Implements the {@link IReadFactory} to standardize the transformation methods
 * for the location context.
 *
 * @public
 * @example
 * ```typescript
 * const factory = new LocationViewModelFactory();
 * const viewModel = factory.fromAggregate(locationAggregate);
 * ```
 */
@Injectable()
export class LocationViewModelFactory
	implements
		IReadFactory<
			LocationViewModel,
			ILocationViewModelDto,
			LocationAggregate,
			LocationPrimitives
		>
{
	private readonly logger = new Logger(LocationViewModelFactory.name);

	/**
	 * Converts an {@link ILocationViewModelDto} into a {@link LocationViewModel}.
	 *
	 * @param data - Data transfer object containing location creation properties.
	 * @returns A new {@link LocationViewModel} instance created from the provided DTO.
	 *
	 * @example
	 * ```typescript
	 * const dto: ILocationViewModelDto = {...};
	 * const viewModel = factory.create(dto);
	 * ```
	 */
	public create(data: ILocationViewModelDto): LocationViewModel {
		this.logger.log(
			`Creating location view model from DTO: ${JSON.stringify(data)}`,
		);
		return new LocationViewModel(data);
	}

	/**
	 * Creates a {@link LocationViewModel} from {@link LocationPrimitives}.
	 *
	 * @param locationPrimitives - The basic primitive data describing the location.
	 * @param totalGrowingUnits - The total number of growing units in this location.
	 * @param totalPlants - The total number of plants in this location.
	 * @returns The constructed {@link LocationViewModel} instance.
	 *
	 * @example
	 * ```typescript
	 * const primitives: LocationPrimitives = {...};
	 * const viewModel = factory.fromPrimitives(primitives, 5, 12);
	 * ```
	 */
	public fromPrimitives(
		locationPrimitives: LocationPrimitives,
		totalGrowingUnits: number = 0,
		totalPlants: number = 0,
	): LocationViewModel {
		this.logger.log(
			`Creating location view model from primitives: ${locationPrimitives}`,
		);

		const now = new Date();

		return new LocationViewModel({
			id: locationPrimitives.id,
			name: locationPrimitives.name,
			type: locationPrimitives.type,
			description: locationPrimitives.description,
			totalGrowingUnits,
			totalPlants,
			createdAt: now,
			updatedAt: now,
		});
	}

	/**
	 * Converts a {@link LocationAggregate} into a {@link LocationViewModel}.
	 *
	 * @param locationAggregate - The aggregate root containing the location's domain properties and behaviors.
	 * @param totalGrowingUnits - The total number of growing units in this location.
	 * @param totalPlants - The total number of plants in this location.
	 * @returns The populated {@link LocationViewModel} instance.
	 *
	 * @example
	 * ```typescript
	 * const viewModel = factory.fromAggregate(locationAggregate, 5, 12);
	 * ```
	 */
	public fromAggregate(
		locationAggregate: LocationAggregate,
		totalGrowingUnits: number = 0,
		totalPlants: number = 0,
	): LocationViewModel {
		this.logger.log(
			`Creating location view model from aggregate: ${locationAggregate}`,
		);

		const now = new Date();

		return new LocationViewModel({
			id: locationAggregate.id.value,
			name: locationAggregate.name.value,
			type: locationAggregate.type.value,
			description: locationAggregate.description?.value ?? null,
			totalGrowingUnits,
			totalPlants,
			createdAt: now,
			updatedAt: now,
		});
	}
}

