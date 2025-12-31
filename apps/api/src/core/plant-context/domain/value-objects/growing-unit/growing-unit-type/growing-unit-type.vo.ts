import { GrowingUnitTypeEnum } from "@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum";
import { EnumValueObject } from "@/shared/domain/value-objects/enum/enum.vo";

/**
 * Value object representing the type of a growing unit.
 *
 * @remarks
 * This class encapsulates the logic and invariants for growing unit types in the domain.
 * It extends {@link EnumValueObject} to provide common enum value object behavior
 * and enforces domain-specific constraints for growing unit types.
 *
 * @example
 * const growingUnitType = new GrowingUnitTypeValueObject(ContainerTypeEnum.POT);
 */
export class GrowingUnitTypeValueObject extends EnumValueObject<
	typeof GrowingUnitTypeEnum
> {
	/**
	 * Returns the enum object associated with the growing unit type.
	 *
	 * @returns The {@link GrowingUnitTypeEnum} used for this value object.
	 */
	protected get enumObject(): typeof GrowingUnitTypeEnum {
		return GrowingUnitTypeEnum;
	}
}
