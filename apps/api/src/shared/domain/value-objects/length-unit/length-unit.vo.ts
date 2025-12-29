import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * Length Unit Value Object
 * This value object represents a unit of measurement for length/dimensions.
 *
 * @example
 * ```typescript
 * const unit = new LengthUnitValueObject(LengthUnitEnum.CENTIMETER);
 * unit.value; // 'CENTIMETER'
 * ```
 */
export class LengthUnitValueObject extends EnumValueObject<
  typeof LengthUnitEnum
> {
  protected get enumObject(): typeof LengthUnitEnum {
    return LengthUnitEnum;
  }
}
