import { Injectable, Logger } from "@nestjs/common";
import { ITransplantPlantDto } from "@/core/plant-context/domain/dtos/services/transplant.dto";
import { PlantEntity } from "@/core/plant-context/domain/entities/plant/plant.entity";
import { GrowingUnitFullCapacityException } from "@/core/plant-context/domain/exceptions/growing-unit/growing-unit-full-capacity/growing-unit-full-capacity.exception";
import { GrowingUnitPlantNotFoundException } from "@/core/plant-context/domain/exceptions/growing-unit-plant-not-found/growing-unit-plant-not-found.exception";
import { GrowingUnitUuidValueObject } from "@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo";

/**
 * Service responsible for transplanting plants between growing units.
 *
 * @remarks
 * This service encapsulates the logic for moving a plant from one growing unit
 * to another, ensuring business rules are followed:
 * - The plant must exist in the source growing unit
 * - The target growing unit must have available capacity
 * - The plant's growingUnitId is updated after the transplant
 */
@Injectable()
export class PlantTransplantService {
	private readonly logger = new Logger(PlantTransplantService.name);

	/**
	 * Transplants a plant from one growing unit to another.
	 *
	 * @param input - The transplant operation data containing source, target, and plant ID
	 * @returns The transplanted plant entity
	 * @throws {GrowingUnitPlantNotFoundException} If the plant is not found in source
	 * @throws {GrowingUnitFullCapacityException} If the target growing unit has no capacity
	 */
	async execute(input: ITransplantPlantDto): Promise<PlantEntity> {
		const { sourceGrowingUnit, targetGrowingUnit, plantId } = input;

		this.logger.log(
			`Transplanting plant ${plantId} from growing unit ${sourceGrowingUnit.id.value} to ${targetGrowingUnit.id.value}`,
		);

		// 01: Find the plant in the source growing unit
		const plant = sourceGrowingUnit.getPlantById(plantId);

		if (!plant) {
			this.logger.error(
				`Plant ${plantId} not found in source growing unit ${sourceGrowingUnit.id.value}`,
			);
			throw new GrowingUnitPlantNotFoundException(
				sourceGrowingUnit.id.value,
				plantId,
			);
		}

		// 02: Verify target growing unit has capacity
		if (!targetGrowingUnit.hasCapacity()) {
			this.logger.error(
				`Target growing unit ${targetGrowingUnit.id.value} has no available capacity`,
			);
			throw new GrowingUnitFullCapacityException(targetGrowingUnit.id.value);
		}

		// 03: Remove plant from source growing unit
		sourceGrowingUnit.removePlant(plant);

		// 04: Update plant's growing unit ID
		plant.changeGrowingUnit(
			new GrowingUnitUuidValueObject(targetGrowingUnit.id.value),
		);

		// 05: Add plant to target growing unit
		targetGrowingUnit.addPlant(plant);

		this.logger.log(
			`Successfully transplanted plant ${plantId} from growing unit ${sourceGrowingUnit.id.value} to ${targetGrowingUnit.id.value}`,
		);

		return plant;
	}
}
