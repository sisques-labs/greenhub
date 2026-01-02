import { Injectable, Logger } from '@nestjs/common';

import { PlantNotFoundException } from '@/core/plant-context/application/exceptions/plant/plant-not-found/plant-not-found.exception';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { PlantEntity } from '@/core/plant-context/domain/entities/plant/plant.entity';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Input DTO for the assert plant exists in growing unit service.
 */
export interface IAssertPlantExistsInGrowingUnitInput {
	growingUnitAggregate: GrowingUnitAggregate;
	plantId: string;
}

/**
 * Service responsible for asserting that a plant exists in a growing unit.
 *
 * @remarks
 * This service provides a method to assert the existence of a plant within a growing unit
 * aggregate. If the plant does not exist in the growing unit, an exception is thrown.
 */
@Injectable()
export class AssertPlantExistsInGrowingUnitService
	implements IBaseService<IAssertPlantExistsInGrowingUnitInput, PlantEntity>
{
	private readonly logger = new Logger(
		AssertPlantExistsInGrowingUnitService.name,
	);

	/**
	 * Asserts that a plant exists in the given growing unit aggregate.
	 *
	 * @param input - The input containing the growing unit aggregate and plant id
	 * @returns The plant entity if found
	 * @throws {PlantNotFoundException} If the plant does not exist in the growing unit
	 */
	async execute(
		input: IAssertPlantExistsInGrowingUnitInput,
	): Promise<PlantEntity> {
		this.logger.log(
			`Asserting plant ${input.plantId} exists in growing unit ${input.growingUnitAggregate.id.value}`,
		);

		// 01: Check if the plant exists in the growing unit
		if (!input.growingUnitAggregate.hasPlant(input.plantId)) {
			this.logger.error(
				`Plant ${input.plantId} not found in growing unit ${input.growingUnitAggregate.id.value}`,
			);
			throw new PlantNotFoundException(input.plantId);
		}

		return input.growingUnitAggregate.getPlantById(input.plantId);
	}
}
