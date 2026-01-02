import { GrowingUnitAggregate } from '@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate';
import { IBaseWriteRepository } from '@/shared/domain/interfaces/base-write-repository.interface';

export const GROWING_UNIT_WRITE_REPOSITORY_TOKEN = Symbol(
	'GrowingUnitWriteRepository',
);

/**
 * Write repository interface for GrowingUnit aggregate.
 * Extends IBaseWriteRepository with additional query methods.
 */
export interface IGrowingUnitWriteRepository
	extends IBaseWriteRepository<GrowingUnitAggregate> {
	findByLocationId(locationId: string): Promise<GrowingUnitAggregate[]>;
}
