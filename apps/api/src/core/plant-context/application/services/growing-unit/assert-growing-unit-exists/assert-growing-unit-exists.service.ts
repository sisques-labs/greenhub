import { Inject, Injectable, Logger } from '@nestjs/common';
import { GrowingUnitNotFoundException } from '@/core/plant-context/application/exceptions/growing-unit/growing-unit-not-found/growing-unit-not-found.exception';
import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import {
	GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
	IGrowingUnitWriteRepository,
} from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * @class AssertGrowingUnitExistsService
 * @description
 * Service responsible for asserting that a growing unit exists in the write repository.
 * This service encapsulates the logic for verifying the existence of a growing unit and throws
 * appropriate exceptions if it is not found.
 *
 * @implements {IBaseService<string, GrowingUnitAggregate>}
 */
@Injectable()
export class AssertGrowingUnitExistsService
	implements IBaseService<string, GrowingUnitAggregate>
{
	/**
	 * Logger instance for the service.
	 * @private
	 * @readonly
	 */
	private readonly logger = new Logger(AssertGrowingUnitExistsService.name);

	/**
	 * Creates an instance of AssertGrowingUnitExistsService.
	 *
	 * @param growingUnitWriteRepository - Write repository for growing units, injected via NestJS DI.
	 */
	constructor(
		@Inject(GROWING_UNIT_WRITE_REPOSITORY_TOKEN)
		private readonly growingUnitWriteRepository: IGrowingUnitWriteRepository,
	) {}

	/**
	 * Asserts that a growing unit exists by its ID.
	 *
	 * @param id - The unique identifier for the growing unit.
	 * @returns A promise that resolves to the {@link GrowingUnitAggregate} if found.
	 * @throws {@link GrowingUnitNotFoundException} if the growing unit does not exist.
	 */
	async execute(id: string): Promise<GrowingUnitAggregate> {
		this.logger.log(`Asserting growing unit exists by id: ${id}`);

		// Attempt to find the growing unit by its identifier
		const existingGrowingUnit =
			await this.growingUnitWriteRepository.findById(id);

		// If the growing unit is not found, throw an exception
		if (!existingGrowingUnit) {
			this.logger.error(`Growing unit not found by id: ${id}`);
			throw new GrowingUnitNotFoundException(id);
		}

		return existingGrowingUnit;
	}
}
