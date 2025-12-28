import { Injectable, Logger } from '@nestjs/common';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { UserViewModel } from '@/generic/users/domain/view-models/user.view-model';

@Injectable()
export class AuthUserProfileViewModelFactory {
  private readonly logger = new Logger(AuthUserProfileViewModelFactory.name);

  /**
   * Creates an auth user profile view model from auth and user view models.
   *
   * @param authViewModel - The auth view model
   * @param userViewModel - The user view model
   * @returns The combined auth user profile view model
   */
  create(
    authViewModel: AuthViewModel,
    userViewModel: UserViewModel,
  ): AuthUserProfileViewModel {
    this.logger.log(
      `Creating auth user profile view model from auth id: ${authViewModel.id} and user id: ${userViewModel.id}`,
    );

    return new AuthUserProfileViewModel({
      userId: userViewModel.id,
      authId: authViewModel.id,
      email: authViewModel.email,
      emailVerified: authViewModel.emailVerified,
      lastLoginAt: authViewModel.lastLoginAt,
      phoneNumber: authViewModel.phoneNumber,
      provider: authViewModel.provider,
      providerId: authViewModel.providerId,
      twoFactorEnabled: authViewModel.twoFactorEnabled,
      userName: userViewModel.userName,
      name: userViewModel.name,
      lastName: userViewModel.lastName,
      bio: userViewModel.bio,
      avatarUrl: userViewModel.avatarUrl,
      role: userViewModel.role,
      status: userViewModel.status,
      createdAt: authViewModel.createdAt,
      updatedAt:
        authViewModel.updatedAt > userViewModel.updatedAt
          ? authViewModel.updatedAt
          : userViewModel.updatedAt,
    });
  }
}
