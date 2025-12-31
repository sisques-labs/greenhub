import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { CalculateAverageCommand } from '@/support/math/application/commands/calculate-average/calculate-average.command';

/**
 * Service responsible for calculating dimensions-related metrics for overview.
 *
 * @remarks
 * This service calculates metrics related to dimensions such as volume totals
 * and averages. Uses math commands via CommandBus.
 */
@Injectable()
export class OverviewCalculateDimensionsMetricsService
	implements
		IBaseService<
			GrowingUnitViewModel[],
			Pick<
				IOverviewViewModelDto,
				'growingUnitsWithDimensions' | 'totalVolume' | 'averageVolume'
			>
		>
{
	private readonly logger = new Logger(
		OverviewCalculateDimensionsMetricsService.name,
	);

	constructor(private readonly commandBus: CommandBus) {}

	/**
	 * Calculates dimensions-related metrics from an array of growing units.
	 *
	 * @param growingUnits - Array of growing unit view models
	 * @returns Object containing all dimensions metrics
	 */
	async execute(
		growingUnits: GrowingUnitViewModel[],
	): Promise<
		Pick<
			IOverviewViewModelDto,
			'growingUnitsWithDimensions' | 'totalVolume' | 'averageVolume'
		>
	> {
		this.logger.log(
			`Calculating dimensions metrics for ${growingUnits.length} growing units`,
		);

		// Filter growing units with dimensions
		const growingUnitsWithDimensions = growingUnits.filter(
			(gu) => gu.dimensions !== null,
		);

		const growingUnitsWithDimensionsCount = growingUnitsWithDimensions.length;

		// Calculate total volume
		const totalVolume = growingUnitsWithDimensions.reduce(
			(sum, gu) => sum + gu.volume,
			0,
		);

		// Calculate average volume using math command
		const averageVolume =
			growingUnitsWithDimensionsCount > 0
				? await this.commandBus.execute(
						new CalculateAverageCommand({
							values: growingUnitsWithDimensions.map((gu) => gu.volume),
							decimals: 2,
						}),
					)
				: 0;

		return {
			growingUnitsWithDimensions: growingUnitsWithDimensionsCount,
			totalVolume,
			averageVolume,
		};
	}
}
