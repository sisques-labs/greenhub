import { IGrowingUnitDeleteCommandDto } from '@/core/plant-context/application/dtos/commands/growing-unit/growing-unit-delete/growing-unit-delete-command.dto';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';

/**
 * Command for deleting a growing unit.
 *
 * @remarks
 * This command encapsulates the data needed to delete a growing unit aggregate.
 */
export class GrowingUnitDeleteCommand {
  readonly id: GrowingUnitUuidValueObject;

  constructor(props: IGrowingUnitDeleteCommandDto) {
    this.id = new GrowingUnitUuidValueObject(props.id);
  }
}
