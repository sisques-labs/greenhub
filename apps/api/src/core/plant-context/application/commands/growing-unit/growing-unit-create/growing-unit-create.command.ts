import { IGrowingUnitCreateCommandDto } from '@/core/plant-context/application/dtos/commands/growing-unit/growing-unit-create/growing-unit-create-command.dto';
import { GrowingUnitCapacityValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo';
import { GrowingUnitNameValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo';
import { GrowingUnitTypeValueObject } from '@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo';
import { DimensionsValueObject } from '@/shared/domain/value-objects/dimensions/dimensions.vo';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

/**
 * Command for creating a new growing unit.
 *
 * @remarks
 * This command encapsulates the data needed to create a growing unit aggregate,
 * converting primitives to value objects.
 */
export class GrowingUnitCreateCommand {
  readonly id: GrowingUnitUuidValueObject;
  readonly name: GrowingUnitNameValueObject;
  readonly type: GrowingUnitTypeValueObject;
  readonly capacity: GrowingUnitCapacityValueObject;
  readonly dimensions?: DimensionsValueObject | null;

  constructor(props: IGrowingUnitCreateCommandDto) {
    this.id = new GrowingUnitUuidValueObject();
    this.name = new GrowingUnitNameValueObject(props.name);
    this.type = new GrowingUnitTypeValueObject(props.type);
    this.capacity = new GrowingUnitCapacityValueObject(props.capacity);
    this.dimensions =
      props.length && props.width && props.height && props.unit
        ? new DimensionsValueObject({
            length: props.length,
            width: props.width,
            height: props.height,
            unit: props.unit,
          })
        : null;
  }
}
