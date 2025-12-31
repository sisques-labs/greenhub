import { StringValueObject } from "@/shared/domain/value-objects/string/string.vo";

/**
 * Value object representing notes associated with a plant.
 *
 * @remarks
 * This class encapsulates the logic and invariants for plant notes in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior
 * and enforces domain-specific constraints for plant note text when necessary.
 *
 * @example
 * const plantNotes = new PlantNotesValueObject('Likes indirect sunlight.');
 */
export class PlantNotesValueObject extends StringValueObject {}
