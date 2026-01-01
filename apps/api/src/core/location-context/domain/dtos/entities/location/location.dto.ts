import type { LocationDescriptionValueObject } from "@/core/location-context/domain/value-objects/location/location-description/location-description.vo";
import type { LocationNameValueObject } from "@/core/location-context/domain/value-objects/location/location-name/location-name.vo";
import type { LocationTypeValueObject } from "@/core/location-context/domain/value-objects/location/location-type/location-type.vo";
import type { IBaseAggregateDto } from "@/shared/domain/interfaces/base-aggregate-dto.interface";
import type { LocationUuidValueObject } from "@/shared/domain/value-objects/identifiers/location-uuid/location-uuid.vo";

/**
 * Represents the structure required to create a new location entity.
 *
 * @remarks
 * This interface defines the contract for all properties needed to instantiate a new Location entity in the system.
 * It extends the {@link IBaseAggregateDto} interface for common aggregate root fields.
 *
 * @public
 */
export interface ILocationDto {
	id: LocationUuidValueObject;
	name: LocationNameValueObject;
	type: LocationTypeValueObject;
	description: LocationDescriptionValueObject | null;
}
