import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { AuthProfileMeQuery } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query';
import { AssertAuthViewModelExistsByUserIdService } from '@/generic/auth/application/services/assert-auth-view-model-exists-by-user-id/assert-auth-view-model-exists-by-user-id.service';
import { AuthUserProfileViewModelFactory } from '@/generic/auth/domain/factories/auth-user-profile-view-model/auth-user-profile-view-model.factory';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { UserViewModelFindByIdQuery } from '@/generic/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query';

/**
 * Query handler for the {@link AuthProfileMeQuery}.
 *
 * This handler is responsible for retrieving and constructing an authenticated user's profile
 * by performing the following steps:
 * - Fetch the user view model by ID.
 * - Fetch the authentication (auth) view model associated with the user.
 * - Combine both models to create the final `AuthUserProfileViewModel` using a factory.
 *
 * @remarks
 * This handler is used when an authenticated user requests information about their own profile.
 */
@QueryHandler(AuthProfileMeQuery)
export class AuthProfileMeQueryHandler
  implements IQueryHandler<AuthProfileMeQuery>
{
  /**
   * Internal logger instance for logging query execution details.
   */
  private readonly logger = new Logger(AuthProfileMeQueryHandler.name);

  /**
   * Instantiates the handler.
   *
   * @param queryBus Used to execute other queries within the application boundary.
   * @param assertAuthViewModelExistsByUserIdService Service to assert and retrieve the auth view model by user ID.
   * @param authUserProfileViewModelFactory Factory to create the {@link AuthUserProfileViewModel}.
   */
  constructor(
    private readonly queryBus: QueryBus,
    private readonly assertAuthViewModelExistsByUserIdService: AssertAuthViewModelExistsByUserIdService,
    private readonly authUserProfileViewModelFactory: AuthUserProfileViewModelFactory,
  ) {}

  /**
   * Handles the execution of the {@link AuthProfileMeQuery}.
   *
   * @param query The query that contains parameters such as the user's ID.
   * @returns A {@link AuthUserProfileViewModel} representing the authenticated user's profile.
   *
   * @throws Will throw if either the user or auth view model is not found.
   */
  async execute(query: AuthProfileMeQuery): Promise<AuthUserProfileViewModel> {
    this.logger.log(`Executing auth profile me query: ${query.userId.value}`);

    // 01: Find the user view model by id
    const userViewModel = await this.queryBus.execute(
      new UserViewModelFindByIdQuery({ id: query.userId.value }),
    );

    // 02: Find the auth view model by user id
    const authViewModel =
      await this.assertAuthViewModelExistsByUserIdService.execute(
        query.userId.value,
      );

    // 03: Create auth user profile view model using factory
    return this.authUserProfileViewModelFactory.create(
      authViewModel,
      userViewModel,
    );
  }
}
