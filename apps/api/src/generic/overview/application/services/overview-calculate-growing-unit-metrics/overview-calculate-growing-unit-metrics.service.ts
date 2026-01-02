import { Injectable, Logger } from '@nestjs/common';

import { GrowingUnitTypeEnum } from '@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum';
import { GrowingUnitViewModel } from '@/core/plant-context/domain/view-models/growing-unit/growing-unit.view-model';
import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for calculating growing unit-related metrics for overview.
 *
 * @remarks
 * This service calculates metrics related to growing units such as totals,
 * active/empty counts, and counts by type.
 */
@Injectable()
export class OverviewCalculateGrowingUnitMetricsService
	implements
		IBaseService<
			GrowingUnitViewModel[],
			Pick<
				IOverviewViewModelDto,
				| 'totalGrowingUnits'
				| 'activeGrowingUnits'
				| 'emptyGrowingUnits'
				| 'growingUnitsPot'
				| 'growingUnitsGardenBed'
				| 'growingUnitsHangingBasket'
				| 'growingUnitsWindowBox'
			>
		>
{
	private readonly logger = new Logger(
		OverviewCalculateGrowingUnitMetricsService.name,
	);

	/**
	 * Calculates growing unit-related metrics from an array of growing units.
	 *
	 * @param growingUnits - Array of growing unit view models
	 * @returns Object containing all growing unit metrics
	 */
	async execute(
		growingUnits: GrowingUnitViewModel[],
	): Promise<
		Pick<
			IOverviewViewModelDto,
			| 'totalGrowingUnits'
			| 'activeGrowingUnits'
			| 'emptyGrowingUnits'
			| 'growingUnitsPot'
			| 'growingUnitsGardenBed'
			| 'growingUnitsHangingBasket'
			| 'growingUnitsWindowBox'
		>
	> {
		this.logger.log(
			`Calculating growing unit metrics for ${growingUnits.length} growing units`,
		);

		const totalGrowingUnits = growingUnits.length;

		// Active growing units (with at least 1 plant)
		const activeGrowingUnits = growingUnits.filter(
			(gu) => gu.numberOfPlants > 0,
		).length;

		// Empty growing units
		const emptyGrowingUnits = growingUnits.filter(
			(gu) => gu.numberOfPlants === 0,
		).length;

		// Count by type
		const growingUnitsPot = growingUnits.filter(
			(gu) => gu.type === GrowingUnitTypeEnum.POT,
		).length;
		const growingUnitsGardenBed = growingUnits.filter(
			(gu) => gu.type === GrowingUnitTypeEnum.GARDEN_BED,
		).length;
		const growingUnitsHangingBasket = growingUnits.filter(
			(gu) => gu.type === GrowingUnitTypeEnum.HANGING_BASKET,
		).length;
		const growingUnitsWindowBox = growingUnits.filter(
			(gu) => gu.type === GrowingUnitTypeEnum.WINDOW_BOX,
		).length;

		return {
			totalGrowingUnits,
			activeGrowingUnits,
			emptyGrowingUnits,
			growingUnitsPot,
			growingUnitsGardenBed,
			growingUnitsHangingBasket,
			growingUnitsWindowBox,
		};
	}
}



