import { Logger } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { AuthViewModelFindByUserIdQuery } from "@/generic/auth/application/queries/auth-view-model-find-by-user-id/auth-view-model-find-by-user-id.query";
import { AssertAuthViewModelExistsByUserIdService } from "@/generic/auth/application/services/assert-auth-view-model-exists-by-user-id/assert-auth-view-model-exists-by-user-id.service";
import { AuthViewModel } from "@/generic/auth/domain/view-models/auth.view-model";

@QueryHandler(AuthViewModelFindByUserIdQuery)
export class AuthViewModelFindByUserIdQueryHandler
	implements IQueryHandler<AuthViewModelFindByUserIdQuery>
{
	private readonly logger = new Logger(
		AuthViewModelFindByUserIdQueryHandler.name,
	);

	constructor(
		private readonly assertAuthViewModelExistsByUserIdService: AssertAuthViewModelExistsByUserIdService,
	) {}

	/**
	 * Executes the AuthViewModelFindByUserIdQuery query.
	 *
	 * @param query - The AuthViewModelFindByUserIdQuery query to execute.
	 * @returns The AuthViewModel if found.
	 */
	async execute(query: AuthViewModelFindByUserIdQuery): Promise<AuthViewModel> {
		this.logger.log(
			`Executing auth view model find by user id query: ${query.userId.value}`,
		);

		// 01: Find the auth view model by user id
		return await this.assertAuthViewModelExistsByUserIdService.execute(
			query.userId.value,
		);
	}
}
