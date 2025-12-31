import { Injectable, Logger } from '@nestjs/common';
import { PlantStatusEnum } from '@/core/plant-context/domain/enums/plant/plant-status/plant-status.enum';
import { PlantViewModel } from '@/core/plant-context/domain/view-models/plant/plant.view-model';
import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for calculating plant-related metrics for overview.
 *
 * @remarks
 * This service calculates metrics related to plants such as totals, status counts,
 * and additional plant statistics.
 */
@Injectable()
export class OverviewCalculatePlantMetricsService
	implements
		IBaseService<
			PlantViewModel[],
			Pick<
				IOverviewViewModelDto,
				| 'totalPlants'
				| 'totalActivePlants'
				| 'plantsPlanted'
				| 'plantsGrowing'
				| 'plantsHarvested'
				| 'plantsDead'
				| 'plantsArchived'
				| 'plantsWithoutPlantedDate'
				| 'plantsWithNotes'
				| 'recentPlants'
			>
		>
{
	private readonly logger = new Logger(
		OverviewCalculatePlantMetricsService.name,
	);

	/**
	 * Calculates plant-related metrics from an array of plants.
	 *
	 * @param plants - Array of plant view models
	 * @returns Object containing all plant metrics
	 */
	async execute(
		plants: PlantViewModel[],
	): Promise<
		Pick<
			IOverviewViewModelDto,
			| 'totalPlants'
			| 'totalActivePlants'
			| 'plantsPlanted'
			| 'plantsGrowing'
			| 'plantsHarvested'
			| 'plantsDead'
			| 'plantsArchived'
			| 'plantsWithoutPlantedDate'
			| 'plantsWithNotes'
			| 'recentPlants'
		>
	> {
		this.logger.log(`Calculating plant metrics for ${plants.length} plants`);

		const totalPlants = plants.length;

		// Count by status
		const plantsPlanted = plants.filter(
			(p) => p.status === PlantStatusEnum.PLANTED,
		).length;
		const plantsGrowing = plants.filter(
			(p) => p.status === PlantStatusEnum.GROWING,
		).length;
		const plantsHarvested = plants.filter(
			(p) => p.status === PlantStatusEnum.HARVESTED,
		).length;
		const plantsDead = plants.filter(
			(p) => p.status === PlantStatusEnum.DEAD,
		).length;
		const plantsArchived = plants.filter(
			(p) => p.status === PlantStatusEnum.ARCHIVED,
		).length;

		// Active plants (not dead, not archived)
		const totalActivePlants = totalPlants - plantsDead - plantsArchived;

		// Additional metrics
		const plantsWithoutPlantedDate = plants.filter(
			(p) => !p.plantedDate,
		).length;
		const plantsWithNotes = plants.filter((p) => p.notes !== null).length;

		// Recent plants (last 7 days)
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		const recentPlants = plants.filter(
			(p) => p.createdAt && new Date(p.createdAt) >= sevenDaysAgo,
		).length;

		return {
			totalPlants,
			totalActivePlants,
			plantsPlanted,
			plantsGrowing,
			plantsHarvested,
			plantsDead,
			plantsArchived,
			plantsWithoutPlantedDate,
			plantsWithNotes,
			recentPlants,
		};
	}
}
