import { IPlantRemoveCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-remove/plant-remove-command.dto';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for removing a plant from a growing unit.
 *
 * @remarks
 * This command encapsulates the data needed to remove a plant from a growing unit,
 * converting primitives to value objects.
 */
export class PlantRemoveCommand {
  readonly growingUnitId: GrowingUnitUuidValueObject;
  readonly plantId: PlantUuidValueObject;

  constructor(props: IPlantRemoveCommandDto) {
    this.growingUnitId = new GrowingUnitUuidValueObject(props.growingUnitId);
    this.plantId = new PlantUuidValueObject(props.plantId);
  }
}
