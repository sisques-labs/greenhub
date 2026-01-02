import { IGrowingUnitFindByLocationIdQueryDto } from '@/core/plant-context/application/dtos/queries/growing-unit/growing-unit-find-by-location-id/growing-unit-find-by-location-id.dto';
import { LocationUuidValueObject } from '@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo';

/**
 * Query object used to find growing units by location ID.
 *
 * @remarks
 * This class encapsulates the parameters needed to query growing unit aggregates by location ID.
 *
 * @public
 */
export class GrowingUnitFindByLocationIdQuery {
	/**
	 * The unique identifier of the location as a value object.
	 */
	readonly locationId: LocationUuidValueObject;

	/**
	 * Creates an instance of {@link GrowingUnitFindByLocationIdQuery}.
	 *
	 * @param props - The data transfer object containing the location ID.
	 */
	constructor(props: IGrowingUnitFindByLocationIdQueryDto) {
		/**
		 * The location ID provided in the query DTO,
		 * wrapped as a {@link LocationUuidValueObject}.
		 */
		this.locationId = new LocationUuidValueObject(props.locationId);
	}
}
