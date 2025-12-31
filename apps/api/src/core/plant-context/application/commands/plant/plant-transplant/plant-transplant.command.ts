import { IPlantTransplantCommandDto } from '@/core/plant-context/application/dtos/commands/plant/plant-transplant/plant-transplant-command.dto';
import { GrowingUnitUuidValueObject } from '@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo';
import { PlantUuidValueObject } from '@/shared/domain/value-objects/identifiers/plant-uuid/plant-uuid.vo';

/**
 * Command for transplanting a plant from one growing unit to another.
 *
 * @remarks
 * This command encapsulates the data needed to transplant a plant between growing units,
 * converting primitives to value objects.
 */
export class PlantTransplantCommand {
	readonly sourceGrowingUnitId: GrowingUnitUuidValueObject;
	readonly targetGrowingUnitId: GrowingUnitUuidValueObject;
	readonly plantId: PlantUuidValueObject;

	constructor(props: IPlantTransplantCommandDto) {
		this.sourceGrowingUnitId = new GrowingUnitUuidValueObject(
			props.sourceGrowingUnitId,
		);
		this.targetGrowingUnitId = new GrowingUnitUuidValueObject(
			props.targetGrowingUnitId,
		);
		this.plantId = new PlantUuidValueObject(props.plantId);
	}
}
