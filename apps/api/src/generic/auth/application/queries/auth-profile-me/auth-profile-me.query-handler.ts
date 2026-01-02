import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';

import { AuthProfileMeQuery } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query';
import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthUserProfileViewModelFactory } from '@/generic/auth/domain/factories/auth-user-profile-view-model/auth-user-profile-view-model.factory';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { UserViewModelFindByIdQuery } from '@/generic/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query';
import { ClerkAuthService } from '@/shared/infrastructure/clerk/services/clerk-auth/clerk-auth.service';

/**
 * Query handler for the {@link AuthProfileMeQuery}.
 *
 * This handler is responsible for retrieving and constructing an authenticated user's profile
 * by performing the following steps:
 * - Fetch the user view model by ID.
 * - Get authentication data from Clerk.
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
	 * @param clerkAuthService Service to get user data from Clerk.
	 * @param authUserProfileViewModelFactory Factory to create the {@link AuthUserProfileViewModel}.
	 */
	constructor(
		private readonly queryBus: QueryBus,
		private readonly clerkAuthService: ClerkAuthService,
		private readonly authUserProfileViewModelFactory: AuthUserProfileViewModelFactory,
	) {}

	/**
	 * Handles the execution of the {@link AuthProfileMeQuery}.
	 *
	 * @param query The query that contains parameters such as the user's ID (Clerk user ID).
	 * @returns A {@link AuthUserProfileViewModel} representing the authenticated user's profile.
	 *
	 * @throws Will throw if the user view model is not found or Clerk user cannot be retrieved.
	 */
	async execute(query: AuthProfileMeQuery): Promise<AuthUserProfileViewModel> {
		this.logger.log(
			`Executing auth profile me query: ${query.userId.value} (Clerk: ${query.clerkUserId.value})`,
		);

		// 01: Get user data from Clerk using clerkUserId
		const clerkUser = await this.clerkAuthService.getUser(
			query.clerkUserId.value,
		);

		// 02: Find the user view model by internal id (from local database)
		const userViewModel = await this.queryBus.execute(
			new UserViewModelFindByIdQuery({ id: query.userId.value }),
		);

		// 03: Create auth view model from Clerk data
		const authViewModel = new AuthViewModel({
			id: clerkUser.id,
			userId: clerkUser.id,
			email: clerkUser.emailAddresses[0]?.emailAddress || null,
			emailVerified:
				clerkUser.emailAddresses[0]?.verification?.status === 'verified',
			phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
			lastLoginAt: clerkUser.lastSignInAt
				? new Date(clerkUser.lastSignInAt)
				: null,
			password: null, // Clerk manages passwords, we don't store them
			provider: AuthProviderEnum.CLERK,
			providerId: clerkUser.id,
			twoFactorEnabled: clerkUser.twoFactorEnabled || false,
			createdAt: new Date(clerkUser.createdAt),
			updatedAt: new Date(clerkUser.updatedAt),
		});

		// 04: Create auth user profile view model using factory
		return this.authUserProfileViewModelFactory.create(
			authViewModel,
			userViewModel,
		);
	}
}
