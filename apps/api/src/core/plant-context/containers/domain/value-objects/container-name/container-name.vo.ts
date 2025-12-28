import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * Value object representing the name of a container.
 *
 * @remarks
 * This class encapsulates the logic and invariants for container names in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior.
 *
 * @example
 * const containerName = new ContainerNameValueObject('Garden Bed 1');
 */
export class ContainerNameValueObject extends StringValueObject {}
