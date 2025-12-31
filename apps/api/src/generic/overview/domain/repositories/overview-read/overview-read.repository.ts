import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { IBaseReadRepository } from '@/shared/domain/interfaces/base-read-repository.interface';

export const OVERVIEW_READ_REPOSITORY_TOKEN = Symbol('OverviewReadRepository');

/**
 * Type alias for the overview read repository.
 * This repository handles read operations (queries) for overview statistics and metrics.
 *
 * @type IOverviewReadRepository
 */
export type IOverviewReadRepository = IBaseReadRepository<OverviewViewModel>;
