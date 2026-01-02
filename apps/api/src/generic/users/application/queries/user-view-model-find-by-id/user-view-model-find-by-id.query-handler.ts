import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserViewModelFindByIdQuery } from '@/generic/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query';
import { AssertUserViewModelExsistsService } from '@/generic/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service';
import { UserViewModel } from '@/generic/users/domain/view-models/user.view-model';

@QueryHandler(UserViewModelFindByIdQuery)
export class UserViewModelFindByIdQueryHandler
	implements IQueryHandler<UserViewModelFindByIdQuery>
{
	private readonly logger = new Logger(UserViewModelFindByIdQueryHandler.name);

	constructor(
		private readonly assertUserViewModelExsistsService: AssertUserViewModelExsistsService,
	) {}

	/**
	 * Executes the UserViewModelFindByIdQuery query.
	 *
	 * @param query - The UserViewModelFindByIdQuery query to execute.
	 * @returns The UserViewModel if found, null otherwise.
	 */
	async execute(query: UserViewModelFindByIdQuery): Promise<UserViewModel> {
		this.logger.log(
			`Executing user view model find by id query: ${query.id.value}`,
		);

		// 01: Find the user view model by id
		return await this.assertUserViewModelExsistsService.execute(query.id.value);
	}
}
