import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthUserProfileViewModel } from '@/generic/auth/domain/view-models/auth-user-profile/auth-user-profile.view-model';
import { AuthUserProfileResponseDto } from '@/generic/auth/transport/graphql/dtos/responses/auth-user-profile.response.dto';
import { AuthUserProfileGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth-user-profile/auth-user-profile.mapper';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

describe('AuthUserProfileGraphQLMapper', () => {
  let mapper: AuthUserProfileGraphQLMapper;

  beforeEach(() => {
    mapper = new AuthUserProfileGraphQLMapper();
  });

  describe('toResponseDto', () => {
    it('should convert AuthUserProfileViewModel to AuthUserProfileResponseDto with all fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const lastLoginAt = new Date('2024-01-01T09:00:00Z');
      const userId = '123e4567-e89b-12d3-a456-426614174001';

      const viewModel = new AuthUserProfileViewModel({
        userId: userId,
        authId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: lastLoginAt,
        phoneNumber: '+1234567890',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: true,
        userName: 'testuser',
        name: 'Test',
        lastName: 'User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result).toEqual<AuthUserProfileResponseDto>({
        userId: userId,
        authId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        emailVerified: true,
        lastLoginAt: lastLoginAt,
        phoneNumber: '+1234567890',
        provider: AuthProviderEnum.LOCAL,
        providerId: null,
        twoFactorEnabled: true,
        userName: 'testuser',
        name: 'Test',
        lastName: 'User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: UserRoleEnum.USER,
        status: UserStatusEnum.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    });

    it('should convert AuthUserProfileViewModel with null optional fields', () => {
      const now = new Date('2024-01-01T10:00:00Z');
      const userId = '123e4567-e89b-12d3-a456-426614174001';

      const viewModel = new AuthUserProfileViewModel({
        userId: userId,
        authId: '123e4567-e89b-12d3-a456-426614174000',
        email: null,
        emailVerified: false,
        lastLoginAt: null,
        phoneNumber: null,
        provider: AuthProviderEnum.GOOGLE,
        providerId: 'google-123',
        twoFactorEnabled: false,
        userName: 'testuser',
        name: null,
        lastName: null,
        bio: null,
        avatarUrl: null,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.INACTIVE,
        createdAt: now,
        updatedAt: now,
      });

      const result = mapper.toResponseDto(viewModel);

      expect(result.userId).toBe(userId);
      expect(result.email).toBeNull();
      expect(result.lastLoginAt).toBeNull();
      expect(result.phoneNumber).toBeNull();
      expect(result.name).toBeNull();
      expect(result.lastName).toBeNull();
      expect(result.bio).toBeNull();
      expect(result.avatarUrl).toBeNull();
      expect(result.emailVerified).toBe(false);
      expect(result.provider).toBe(AuthProviderEnum.GOOGLE);
    });
  });
});
