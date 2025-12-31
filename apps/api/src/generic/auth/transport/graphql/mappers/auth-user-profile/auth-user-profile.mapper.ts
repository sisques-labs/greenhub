import { Injectable, Logger } from '@nestjs/common';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { AuthUserProfileResponseDto } from '@/generic/auth/transport/graphql/dtos/responses/auth-user-profile.response.dto';

@Injectable()
export class AuthUserProfileGraphQLMapper {
	private readonly logger = new Logger(AuthUserProfileGraphQLMapper.name);

	/**
	 * Converts an auth user profile view model to a response DTO.
	 *
	 * @param profile - The auth user profile view model to convert
	 * @returns The response DTO
	 */
	toResponseDto(profile: AuthUserProfileViewModel): AuthUserProfileResponseDto {
		this.logger.log(
			`Mapping auth user profile view model to response dto: ${profile.userId}`,
		);

		return {
			userId: profile.userId,
			authId: profile.authId,
			email: profile.email,
			emailVerified: profile.emailVerified,
			lastLoginAt: profile.lastLoginAt,
			phoneNumber: profile.phoneNumber,
			provider: profile.provider,
			providerId: profile.providerId,
			twoFactorEnabled: profile.twoFactorEnabled,
			userName: profile.userName,
			name: profile.name,
			lastName: profile.lastName,
			bio: profile.bio,
			avatarUrl: profile.avatarUrl,
			role: profile.role,
			status: profile.status,
			createdAt: profile.createdAt,
			updatedAt: profile.updatedAt,
		};
	}
}
