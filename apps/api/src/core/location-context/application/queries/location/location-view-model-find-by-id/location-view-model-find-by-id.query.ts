import { ILocationViewModelFindByIdQueryDto } from '@/core/location-context/application/dtos/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.dto';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Represents a query for finding a location view model by its unique identifier.
 *
 * @remarks
 * This query encapsulates the required data for retrieving a location view model based on its ID.
 */
export class LocationViewModelFindByIdQuery {
	/**
	 * Unique identifier for the location.
	 */
	readonly id: LocationUuidValueObject;

	/**
	 * Creates an instance of LocationViewModelFindByIdQuery.
	 *
	 * @param props - The data transfer object containing the location's ID.
	 */
	constructor(props: ILocationViewModelFindByIdQueryDto) {
		this.id = new LocationUuidValueObject(props.id);
	}
}

