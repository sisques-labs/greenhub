import { Injectable, Logger } from '@nestjs/common';
import { IOverviewViewModelDto } from '@/generic/overview/domain/dtos/view-models/overview/overview-view-model.dto';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';

/**
 * Factory class responsible for creating {@link OverviewViewModel} instances from DTOs.
 * This promotes a consistent approach for transforming overview data into a view model
 * suitable for presentation or API response.
 *
 * @remarks
 * The overview factory creates view models containing aggregated statistics and metrics
 * from the plant context (core).
 *
 * @example
 * const factory = new OverviewViewModelFactory();
 * const viewModel = factory.create(overviewDto);
 */
@Injectable()
export class OverviewViewModelFactory {
	private readonly logger = new Logger(OverviewViewModelFactory.name);

	/**
	 * Creates a new {@link OverviewViewModel} instance from an {@link IOverviewViewModelDto}.
	 *
	 * @param data - The DTO containing overview statistics and metrics.
	 * @returns The corresponding {@link OverviewViewModel} instance.
	 *
	 * @example
	 * const dto: IOverviewViewModelDto = {...};
	 * const viewModel = factory.create(dto);
	 */
	public create(data: IOverviewViewModelDto): OverviewViewModel {
		this.logger.log(
			`Creating overview view model from DTO: ${JSON.stringify(data)}`,
		);
		return new OverviewViewModel(data);
	}
}
