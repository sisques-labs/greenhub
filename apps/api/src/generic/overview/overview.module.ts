import { OverviewUpdatedEventHandler } from '@/generic/overview/application/event-handlers/overview-updated/overview-updated.event-handler';
import { OverviewFindViewModelQueryHandler } from '@/generic/overview/application/queries/overview-find-view-model/overview-find-view-model.query-handler';
import { AssertOverviewViewModelExistsService } from '@/generic/overview/application/services/assert-overview-view-model-exists/assert-overview-view-model-exists.service';
import { OverviewCalculateAggregatedMetricsService } from '@/generic/overview/application/services/overview-calculate-aggregated-metrics/overview-calculate-aggregated-metrics.service';
import { OverviewCalculateCapacityMetricsService } from '@/generic/overview/application/services/overview-calculate-capacity-metrics/overview-calculate-capacity-metrics.service';
import { OverviewCalculateDimensionsMetricsService } from '@/generic/overview/application/services/overview-calculate-dimensions-metrics/overview-calculate-dimensions-metrics.service';
import { OverviewCalculateGrowingUnitMetricsService } from '@/generic/overview/application/services/overview-calculate-growing-unit-metrics/overview-calculate-growing-unit-metrics.service';
import { OverviewCalculatePlantMetricsService } from '@/generic/overview/application/services/overview-calculate-plant-metrics/overview-calculate-plant-metrics.service';
import { OverviewCalculateService } from '@/generic/overview/application/services/overview-calculate/overview-calculate.service';
import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OVERVIEW_READ_REPOSITORY_TOKEN } from '@/generic/overview/domain/repositories/overview-read/overview-read.repository';
import { OverviewMongoDBMapper } from '@/generic/overview/infrastructure/database/mongodb/mappers/overview-mongodb.mapper';
import { OverviewMongoRepository } from '@/generic/overview/infrastructure/database/mongodb/repositories/overview-mongodb.repository';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';

const QUERY_HANDLERS = [OverviewFindViewModelQueryHandler];

const SERVICES = [
  AssertOverviewViewModelExistsService,
  OverviewCalculateService,
  OverviewCalculatePlantMetricsService,
  OverviewCalculateGrowingUnitMetricsService,
  OverviewCalculateCapacityMetricsService,
  OverviewCalculateDimensionsMetricsService,
  OverviewCalculateAggregatedMetricsService,
];

const EVENT_HANDLERS = [OverviewUpdatedEventHandler];

const FACTORIES = [OverviewViewModelFactory];

const MAPPERS = [OverviewMongoDBMapper];

const REPOSITORIES = [
  {
    provide: OVERVIEW_READ_REPOSITORY_TOKEN,
    useClass: OverviewMongoRepository,
  },
];

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [
    ...QUERY_HANDLERS,
    ...EVENT_HANDLERS,
    ...SERVICES,
    ...FACTORIES,
    ...MAPPERS,
    ...REPOSITORIES,
  ],
})
export class OverviewModule {}
