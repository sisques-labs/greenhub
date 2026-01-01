import { StringValueObject } from "@/shared/domain/value-objects/string/string.vo";

/**
 * Value object representing the description of a location.
 *
 * @remarks
 * This class encapsulates the logic and invariants for location descriptions in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior
 * and enforces domain-specific constraints for location descriptions (max 500 characters, optional).
 *
 * @example
 * const locationDescription = new LocationDescriptionValueObject('North-facing room with good sunlight');
 */
export class LocationDescriptionValueObject extends StringValueObject {
	constructor(value: string | null | undefined) {
		super(value || "", {
			maxLength: 500,
			allowEmpty: true,
		});
	}
}
