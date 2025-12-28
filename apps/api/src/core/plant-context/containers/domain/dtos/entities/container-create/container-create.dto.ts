import { ContainerNameValueObject } from '@/core/plant-context/containers/domain/value-objects/container-name/container-name.vo';
import { ContainerTypeValueObject } from '@/core/plant-context/containers/domain/value-objects/container-type/container-type.vo';
import { IBaseAggregateDto } from '@/shared/domain/interfaces/base-aggregate-dto.interface';
import { ContainerUuidValueObject } from '@/shared/domain/value-objects/identifiers/container-uuid/container-uuid.vo';

/**
 * Represents the structure required to create a new container entity.
 *
 * @remarks
 * This interface defines the contract for all properties needed to instantiate a new Container entity in the system.
 * It extends the {@link IBaseAggregateDto} interface for common aggregate root fields.
 *
 * @public
 */
export interface IContainerCreateDto extends IBaseAggregateDto {
  id: ContainerUuidValueObject;
  name: ContainerNameValueObject;
  type: ContainerTypeValueObject;
}
