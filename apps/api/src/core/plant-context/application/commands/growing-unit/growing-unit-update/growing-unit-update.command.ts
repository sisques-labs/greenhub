import { IGrowingUnitUpdateCommandDto } from '@/core/plant-context/application/dtos/commands/growing-unit/growing-unit-update/growing-unit-update-command.dto';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

/**
 * Command for updating an existing container.
 *
 * @remarks
 * This command encapsulates the data needed to update a container aggregate,
 * converting primitives to value objects.
 */
export class GrowingUnitUpdateCommand {
  readonly id: GrowingUnitUuidValueObject;
  readonly name?: GrowingUnitNameValueObject;
  readonly type?: GrowingUnitTypeValueObject;
  readonly capacity?: GrowingUnitCapacityValueObject;
  readonly dimensions?: DimensionsValueObject;

  constructor(props: IGrowingUnitUpdateCommandDto) {
    this.id = new GrowingUnitUuidValueObject(props.id);
    this.name = props.name
      ? new GrowingUnitNameValueObject(props.name)
      : undefined;
    this.type = props.type
      ? new GrowingUnitTypeValueObject(props.type)
      : undefined;
    this.capacity = props.capacity
      ? new GrowingUnitCapacityValueObject(props.capacity)
      : undefined;
    this.dimensions = props.dimensions
      ? new DimensionsValueObject({
          length: props.dimensions.length,
          width: props.dimensions.width,
          height: props.dimensions.height,
          unit: props.dimensions.unit,
        })
      : undefined;
  }
}
