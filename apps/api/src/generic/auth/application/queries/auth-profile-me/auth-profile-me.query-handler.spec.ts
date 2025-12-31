import { QueryBus } from '@nestjs/cqrs';
import { AuthProfileMeQuery } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query';
import { AuthProfileMeQueryHandler } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query-handler';
import { AssertAuthViewModelExistsByUserIdService } from '@/generic/auth/application/services/assert-auth-view-model-exists-by-user-id/assert-auth-view-model-exists-by-user-id.service';
import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthUserProfileViewModelFactory } from '@/generic/auth/domain/factories/auth-user-profile-view-model/auth-user-profile-view-model.factory';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { UserViewModel } from '@/generic/users/domain/view-models/user.view-model';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

describe('AuthProfileMeQueryHandler', () => {
	let handler: AuthProfileMeQueryHandler;
	let mockQueryBus: jest.Mocked<QueryBus>;
	let mockAssertAuthViewModelExistsByUserIdService: jest.Mocked<AssertAuthViewModelExistsByUserIdService>;
	let mockAuthUserProfileViewModelFactory: jest.Mocked<AuthUserProfileViewModelFactory>;

	beforeEach(() => {
		mockQueryBus = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<QueryBus>;

		mockAssertAuthViewModelExistsByUserIdService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertAuthViewModelExistsByUserIdService>;

		mockAuthUserProfileViewModelFactory = {
			create: jest.fn(),
		} as unknown as jest.Mocked<AuthUserProfileViewModelFactory>;

		handler = new AuthProfileMeQueryHandler(
			mockQueryBus,
			mockAssertAuthViewModelExistsByUserIdService,
			mockAuthUserProfileViewModelFactory,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('execute', () => {
		it('should return auth user profile view model when both user and auth exist', async () => {
			const userId = '123e4567-e89b-12d3-a456-426614174001';
			const query = new AuthProfileMeQuery({ userId });

			const now = new Date();
			const authUpdatedAt = new Date(now.getTime() + 1000);
			const userUpdatedAt = new Date(now.getTime() + 2000);

			const mockAuthViewModel = new AuthViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: userId,
				email: 'test@example.com',
				emailVerified: true,
				lastLoginAt: now,
				password: null,
				phoneNumber: '+1234567890',
				provider: AuthProviderEnum.LOCAL,
				providerId: null,
				twoFactorEnabled: false,
				createdAt: now,
				updatedAt: authUpdatedAt,
			});

			const mockUserViewModel = new UserViewModel({
				id: userId,
				userName: 'testuser',
				name: 'Test',
				lastName: 'User',
				bio: 'Test bio',
				avatarUrl: 'https://example.com/avatar.jpg',
				role: UserRoleEnum.USER,
				status: UserStatusEnum.ACTIVE,
				createdAt: now,
				updatedAt: userUpdatedAt,
			});

			const mockAuthUserProfileViewModel = new AuthUserProfileViewModel({
				userId: userId,
				authId: mockAuthViewModel.id,
				email: mockAuthViewModel.email,
				emailVerified: mockAuthViewModel.emailVerified,
				lastLoginAt: mockAuthViewModel.lastLoginAt,
				phoneNumber: mockAuthViewModel.phoneNumber,
				provider: mockAuthViewModel.provider,
				providerId: mockAuthViewModel.providerId,
				twoFactorEnabled: mockAuthViewModel.twoFactorEnabled,
				userName: mockUserViewModel.userName || '',
				name: mockUserViewModel.name,
				lastName: mockUserViewModel.lastName,
				bio: mockUserViewModel.bio,
				avatarUrl: mockUserViewModel.avatarUrl,
				role: mockUserViewModel.role,
				status: mockUserViewModel.status,
				createdAt: mockAuthViewModel.createdAt,
				updatedAt:
					authUpdatedAt > userUpdatedAt ? authUpdatedAt : userUpdatedAt,
			});

			mockQueryBus.execute.mockResolvedValueOnce(mockUserViewModel);
			mockAssertAuthViewModelExistsByUserIdService.execute.mockResolvedValue(
				mockAuthViewModel,
			);
			mockAuthUserProfileViewModelFactory.create.mockReturnValue(
				mockAuthUserProfileViewModel,
			);

			const result = await handler.execute(query);

			expect(result).toBe(mockAuthUserProfileViewModel);
			expect(mockQueryBus.execute).toHaveBeenCalledTimes(1);
			expect(
				mockAssertAuthViewModelExistsByUserIdService.execute,
			).toHaveBeenCalledWith(userId);
			expect(
				mockAssertAuthViewModelExistsByUserIdService.execute,
			).toHaveBeenCalledTimes(1);
			expect(mockAuthUserProfileViewModelFactory.create).toHaveBeenCalledWith(
				mockAuthViewModel,
				mockUserViewModel,
			);
			expect(mockAuthUserProfileViewModelFactory.create).toHaveBeenCalledTimes(
				1,
			);
		});
	});
});
