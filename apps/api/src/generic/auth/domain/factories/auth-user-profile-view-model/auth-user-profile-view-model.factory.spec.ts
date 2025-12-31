import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthUserProfileViewModelFactory } from '@/generic/auth/domain/factories/auth-user-profile-view-model/auth-user-profile-view-model.factory';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { UserViewModel } from '@/generic/users/domain/view-models/user.view-model';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

describe('AuthUserProfileViewModelFactory', () => {
	let factory: AuthUserProfileViewModelFactory;

	beforeEach(() => {
		factory = new AuthUserProfileViewModelFactory();
	});

	describe('create', () => {
		it('should create an AuthUserProfileViewModel from auth and user view models with all fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const lastLoginAt = new Date('2024-01-01T09:00:00Z');
			const userId = '123e4567-e89b-12d3-a456-426614174001';

			const authViewModel = new AuthViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: userId,
				email: 'test@example.com',
				emailVerified: true,
				lastLoginAt: lastLoginAt,
				password: null,
				phoneNumber: '+1234567890',
				provider: AuthProviderEnum.LOCAL,
				providerId: null,
				twoFactorEnabled: true,
				createdAt: now,
				updatedAt: new Date('2024-01-01T11:00:00Z'),
			});

			const userViewModel = new UserViewModel({
				id: userId,
				userName: 'testuser',
				name: 'Test',
				lastName: 'User',
				bio: 'Test bio',
				avatarUrl: 'https://example.com/avatar.jpg',
				role: UserRoleEnum.USER,
				status: UserStatusEnum.ACTIVE,
				createdAt: now,
				updatedAt: new Date('2024-01-01T12:00:00Z'),
			});

			const profileViewModel = factory.create(authViewModel, userViewModel);

			expect(profileViewModel).toBeInstanceOf(AuthUserProfileViewModel);
			expect(profileViewModel.userId).toBe(userId);
			expect(profileViewModel.authId).toBe(authViewModel.id);
			expect(profileViewModel.email).toBe(authViewModel.email);
			expect(profileViewModel.emailVerified).toBe(authViewModel.emailVerified);
			expect(profileViewModel.lastLoginAt).toEqual(authViewModel.lastLoginAt);
			expect(profileViewModel.phoneNumber).toBe(authViewModel.phoneNumber);
			expect(profileViewModel.provider).toBe(authViewModel.provider);
			expect(profileViewModel.providerId).toBe(authViewModel.providerId);
			expect(profileViewModel.twoFactorEnabled).toBe(
				authViewModel.twoFactorEnabled,
			);
			expect(profileViewModel.userName).toBe(userViewModel.userName);
			expect(profileViewModel.name).toBe(userViewModel.name);
			expect(profileViewModel.lastName).toBe(userViewModel.lastName);
			expect(profileViewModel.bio).toBe(userViewModel.bio);
			expect(profileViewModel.avatarUrl).toBe(userViewModel.avatarUrl);
			expect(profileViewModel.role).toBe(userViewModel.role);
			expect(profileViewModel.status).toBe(userViewModel.status);
			expect(profileViewModel.createdAt).toEqual(authViewModel.createdAt);
			// Should use the later of the two updatedAt dates
			expect(profileViewModel.updatedAt).toEqual(userViewModel.updatedAt);
		});

		it('should use auth updatedAt when it is later than user updatedAt', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const userId = '123e4567-e89b-12d3-a456-426614174001';

			const authViewModel = new AuthViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: userId,
				email: 'test@example.com',
				emailVerified: false,
				lastLoginAt: null,
				password: null,
				phoneNumber: null,
				provider: AuthProviderEnum.GOOGLE,
				providerId: 'google-123',
				twoFactorEnabled: false,
				createdAt: now,
				updatedAt: new Date('2024-01-01T12:00:00Z'),
			});

			const userViewModel = new UserViewModel({
				id: userId,
				userName: 'testuser',
				name: null,
				lastName: null,
				bio: null,
				avatarUrl: null,
				role: UserRoleEnum.ADMIN,
				status: UserStatusEnum.ACTIVE,
				createdAt: now,
				updatedAt: new Date('2024-01-01T11:00:00Z'),
			});

			const profileViewModel = factory.create(authViewModel, userViewModel);

			// Should use auth updatedAt since it's later
			expect(profileViewModel.updatedAt).toEqual(authViewModel.updatedAt);
		});

		it('should handle null optional fields correctly', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const userId = '123e4567-e89b-12d3-a456-426614174001';

			const authViewModel = new AuthViewModel({
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: userId,
				email: null,
				emailVerified: false,
				lastLoginAt: null,
				password: null,
				phoneNumber: null,
				provider: AuthProviderEnum.APPLE,
				providerId: 'apple-123',
				twoFactorEnabled: false,
				createdAt: now,
				updatedAt: now,
			});

			const userViewModel = new UserViewModel({
				id: userId,
				userName: 'testuser',
				name: null,
				lastName: null,
				bio: null,
				avatarUrl: null,
				role: UserRoleEnum.USER,
				status: UserStatusEnum.INACTIVE,
				createdAt: now,
				updatedAt: now,
			});

			const profileViewModel = factory.create(authViewModel, userViewModel);

			expect(profileViewModel.email).toBeNull();
			expect(profileViewModel.lastLoginAt).toBeNull();
			expect(profileViewModel.phoneNumber).toBeNull();
			expect(profileViewModel.name).toBeNull();
			expect(profileViewModel.lastName).toBeNull();
			expect(profileViewModel.bio).toBeNull();
			expect(profileViewModel.avatarUrl).toBeNull();
		});
	});
});
