import { ILocationFindByIdQueryDto } from '@/core/location-context/application/dtos/queries/location/location-find-by-id/location-find-by-id.dto';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Query object used to find a location by its unique identifier.
 *
 * @remarks
 * This class encapsulates the parameters needed to query a location aggregate root by its ID.
 */
export class LocationFindByIdQuery {
	/**
	 * The unique identifier of the location as a value object.
	 */
	readonly id: LocationUuidValueObject;

	/**
	 * Creates an instance of {@link LocationFindByIdQuery}.
	 *
	 * @param props - The data transfer object containing the location ID.
	 */
	constructor(props: ILocationFindByIdQueryDto) {
		/**
		 * The location ID provided in the query DTO,
		 * wrapped as a {@link LocationUuidValueObject}.
		 */
		this.id = new LocationUuidValueObject(props.id);
	}
}

