import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('AuthUserProfileResponseDto')
export class AuthUserProfileResponseDto {
	@Field(() => String, { description: 'The user id' })
	userId: string;

	@Field(() => String, { description: 'The auth id' })
	authId: string;

	@Field(() => String, { nullable: true, description: 'The email of the auth' })
	email?: string;

	@Field(() => Boolean, {
		nullable: true,
		description: 'The email verified status of the auth',
	})
	emailVerified?: boolean;

	@Field(() => Date, {
		nullable: true,
		description: 'The last login at of the auth',
	})
	lastLoginAt?: Date;

	@Field(() => String, {
		nullable: true,
		description: 'The phone number of the auth',
	})
	phoneNumber?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The provider of the auth',
	})
	provider?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The provider id of the auth',
	})
	providerId?: string;

	@Field(() => Boolean, {
		nullable: true,
		description: 'The two factor enabled status of the auth',
	})
	twoFactorEnabled?: boolean;

	@Field(() => String, {
		nullable: true,
		description: 'The user name of the user',
	})
	userName?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The first name of the user',
	})
	name?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The last name of the user',
	})
	lastName?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The bio of the user',
	})
	bio?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The avatar url of the user',
	})
	avatarUrl?: string;

	@Field(() => String, { nullable: true, description: 'The role of the user' })
	role?: string;

	@Field(() => String, {
		nullable: true,
		description: 'The status of the user',
	})
	status?: string;

	@Field(() => Date, {
		nullable: true,
		description: 'The created at timestamp',
	})
	createdAt?: Date;

	@Field(() => Date, {
		nullable: true,
		description: 'The updated at timestamp',
	})
	updatedAt?: Date;
}
