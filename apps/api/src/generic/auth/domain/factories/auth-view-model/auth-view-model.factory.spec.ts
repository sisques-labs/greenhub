import { AuthAggregate } from '@/generic/auth/domain/aggregate/auth.aggregate';
import { IAuthCreateViewModelDto } from '@/generic/auth/domain/dtos/view-models/auth-create/auth-create-view-model.dto';
import { AuthProviderEnum } from '@/generic/auth/domain/enums/auth-provider.enum';
import { AuthViewModelFactory } from '@/generic/auth/domain/factories/auth-view-model/auth-view-model.factory';
import { AuthPrimitives } from '@/generic/auth/domain/primitives/auth.primitives';
import { AuthEmailValueObject } from '@/generic/auth/domain/value-objects/auth-email/auth-email.vo';
import { AuthEmailVerifiedValueObject } from '@/generic/auth/domain/value-objects/auth-email-verified/auth-email-verified.vo';
import { AuthLastLoginAtValueObject } from '@/generic/auth/domain/value-objects/auth-last-login-at/auth-last-login-at.vo';
import { AuthPasswordValueObject } from '@/generic/auth/domain/value-objects/auth-password/auth-password.vo';
import { AuthPhoneNumberValueObject } from '@/generic/auth/domain/value-objects/auth-phone-number/auth-phone-number.vo';
import { AuthProviderValueObject } from '@/generic/auth/domain/value-objects/auth-provider/auth-provider.vo';
import { AuthProviderIdValueObject } from '@/generic/auth/domain/value-objects/auth-provider-id/auth-provider-id.vo';
import { AuthTwoFactorEnabledValueObject } from '@/generic/auth/domain/value-objects/auth-two-factor-enabled/auth-two-factor-enabled.vo';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { DateValueObject } from '@/shared/domain/value-objects/date/date.vo';
import { AuthUuidValueObject } from '@/shared/domain/value-objects/identifiers/auth-uuid/auth-uuid.vo';
import { UserUuidValueObject } from '@/shared/domain/value-objects/identifiers/user-uuid/user-uuid.vo';

describe('AuthViewModelFactory', () => {
	let factory: AuthViewModelFactory;

	beforeEach(() => {
		factory = new AuthViewModelFactory();
	});

	describe('create', () => {
		it('should create an AuthViewModel from a DTO with all fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const lastLoginAt = new Date('2024-01-01T09:00:00Z');

			const dto: IAuthCreateViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: '123e4567-e89b-12d3-a456-426614174001',
				email: 'test@example.com',
				emailVerified: true,
				lastLoginAt: lastLoginAt,
				password: 'SecurePass123!',
				phoneNumber: '+1234567890',
				provider: AuthProviderEnum.LOCAL,
				providerId: 'local-123',
				twoFactorEnabled: true,
				createdAt: now,
				updatedAt: now,
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.id).toBe(dto.id);
			expect(viewModel.userId).toBe(dto.userId);
			expect(viewModel.email).toBe(dto.email);
			expect(viewModel.emailVerified).toBe(dto.emailVerified);
			expect(viewModel.lastLoginAt).toEqual(dto.lastLoginAt);
			expect(viewModel.password).toBe(dto.password);
			expect(viewModel.phoneNumber).toBe(dto.phoneNumber);
			expect(viewModel.provider).toBe(dto.provider);
			expect(viewModel.providerId).toBe(dto.providerId);
			expect(viewModel.twoFactorEnabled).toBe(dto.twoFactorEnabled);
			expect(viewModel.createdAt).toEqual(dto.createdAt);
			expect(viewModel.updatedAt).toEqual(dto.updatedAt);
		});

		it('should create an AuthViewModel from a DTO with null optional fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');

			const dto: IAuthCreateViewModelDto = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: '123e4567-e89b-12d3-a456-426614174001',
				email: null,
				emailVerified: false,
				lastLoginAt: null,
				password: null,
				phoneNumber: null,
				provider: AuthProviderEnum.GOOGLE,
				providerId: 'google-123',
				twoFactorEnabled: false,
				createdAt: now,
				updatedAt: now,
			};

			const viewModel = factory.create(dto);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.id).toBe(dto.id);
			expect(viewModel.userId).toBe(dto.userId);
			expect(viewModel.email).toBeNull();
			expect(viewModel.lastLoginAt).toBeNull();
			expect(viewModel.password).toBeNull();
			expect(viewModel.phoneNumber).toBeNull();
			expect(viewModel.provider).toBe(dto.provider);
			expect(viewModel.providerId).toBe(dto.providerId);
		});
	});

	describe('fromPrimitives', () => {
		it('should create an AuthViewModel from primitives with all fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const lastLoginAt = new Date('2024-01-01T09:00:00Z');

			const primitives: AuthPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: '123e4567-e89b-12d3-a456-426614174001',
				email: 'test@example.com',
				emailVerified: true,
				lastLoginAt: lastLoginAt,
				password: 'SecurePass123!',
				phoneNumber: '+1234567890',
				provider: AuthProviderEnum.LOCAL,
				providerId: 'local-123',
				twoFactorEnabled: true,
				createdAt: now,
				updatedAt: now,
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.id).toBe(primitives.id);
			expect(viewModel.userId).toBe(primitives.userId);
			expect(viewModel.email).toBe(primitives.email);
			expect(viewModel.emailVerified).toBe(primitives.emailVerified);
			expect(viewModel.lastLoginAt).toEqual(primitives.lastLoginAt);
			expect(viewModel.password).toBe(primitives.password);
			expect(viewModel.phoneNumber).toBe(primitives.phoneNumber);
			expect(viewModel.provider).toBe(primitives.provider);
			expect(viewModel.providerId).toBe(primitives.providerId);
			expect(viewModel.twoFactorEnabled).toBe(primitives.twoFactorEnabled);
			expect(viewModel.createdAt).toEqual(primitives.createdAt);
			expect(viewModel.updatedAt).toEqual(primitives.updatedAt);
		});

		it('should create an AuthViewModel from primitives with null optional fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');

			const primitives: AuthPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: '123e4567-e89b-12d3-a456-426614174001',
				email: null,
				emailVerified: false,
				lastLoginAt: null,
				password: null,
				phoneNumber: null,
				provider: AuthProviderEnum.GOOGLE,
				providerId: 'google-123',
				twoFactorEnabled: false,
				createdAt: now,
				updatedAt: now,
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.id).toBe(primitives.id);
			expect(viewModel.userId).toBe(primitives.userId);
			expect(viewModel.email).toBeNull();
			expect(viewModel.lastLoginAt).toBeNull();
			expect(viewModel.password).toBeNull();
			expect(viewModel.phoneNumber).toBeNull();
			expect(viewModel.provider).toBe(primitives.provider);
			expect(viewModel.providerId).toBe(primitives.providerId);
		});

		it('should create an AuthViewModel from primitives with null providerId', () => {
			const now = new Date('2024-01-01T10:00:00Z');

			const primitives: AuthPrimitives = {
				id: '123e4567-e89b-12d3-a456-426614174000',
				userId: '123e4567-e89b-12d3-a456-426614174001',
				email: 'test@example.com',
				emailVerified: false,
				lastLoginAt: null,
				password: 'SecurePass123!',
				phoneNumber: null,
				provider: AuthProviderEnum.LOCAL,
				providerId: null,
				twoFactorEnabled: false,
				createdAt: now,
				updatedAt: now,
			};

			const viewModel = factory.fromPrimitives(primitives);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.providerId).toBeNull();
		});
	});

	describe('fromAggregate', () => {
		it('should create an AuthViewModel from an aggregate with all fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const lastLoginAt = new Date('2024-01-01T09:00:00Z');

			const aggregate = new AuthAggregate(
				{
					id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
					userId: new UserUuidValueObject(
						'123e4567-e89b-12d3-a456-426614174001',
					),
					email: new AuthEmailValueObject('test@example.com'),
					emailVerified: new AuthEmailVerifiedValueObject(true),
					lastLoginAt: new AuthLastLoginAtValueObject(lastLoginAt),
					password: new AuthPasswordValueObject('SecurePass123!'),
					phoneNumber: new AuthPhoneNumberValueObject('+1234567890'),
					provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
					providerId: new AuthProviderIdValueObject('local-123'),
					twoFactorEnabled: new AuthTwoFactorEnabledValueObject(true),
					createdAt: new DateValueObject(now),
					updatedAt: new DateValueObject(now),
				},
				false,
			);

			const viewModel = factory.fromAggregate(aggregate);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.id).toBe(aggregate.id.value);
			expect(viewModel.userId).toBe(aggregate.userId.value);
			expect(viewModel.email).toBe(aggregate.email?.value);
			expect(viewModel.emailVerified).toBe(aggregate.emailVerified.value);
			expect(viewModel.lastLoginAt).toEqual(aggregate.lastLoginAt?.value);
			expect(viewModel.password).toBe(aggregate.password?.value);
			expect(viewModel.phoneNumber).toBe(aggregate.phoneNumber?.value);
			expect(viewModel.provider).toBe(aggregate.provider.value);
			expect(viewModel.providerId).toBe(aggregate.providerId?.value);
			expect(viewModel.twoFactorEnabled).toBe(aggregate.twoFactorEnabled.value);
			expect(viewModel.createdAt).toEqual(aggregate.createdAt.value);
			expect(viewModel.updatedAt).toEqual(aggregate.updatedAt.value);
		});

		it('should create an AuthViewModel from an aggregate with null optional fields', () => {
			const now = new Date('2024-01-01T10:00:00Z');

			const aggregate = new AuthAggregate(
				{
					id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
					userId: new UserUuidValueObject(
						'123e4567-e89b-12d3-a456-426614174001',
					),
					email: null,
					emailVerified: new AuthEmailVerifiedValueObject(false),
					lastLoginAt: null,
					password: null,
					phoneNumber: null,
					provider: new AuthProviderValueObject(AuthProviderEnum.GOOGLE),
					providerId: new AuthProviderIdValueObject('google-123'),
					twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
					createdAt: new DateValueObject(now),
					updatedAt: new DateValueObject(now),
				},
				false,
			);

			const viewModel = factory.fromAggregate(aggregate);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.id).toBe(aggregate.id.value);
			expect(viewModel.userId).toBe(aggregate.userId.value);
			expect(viewModel.email).toBeNull();
			expect(viewModel.lastLoginAt).toBeNull();
			expect(viewModel.password).toBeNull();
			expect(viewModel.phoneNumber).toBeNull();
			expect(viewModel.provider).toBe(aggregate.provider.value);
			expect(viewModel.providerId).toBe(aggregate.providerId?.value);
		});

		it('should create an AuthViewModel from an aggregate with null providerId', () => {
			const now = new Date('2024-01-01T10:00:00Z');

			const aggregate = new AuthAggregate(
				{
					id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
					userId: new UserUuidValueObject(
						'123e4567-e89b-12d3-a456-426614174001',
					),
					email: new AuthEmailValueObject('test@example.com'),
					emailVerified: new AuthEmailVerifiedValueObject(false),
					lastLoginAt: null,
					password: new AuthPasswordValueObject('SecurePass123!'),
					phoneNumber: null,
					provider: new AuthProviderValueObject(AuthProviderEnum.LOCAL),
					providerId: null,
					twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
					createdAt: new DateValueObject(now),
					updatedAt: new DateValueObject(now),
				},
				false,
			);

			const viewModel = factory.fromAggregate(aggregate);

			expect(viewModel).toBeInstanceOf(AuthViewModel);
			expect(viewModel.providerId).toBeNull();
		});

		it('should handle different provider types correctly', () => {
			const now = new Date('2024-01-01T10:00:00Z');
			const providers = [
				AuthProviderEnum.LOCAL,
				AuthProviderEnum.GOOGLE,
				AuthProviderEnum.APPLE,
			];

			providers.forEach((provider) => {
				const aggregate = new AuthAggregate(
					{
						id: new AuthUuidValueObject('123e4567-e89b-12d3-a456-426614174000'),
						userId: new UserUuidValueObject(
							'123e4567-e89b-12d3-a456-426614174001',
						),
						email: new AuthEmailValueObject('test@example.com'),
						emailVerified: new AuthEmailVerifiedValueObject(false),
						lastLoginAt: null,
						password:
							provider === AuthProviderEnum.LOCAL
								? new AuthPasswordValueObject('SecurePass123!')
								: null,
						phoneNumber: null,
						provider: new AuthProviderValueObject(provider),
						providerId:
							provider !== AuthProviderEnum.LOCAL
								? new AuthProviderIdValueObject(`${provider}-123`)
								: null,
						twoFactorEnabled: new AuthTwoFactorEnabledValueObject(false),
						createdAt: new DateValueObject(now),
						updatedAt: new DateValueObject(now),
					},
					false,
				);

				const viewModel = factory.fromAggregate(aggregate);

				expect(viewModel.provider).toBe(provider);
			});
		});
	});
});
