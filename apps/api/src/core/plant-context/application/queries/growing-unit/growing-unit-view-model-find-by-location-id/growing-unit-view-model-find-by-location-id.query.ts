import { IGrowingUnitViewModelFindByLocationIdQueryDto } from '@/core/plant-context/application/dtos/queries/growing-unit/growing-unit-view-model-find-by-location-id/growing-unit-view-model-find-by-location-id.dto';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * @class
 * @description
 * Represents a query for finding growing unit view models by location ID.
 *
 * @remarks
 * This query encapsulates the required data for retrieving growing unit view models based on location ID.
 */
export class GrowingUnitViewModelFindByLocationIdQuery {
	/**
	 * Unique identifier for the location.
	 */
	readonly locationId: LocationUuidValueObject;

	/**
	 * Creates an instance of GrowingUnitViewModelFindByLocationIdQuery.
	 *
	 * @param props - The data transfer object containing the location ID.
	 */
	constructor(props: IGrowingUnitViewModelFindByLocationIdQueryDto) {
		this.locationId = new LocationUuidValueObject(props.locationId);
	}
}

