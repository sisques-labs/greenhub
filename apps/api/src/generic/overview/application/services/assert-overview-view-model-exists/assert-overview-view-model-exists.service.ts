import { Inject, Injectable, Logger } from '@nestjs/common';
import { OverviewNotFoundException } from '@/generic/overview/application/exceptions/overview-not-found/overview-not-found.exception';
import {
	IOverviewReadRepository,
	OVERVIEW_READ_REPOSITORY_TOKEN,
} from '@/generic/overview/domain/repositories/overview-read/overview-read.repository';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

/**
 * Service responsible for asserting that an overview view model exists in the read repository.
 *
 * @remarks
 * This service provides a method to assert the existence of an overview view model
 * by its unique identifier. If the view model does not exist, an exception is thrown.
 */
@Injectable()
export class AssertOverviewViewModelExistsService
	implements IBaseService<string, OverviewViewModel>
{
	private readonly logger = new Logger(
		AssertOverviewViewModelExistsService.name,
	);

	constructor(
		@Inject(OVERVIEW_READ_REPOSITORY_TOKEN)
		private readonly overviewReadRepository: IOverviewReadRepository,
	) {}

	/**
	 * Asserts that an overview view model exists by its ID.
	 *
	 * @param id - The unique identifier of the overview.
	 * @returns The {@link OverviewViewModel} if found.
	 * @throws {@link OverviewNotFoundException} If the overview view model does not exist.
	 */
	async execute(id: string): Promise<OverviewViewModel> {
		this.logger.log(`Asserting overview view model exists by id: ${id}`);

		// 01: Find the overview view model by id
		const existingOverviewViewModel =
			await this.overviewReadRepository.findById(id);

		// 02: If the overview view model does not exist, throw an error
		if (!existingOverviewViewModel) {
			this.logger.error(`Overview view model not found by id: ${id}`);
			throw new OverviewNotFoundException(id);
		}

		return existingOverviewViewModel;
	}
}
