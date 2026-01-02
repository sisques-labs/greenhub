import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GrowingUnitFindByCriteriaQuery } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria.query';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { OverviewCalculateAggregatedMetricsService } from '@/generic/overview/application/services/overview-calculate-aggregated-metrics/overview-calculate-aggregated-metrics.service';
import { OverviewCalculateCapacityMetricsService } from '@/generic/overview/application/services/overview-calculate-capacity-metrics/overview-calculate-capacity-metrics.service';
import { OverviewCalculateDimensionsMetricsService } from '@/generic/overview/application/services/overview-calculate-dimensions-metrics/overview-calculate-dimensions-metrics.service';
import { OverviewCalculateGrowingUnitMetricsService } from '@/generic/overview/application/services/overview-calculate-growing-unit-metrics/overview-calculate-growing-unit-metrics.service';
import { OverviewCalculatePlantMetricsService } from '@/generic/overview/application/services/overview-calculate-plant-metrics/overview-calculate-plant-metrics.service';
import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { OverviewViewModelFactory } from '@/generic/overview/domain/factories/view-models/plant-view-model/overview-view-model.factory';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { Criteria } from '@/shared/domain/entities/criteria';
import { OverviewUuidValueObject } from '@/shared/domain/value-objects/identifiers/overview-uuid/overview-uuid.vo';

/**
 * Service responsible for calculating overview metrics from plant context data.
 *
 * @remarks
 * This service aggregates data from growing units and plants to calculate
 * comprehensive overview statistics using math commands via CommandBus.
 */
@Injectable()
export class OverviewCalculateService
	implements IBaseService<string, OverviewViewModel>
{
	private readonly logger = new Logger(OverviewCalculateService.name);
	private readonly BATCH_SIZE = 500;

	constructor(
		private readonly queryBus: QueryBus,
		private readonly overviewViewModelFactory: OverviewViewModelFactory,
		private readonly calculatePlantMetricsService: OverviewCalculatePlantMetricsService,
		private readonly calculateGrowingUnitMetricsService: OverviewCalculateGrowingUnitMetricsService,
		private readonly calculateCapacityMetricsService: OverviewCalculateCapacityMetricsService,
		private readonly calculateDimensionsMetricsService: OverviewCalculateDimensionsMetricsService,
		private readonly calculateAggregatedMetricsService: OverviewCalculateAggregatedMetricsService,
	) {}

	/**
	 * Calculates and returns an overview view model with all metrics computed.
	 *
	 * @param overviewId - Optional ID for the overview (defaults to generated UUID)
	 * @returns The calculated overview view model
	 */
	async execute(overviewId?: string): Promise<OverviewViewModel> {
		this.logger.log('Calculating overview metrics');

		// 01: Get all growing units in batches
		const growingUnits = await this.getAllGrowingUnitsInBatches(
			this.BATCH_SIZE,
		);
		this.logger.log(`Found ${growingUnits.length} total growing units`);

		// 02: Extract all plants from growing units
		const allPlants = growingUnits.flatMap((gu) => gu.plants);
		this.logger.log(`Found ${allPlants.length} total plants`);

		// 03: Calculate plant metrics
		const plantMetrics =
			await this.calculatePlantMetricsService.execute(allPlants);

		// 04: Calculate growing unit metrics
		const growingUnitMetrics =
			await this.calculateGrowingUnitMetricsService.execute(growingUnits);

		// 05: Calculate capacity metrics
		const capacityMetrics =
			await this.calculateCapacityMetricsService.execute(growingUnits);

		// 06: Calculate dimensions metrics
		const dimensionsMetrics =
			await this.calculateDimensionsMetricsService.execute(growingUnits);

		// 07: Calculate aggregated metrics
		const aggregatedMetrics =
			await this.calculateAggregatedMetricsService.execute(growingUnits);

		// 08: Create overview view model DTO
		const now = new Date();
		const overviewDto: IOverviewViewModelDto = {
			id: overviewId || new OverviewUuidValueObject().value,
			...plantMetrics,
			...growingUnitMetrics,
			...capacityMetrics,
			...dimensionsMetrics,
			...aggregatedMetrics, // This includes averagePlantsPerGrowingUnit
			createdAt: now,
			updatedAt: now,
		};

		// 09: Create and return overview view model
		return this.overviewViewModelFactory.create(overviewDto);
	}

	/**
	 * Gets all growing units in batches to avoid loading everything into memory at once.
	 *
	 * @returns Array of all growing units
	 */
	private async getAllGrowingUnitsInBatches(
		batchSize: number,
	): Promise<GrowingUnitViewModel[]> {
		const allGrowingUnits: GrowingUnitViewModel[] = [];

		// 01: Get first page to know total pages
		const firstPageResult = await this.queryBus.execute(
			new GrowingUnitFindByCriteriaQuery(
				new Criteria([], [], { page: 1, perPage: batchSize }),
			),
		);

		allGrowingUnits.push(...firstPageResult.items);
		this.logger.log(
			`Fetched page 1/${firstPageResult.totalPages} (${firstPageResult.items.length} items)`,
		);

		// 02: If there are more pages, fetch them in parallel batches
		if (firstPageResult.totalPages > 1) {
			const remainingPages = Array.from(
				{ length: firstPageResult.totalPages - 1 },
				(_, i) => i + 2,
			);

			// Fetch remaining pages in parallel
			const pageResults = await Promise.all(
				remainingPages.map((page) =>
					this.queryBus.execute(
						new GrowingUnitFindByCriteriaQuery(
							new Criteria([], [], { page, perPage: batchSize }),
						),
					),
				),
			);

			// Accumulate all items
			pageResults.forEach((result, index) => {
				allGrowingUnits.push(...result.items);
				this.logger.log(
					`Fetched page ${remainingPages[index]}/${firstPageResult.totalPages} (${result.items.length} items)`,
				);
			});
		}

		this.logger.log(
			`Total growing units fetched: ${allGrowingUnits.length} from ${firstPageResult.totalPages} pages`,
		);

		return allGrowingUnits;
	}
}
