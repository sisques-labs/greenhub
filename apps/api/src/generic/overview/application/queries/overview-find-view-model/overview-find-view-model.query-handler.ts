import { OverviewFindViewModelQuery } from '@/generic/overview/application/queries/overview-find-view-model/overview-find-view-model.query';
import {
	IOverviewReadRepository,
	OVERVIEW_READ_REPOSITORY_TOKEN,
} from '@/generic/overview/domain/repositories/overview-read/overview-read.repository';
import { OverviewViewModel } from '@/generic/overview/domain/view-models/plant/overview.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/**
 * Handles the {@link OverviewFindViewModelQuery} query.
 *
 * @remarks
 * This handler retrieves the single overview view model from the database.
 * The overview has a constant ID of 'overview'.
 */
@QueryHandler(OverviewFindViewModelQuery)
export class OverviewFindViewModelQueryHandler
	implements IQueryHandler<OverviewFindViewModelQuery>
{
	private readonly logger = new Logger(OverviewFindViewModelQueryHandler.name);
	private readonly OVERVIEW_ID = 'overview';

	constructor(
		@Inject(OVERVIEW_READ_REPOSITORY_TOKEN)
		private readonly overviewReadRepository: IOverviewReadRepository,
	) {}

	/**
	 * Executes the {@link OverviewFindViewModelQuery} query.
	 *
	 * @param query - The query to execute
	 * @returns The overview view model if found
	 */
	async execute(
		_: OverviewFindViewModelQuery,
	): Promise<OverviewViewModel | null> {
		this.logger.log('Executing overview find view model query');

		// 01: Find the overview view model by the constant ID
		return await this.overviewReadRepository.findById(this.OVERVIEW_ID);
	}
}
