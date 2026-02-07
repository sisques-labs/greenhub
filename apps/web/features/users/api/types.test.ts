import type { AuthUserProfileResponse } from 'features/auth/api/types';
import { transformAuthProfileToUser } from './types';

describe('transformAuthProfileToUser', () => {
	it('should transform AuthUserProfileResponse to UserResponse with all fields', () => {
		const authProfile: AuthUserProfileResponse = {
			userId: '123',
			authId: 'auth-123',
			userName: 'testuser',
			name: 'John',
			lastName: 'Doe',
			bio: 'Test bio',
			avatarUrl: 'https://example.com/avatar.jpg',
			role: 'USER',
			status: 'ACTIVE',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-02'),
			email: 'test@example.com',
			phoneNumber: '+1234567890',
			emailVerified: true,
			twoFactorEnabled: false,
			lastLoginAt: new Date('2024-01-03'),
		};

		const result = transformAuthProfileToUser(authProfile);

		expect(result).toEqual({
			userId: '123',
			userName: 'testuser',
			name: 'John',
			lastName: 'Doe',
			bio: 'Test bio',
			avatarUrl: 'https://example.com/avatar.jpg',
			role: 'USER',
			status: 'ACTIVE',
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-02'),
			email: 'test@example.com',
			phoneNumber: '+1234567890',
			emailVerified: true,
			twoFactorEnabled: false,
			lastLogin: new Date('2024-01-03'),
		});
	});

	it('should handle null and undefined values correctly', () => {
		const authProfile: AuthUserProfileResponse = {
			userId: '123',
			authId: 'auth-123',
			userName: null,
			name: undefined,
			lastName: null,
			bio: null,
			avatarUrl: null,
			role: 'ADMIN',
			status: 'INACTIVE',
			createdAt: undefined,
			updatedAt: null,
			email: null,
			phoneNumber: null,
			emailVerified: undefined,
			twoFactorEnabled: null,
			lastLoginAt: null,
		};

		const result = transformAuthProfileToUser(authProfile);

		expect(result).toEqual({
			userId: '123',
			userName: null,
			name: null,
			lastName: null,
			bio: null,
			avatarUrl: null,
			role: 'ADMIN',
			status: 'INACTIVE',
			createdAt: expect.any(Date),
			updatedAt: expect.any(Date),
			email: null,
			phoneNumber: null,
			emailVerified: false,
			twoFactorEnabled: false,
			lastLogin: null,
		});
	});

	it('should use default values for missing createdAt and updatedAt', () => {
		const authProfile: AuthUserProfileResponse = {
			userId: '123',
			authId: 'auth-123',
			userName: 'testuser',
			name: 'John',
			lastName: 'Doe',
			bio: null,
			avatarUrl: null,
			role: 'USER',
			status: 'ACTIVE',
			createdAt: undefined,
			updatedAt: undefined,
			email: 'test@example.com',
			phoneNumber: null,
			emailVerified: true,
			twoFactorEnabled: false,
			lastLoginAt: null,
		};

		const result = transformAuthProfileToUser(authProfile);

		expect(result.createdAt).toBeInstanceOf(Date);
		expect(result.updatedAt).toBeInstanceOf(Date);
	});

	it('should correctly map lastLoginAt to lastLogin', () => {
		const lastLoginDate = new Date('2024-01-15T10:30:00Z');
		const authProfile: AuthUserProfileResponse = {
			userId: '123',
			authId: 'auth-123',
			userName: 'testuser',
			name: 'John',
			lastName: 'Doe',
			bio: null,
			avatarUrl: null,
			role: 'USER',
			status: 'ACTIVE',
			createdAt: new Date(),
			updatedAt: new Date(),
			email: 'test@example.com',
			phoneNumber: null,
			emailVerified: true,
			twoFactorEnabled: false,
			lastLoginAt: lastLoginDate,
		};

		const result = transformAuthProfileToUser(authProfile);

		expect(result.lastLogin).toEqual(lastLoginDate);
	});

	it('should handle all user roles correctly', () => {
		const roles = ['USER', 'ADMIN', 'MODERATOR'] as const;

		roles.forEach((role) => {
			const authProfile: AuthUserProfileResponse = {
				userId: '123',
				authId: 'auth-123',
				userName: 'testuser',
				name: 'John',
				lastName: 'Doe',
				bio: null,
				avatarUrl: null,
				role,
				status: 'ACTIVE',
				createdAt: new Date(),
				updatedAt: new Date(),
				email: 'test@example.com',
				phoneNumber: null,
				emailVerified: true,
				twoFactorEnabled: false,
				lastLoginAt: null,
			};

			const result = transformAuthProfileToUser(authProfile);

			expect(result.role).toBe(role);
		});
	});

	it('should handle all user statuses correctly', () => {
		const statuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'] as const;

		statuses.forEach((status) => {
			const authProfile: AuthUserProfileResponse = {
				userId: '123',
				authId: 'auth-123',
				userName: 'testuser',
				name: 'John',
				lastName: 'Doe',
				bio: null,
				avatarUrl: null,
				role: 'USER',
				status,
				createdAt: new Date(),
				updatedAt: new Date(),
				email: 'test@example.com',
				phoneNumber: null,
				emailVerified: true,
				twoFactorEnabled: false,
				lastLoginAt: null,
			};

			const result = transformAuthProfileToUser(authProfile);

			expect(result.status).toBe(status);
		});
	});
});
