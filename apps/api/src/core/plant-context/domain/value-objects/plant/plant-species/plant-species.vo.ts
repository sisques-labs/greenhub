import { StringValueObject } from "@/shared/domain/value-objects/string/string.vo";

/**
 * Value object representing the species of a plant.
 *
 * @remarks
 * This class encapsulates the logic and invariants for plant species in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior
 * and enforces domain-specific constraints for plant species names when necessary.
 *
 * @example
 * const plantSpecies = new PlantSpeciesValueObject('Rosa chinensis');
 */
export class PlantSpeciesValueObject extends StringValueObject {}
