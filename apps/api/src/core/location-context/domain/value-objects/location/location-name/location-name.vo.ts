import { StringValueObject } from "@/shared/domain/value-objects/string/string.vo";

/**
 * Value object representing the name of a location.
 *
 * @remarks
 * This class encapsulates the logic and invariants for location names in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior
 * and enforces domain-specific constraints for location names (min 1, max 100 characters).
 *
 * @example
 * const locationName = new LocationNameValueObject('Living Room');
 */
export class LocationNameValueObject extends StringValueObject {
	constructor(value: string) {
		super(value, {
			minLength: 1,
			maxLength: 100,
			allowEmpty: false,
		});
	}
}
