import { PlantStatusEnum } from "@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum";
import { EnumValueObject } from "@/shared/domain/value-objects/enum/enum.vo";

/**
 * Value object representing the status of a plant.
 *
 * @remarks
 * This class encapsulates the logic and invariants regarding plant status within the domain.
 * It extends {@link EnumValueObject} to provide common enum value object behavior
 * and enforces domain-specific constraints for plant statuses when necessary.
 *
 * @example
 * const status = new PlantStatusValueObject(PlantStatusEnum.Alive);
 */
export class PlantStatusValueObject extends EnumValueObject<
	typeof PlantStatusEnum
> {
	/**
	 * Returns the enum object associated with the plant status.
	 *
	 * @returns The {@link PlantStatusEnum} used for this value object.
	 */
	protected get enumObject(): typeof PlantStatusEnum {
		return PlantStatusEnum;
	}
}
