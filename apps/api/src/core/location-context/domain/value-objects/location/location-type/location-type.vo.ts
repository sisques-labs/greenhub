import { LocationTypeEnum } from "@/core/location-context/domain/enums/location-type/location-type.enum";
import { EnumValueObject } from "@/shared/domain/value-objects/enum/enum.vo";

/**
 * Value object representing the type of a location.
 *
 * @remarks
 * This class encapsulates the logic and invariants for location types in the domain.
 * It extends {@link EnumValueObject} to provide common enum value object behavior
 * and enforces domain-specific constraints for location types.
 *
 * @example
 * const locationType = new LocationTypeValueObject(LocationTypeEnum.ROOM);
 */
export class LocationTypeValueObject extends EnumValueObject<
	typeof LocationTypeEnum
> {
	/**
	 * Returns the enum object associated with the location type.
	 *
	 * @returns The {@link LocationTypeEnum} used for this value object.
	 */
	protected get enumObject(): typeof LocationTypeEnum {
		return LocationTypeEnum;
	}
}
