import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const GROWING_UNIT_READ_REPOSITORY_TOKEN = Symbol(
	'GrowingUnitReadRepository',
);

/**
 * Read repository interface for GrowingUnit view model.
 * Extends IBaseReadRepository with additional query methods.
 */
export type IGrowingUnitReadRepository =
	IBaseReadRepository<GrowingUnitViewModel>;
