import { Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GrowingUnitViewModel } from "@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model";
import { IOverviewViewModelDto } from "@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto";
import { IBaseService } from "@/shared/application/services/base-service/base-service.interface";
import { CalculateAverageCommand } from "@/support/math/application/commands/calculate-average/calculate-average.command";
import { CalculateMedianCommand } from "@/support/math/application/commands/calculate-median/calculate-median.command";

/**
 * Service responsible for calculating aggregated metrics for overview.
 *
 * @remarks
 * This service calculates aggregated statistics such as averages, medians,
 * min, and max values. Uses math commands via CommandBus.
 */
@Injectable()
export class OverviewCalculateAggregatedMetricsService
	implements
		IBaseService<
			GrowingUnitViewModel[],
			Pick<
				IOverviewViewModelDto,
				| "averagePlantsPerGrowingUnit"
				| "minPlantsPerGrowingUnit"
				| "maxPlantsPerGrowingUnit"
				| "medianPlantsPerGrowingUnit"
			>
		>
{
	private readonly logger = new Logger(
		OverviewCalculateAggregatedMetricsService.name,
	);

	constructor(private readonly commandBus: CommandBus) {}

	/**
	 * Calculates aggregated metrics from an array of growing units.
	 *
	 * @param growingUnits - Array of growing unit view models
	 * @returns Object containing all aggregated metrics
	 */
	async execute(
		growingUnits: GrowingUnitViewModel[],
	): Promise<
		Pick<
			IOverviewViewModelDto,
			| "averagePlantsPerGrowingUnit"
			| "minPlantsPerGrowingUnit"
			| "maxPlantsPerGrowingUnit"
			| "medianPlantsPerGrowingUnit"
		>
	> {
		this.logger.log(
			`Calculating aggregated metrics for ${growingUnits.length} growing units`,
		);

		const plantsPerGrowingUnit = growingUnits.map((gu) => gu.numberOfPlants);

		// Calculate average using math command
		const averagePlantsPerGrowingUnit =
			plantsPerGrowingUnit.length > 0
				? await this.commandBus.execute(
						new CalculateAverageCommand({
							values: plantsPerGrowingUnit,
							decimals: 2,
						}),
					)
				: 0;

		// Calculate min and max
		const minPlantsPerGrowingUnit =
			plantsPerGrowingUnit.length > 0 ? Math.min(...plantsPerGrowingUnit) : 0;
		const maxPlantsPerGrowingUnit =
			plantsPerGrowingUnit.length > 0 ? Math.max(...plantsPerGrowingUnit) : 0;

		// Calculate median using math command
		const medianPlantsPerGrowingUnit =
			plantsPerGrowingUnit.length > 0
				? await this.commandBus.execute(
						new CalculateMedianCommand({
							values: plantsPerGrowingUnit,
							decimals: 2,
						}),
					)
				: 0;

		return {
			averagePlantsPerGrowingUnit,
			minPlantsPerGrowingUnit,
			maxPlantsPerGrowingUnit,
			medianPlantsPerGrowingUnit,
		};
	}
}
