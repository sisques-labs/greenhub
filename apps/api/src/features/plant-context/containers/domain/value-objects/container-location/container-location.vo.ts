import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * Value object representing the location of a container.
 *
 * @remarks
 * This class encapsulates the logic and invariants for container locations in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior.
 * Examples: 'Outdoor - North Side', 'Indoor - Living Room', 'Greenhouse A', etc.
 *
 * @example
 * const containerLocation = new ContainerLocationValueObject('Outdoor - North Side');
 */
export class ContainerLocationValueObject extends StringValueObject {}
