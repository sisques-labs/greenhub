import { UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthProfileMeQuery } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query';
import { ClerkAuthGuard } from '@/generic/auth/infrastructure/auth/clerk-auth.guard';
import { CurrentUser } from '@/generic/auth/infrastructure/decorators/current-user/current-user.decorator';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { AuthUserProfileResponseDto } from '@/generic/auth/transport/graphql/dtos/responses/auth-user-profile.response.dto';
import { AuthUserProfileGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth-user-profile/auth-user-profile.mapper';

@Resolver()
@UseGuards(ClerkAuthGuard, RolesGuard)
export class AuthQueryResolver {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly authUserProfileGraphQLMapper: AuthUserProfileGraphQLMapper,
	) {}

	@Query(() => AuthUserProfileResponseDto)
	async authProfileMe(
		@CurrentUser() user: any,
	): Promise<AuthUserProfileResponseDto> {
		// 01: Execute query
		// Use clerkUserId to get Clerk user, and userId (internal ID) to get view model
		const result = await this.queryBus.execute(
			new AuthProfileMeQuery({
				userId: user.userId, // Internal user ID (UUID)
				clerkUserId: user.clerkUserId, // Clerk user ID
			}),
		);

		// 02: Convert to response DTO, including tenantId from user object
		return this.authUserProfileGraphQLMapper.toResponseDto(
			result,
			user.tenantId || null,
		);
	}
}
