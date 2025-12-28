import { ContainerTypeEnum } from '@/core/plant-context/containers/domain/enums/container-type/container-type.enum';
import { EnumValueObject } from '@/shared/domain/value-objects/enum/enum.vo';

/**
 * Value object representing the type of a container.
 *
 * @remarks
 * This class encapsulates the logic and invariants for container types in the domain.
 * It extends {@link EnumValueObject} to provide common enum value object behavior
 * and enforces domain-specific constraints for container types.
 *
 * @example
 * const containerType = new ContainerTypeValueObject(ContainerTypeEnum.POT);
 */
export class ContainerTypeValueObject extends EnumValueObject<
  typeof ContainerTypeEnum
> {
  /**
   * Returns the enum object associated with the container type.
   *
   * @returns The {@link ContainerTypeEnum} used for this value object.
   */
  protected get enumObject(): typeof ContainerTypeEnum {
    return ContainerTypeEnum;
  }
}
