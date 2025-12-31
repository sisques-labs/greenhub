import { StringValueObject } from "@/shared/domain/value-objects/string/string.vo";

/**
 * Value object representing the name of a plant.
 *
 * @remarks
 * This class encapsulates the logic and invariants for plant names in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior.
 *
 * @example
 * const plantName = new PlantNameValueObject('Aloe Vera');
 */
export class PlantNameValueObject extends StringValueObject {}
