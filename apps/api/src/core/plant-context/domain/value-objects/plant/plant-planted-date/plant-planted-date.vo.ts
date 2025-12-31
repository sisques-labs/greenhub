import { DateValueObject } from "@/shared/domain/value-objects/date/date.vo";

/**
 * Value object representing the planted date of a plant.
 *
 * @remarks
 * This class encapsulates the logic and invariants for a plant's planted date within the domain.
 * It extends {@link DateValueObject} to inherit common date value object behavior and enforces
 * domain-specific constraints for planted dates when necessary.
 *
 * @example
 * const plantedDate = new PlantPlantedDateValueObject(new Date('2023-04-10'));
 */
export class PlantPlantedDateValueObject extends DateValueObject {}
