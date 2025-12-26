import { StringValueObject } from '@/shared/domain/value-objects/string/string.vo';

/**
 * Value object representing metadata for a container.
 *
 * @remarks
 * This class encapsulates the logic and invariants for container metadata in the domain.
 * It extends {@link StringValueObject} to inherit common string value object behavior.
 * Metadata can be used to store additional information as JSON string.
 *
 * @example
 * const containerMetadata = new ContainerMetadataValueObject('{"capacity": 10, "material": "ceramic"}');
 */
export class ContainerMetadataValueObject extends StringValueObject {}
