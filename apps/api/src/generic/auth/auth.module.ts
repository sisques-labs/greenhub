import { Global, Module } from '@nestjs/common';

import { AuthProfileMeQueryHandler } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query-handler';
import { AuthUserProfileViewModelFactory } from '@/generic/auth/domain/factories/auth-user-profile-view-model/auth-user-profile-view-model.factory';
import { ClerkAuthGuard } from '@/generic/auth/infrastructure/auth/clerk-auth.guard';
import { OwnerGuard } from '@/generic/auth/infrastructure/guards/owner/owner.guard';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { AuthUserProfileGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth-user-profile/auth-user-profile.mapper';
import { AuthQueryResolver } from '@/generic/auth/transport/graphql/resolvers/auth-queries/auth-queries.resolver';
import { SharedModule } from '@/shared/shared.module';

const RESOLVERS = [AuthQueryResolver];

const QUERY_HANDLERS = [AuthProfileMeQueryHandler];

const FACTORIES = [AuthUserProfileViewModelFactory];

const MAPPERS = [AuthUserProfileGraphQLMapper];

const GUARDS = [ClerkAuthGuard, RolesGuard, OwnerGuard];

@Global()
@Module({
	imports: [SharedModule],
	controllers: [],
	providers: [
		...RESOLVERS,
		...QUERY_HANDLERS,
		...FACTORIES,
		...MAPPERS,
		...GUARDS,
	],
	exports: [...GUARDS],
})
export class AuthModule {}
