import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';
import { CalculatePercentageCommand } from '@/support/math/application/commands/calculate-percentage/calculate-percentage.command';

/**
 * Service responsible for calculating capacity-related metrics for overview.
 *
 * @remarks
 * This service calculates metrics related to capacity such as totals, occupancy rates,
 * and growing units at limit or full capacity. Uses math commands via CommandBus.
 */
@Injectable()
export class OverviewCalculateCapacityMetricsService
	implements
		IBaseService<
			GrowingUnitViewModel[],
			Pick<
				IOverviewViewModelDto,
				| 'totalCapacity'
				| 'totalCapacityUsed'
				| 'averageOccupancy'
				| 'growingUnitsAtLimit'
				| 'growingUnitsFull'
				| 'totalRemainingCapacity'
			>
		>
{
	private readonly logger = new Logger(
		OverviewCalculateCapacityMetricsService.name,
	);

	constructor(private readonly commandBus: CommandBus) {}

	/**
	 * Calculates capacity-related metrics from an array of growing units.
	 *
	 * @param growingUnits - Array of growing unit view models
	 * @returns Object containing all capacity metrics
	 */
	async execute(
		growingUnits: GrowingUnitViewModel[],
	): Promise<
		Pick<
			IOverviewViewModelDto,
			| 'totalCapacity'
			| 'totalCapacityUsed'
			| 'averageOccupancy'
			| 'growingUnitsAtLimit'
			| 'growingUnitsFull'
			| 'totalRemainingCapacity'
		>
	> {
		this.logger.log(
			`Calculating capacity metrics for ${growingUnits.length} growing units`,
		);

		// Calculate totals
		const totalCapacity = growingUnits.reduce(
			(sum, gu) => sum + gu.capacity,
			0,
		);
		const totalCapacityUsed = growingUnits.reduce(
			(sum, gu) => sum + gu.numberOfPlants,
			0,
		);
		const totalRemainingCapacity = totalCapacity - totalCapacityUsed;

		// Calculate average occupancy using math command
		const averageOccupancy =
			totalCapacity > 0
				? await this.commandBus.execute(
						new CalculatePercentageCommand({
							value: totalCapacityUsed,
							total: totalCapacity,
							decimals: 2,
						}),
					)
				: 0;

		// Count growing units at limit (>= 80% occupancy)
		const growingUnitsAtLimit = growingUnits.filter((gu) => {
			if (gu.capacity === 0) return false;
			const occupancy = (gu.numberOfPlants / gu.capacity) * 100;
			return occupancy >= 80;
		}).length;

		// Count fully occupied growing units (100% occupancy)
		const growingUnitsFull = growingUnits.filter(
			(gu) => gu.capacity > 0 && gu.numberOfPlants >= gu.capacity,
		).length;

		return {
			totalCapacity,
			totalCapacityUsed,
			averageOccupancy,
			growingUnitsAtLimit,
			growingUnitsFull,
			totalRemainingCapacity,
		};
	}
}

