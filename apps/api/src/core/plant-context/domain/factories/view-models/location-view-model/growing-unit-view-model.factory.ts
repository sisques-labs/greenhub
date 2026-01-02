import { Injectable, Logger } from '@nestjs/common';

import { ILocationViewModelDto } from '@/core/plant-context/domain/dtos/view-models/location/location-view-model.dto';
import { LocationPrimitives } from '@/core/plant-context/domain/primitives/location/location.primitives';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { LocationViewModel } from '@/core/plant-context/domain/view-models/location/location.view-model';
import { IReadFactory } from '@/shared/domain/interfaces/read-factory.interface';

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
export class LocationViewModelFactory
	implements IReadFactory<LocationViewModel, ILocationViewModelDto>
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

	public fromAggregate(source: unknown): LocationViewModel {
		throw new Error('Method not implemented.');
	}
	public fromPrimitives(primitives: LocationPrimitives): LocationViewModel {
		this.logger.log(
			`Creating location view model from primitives: ${primitives}`,
		);
		const now = new Date();

		return new LocationViewModel({
			id: primitives.id,
			name: primitives.name,
			type: primitives.type,
			description: primitives.description,
			createdAt: now,
			updatedAt: now,
		});
	}
}
