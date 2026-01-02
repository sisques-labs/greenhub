import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthCreateCommandHandler } from '@/generic/auth/application/commands/auth-create/auth-create.command-handler';
import { AuthDeleteCommandHandler } from '@/generic/auth/application/commands/auth-delete/auth-delete.command-handler';
import { AuthLoginByEmailCommandHandler } from '@/generic/auth/application/commands/auth-login-by-email/auth-login-by-email.command-handler';
import { AuthRefreshTokenCommandHandler } from '@/generic/auth/application/commands/auth-refresh-token/auth-refresh-token.command-handler';
import { AuthRegisterByEmailCommandHandler } from '@/generic/auth/application/commands/auth-register-by-email/auth-register-by-email.command-handler';
import { AuthCreatedEventHandler } from '@/generic/auth/application/event-handlers/auth-created/auth-created.event-handler';
import { AuthLoggedInByEmailEventHandler } from '@/generic/auth/application/event-handlers/auth-logged-in-by-email/auth-logged-in-by-email.event-handler';
import { AuthRegisteredByEmailEventHandler } from '@/generic/auth/application/event-handlers/auth-registered-by-email/auth-registered-by-email.event-handler';
import { AuthUpdatedEventHandler } from '@/generic/auth/application/event-handlers/auth-updated/auth-updated.event-handler';
import { AuthProfileMeQueryHandler } from '@/generic/auth/application/queries/auth-profile-me/auth-profile-me.query-handler';
import { AuthViewModelFindByUserIdQueryHandler } from '@/generic/auth/application/queries/auth-view-model-find-by-user-id/auth-view-model-find-by-user-id.query-handler';
import { FindAuthsByCriteriaQueryHandler } from '@/generic/auth/application/queries/find-auths-by-criteria/find-auths-by-criteria.query-handler';
import { AuthRegistrationSaga } from '@/generic/auth/application/sagas/auth-registration/auth-registration.saga';
import { AssertAuthEmailExistsService } from '@/generic/auth/application/services/assert-auth-email-exists/assert-auth-email-exists.service';
import { AssertAuthEmailNotExistsService } from '@/generic/auth/application/services/assert-auth-email-not-exists/assert-auth-email-not-exists.service';
import { AssertAuthExistsService } from '@/generic/auth/application/services/assert-auth-exists/assert-auth-exsists.service';
import { AssertAuthViewModelExistsService } from '@/generic/auth/application/services/assert-auth-view-model-exists/assert-auth-view-model-exists.service';
import { AssertAuthViewModelExistsByUserIdService } from '@/generic/auth/application/services/assert-auth-view-model-exists-by-user-id/assert-auth-view-model-exists-by-user-id.service';
import { JwtAuthService } from '@/generic/auth/application/services/jwt-auth/jwt-auth.service';
import { AuthAggregateFactory } from '@/generic/auth/domain/factories/auth-aggregate/auth-aggregate.factory';
import { AuthUserProfileViewModelFactory } from '@/generic/auth/domain/factories/auth-user-profile-view-model/auth-user-profile-view-model.factory';
import { AuthViewModelFactory } from '@/generic/auth/domain/factories/auth-view-model/auth-view-model.factory';
import { AUTH_READ_REPOSITORY_TOKEN } from '@/generic/auth/domain/repositories/auth-read.repository';
import { AUTH_WRITE_REPOSITORY_TOKEN } from '@/generic/auth/domain/repositories/auth-write.repository';
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { AuthMongoDBMapper } from '@/generic/auth/infrastructure/database/mongodb/mappers/auth-mongodb.mapper';
import { AuthMongoRepository } from '@/generic/auth/infrastructure/database/mongodb/repositories/auth-mongodb.repository';
import { AuthTypeormEntity } from '@/generic/auth/infrastructure/database/typeorm/entities/auth-typeorm.entity';
import { AuthTypeormMapper } from '@/generic/auth/infrastructure/database/typeorm/mappers/auth-typeorm.mapper';
import { AuthTypeormRepository } from '@/generic/auth/infrastructure/database/typeorm/repositories/auth-typeorm.repository';
import { OwnerGuard } from '@/generic/auth/infrastructure/guards/owner/owner.guard';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { JwtStrategy } from '@/generic/auth/infrastructure/strategies/jwt/jwt.strategy';
import { AuthGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth/auth.mapper';
import { AuthUserProfileGraphQLMapper } from '@/generic/auth/transport/graphql/mappers/auth-user-profile/auth-user-profile.mapper';
import { AuthMutationsResolver } from '@/generic/auth/transport/graphql/resolvers/auth-mutations/auth-mutations.resolver';
import { AuthQueryResolver } from '@/generic/auth/transport/graphql/resolvers/auth-queries/auth-queries.resolver';
import { SharedModule } from '@/shared/shared.module';

const RESOLVERS = [AuthQueryResolver, AuthMutationsResolver];

const SERVICES = [
	AssertAuthEmailExistsService,
	AssertAuthEmailNotExistsService,
	AssertAuthViewModelExistsByUserIdService,
	AssertAuthViewModelExistsService,
	AssertAuthExistsService,
	JwtAuthService,
];

const QUERY_HANDLERS = [
	AuthProfileMeQueryHandler,
	FindAuthsByCriteriaQueryHandler,
];

const QUERY_HANDLERS_VIEW_MODELS = [AuthViewModelFindByUserIdQueryHandler];

const COMMAND_HANDLERS = [
	AuthCreateCommandHandler,
	AuthDeleteCommandHandler,
	AuthLoginByEmailCommandHandler,
	AuthRefreshTokenCommandHandler,
	AuthRegisterByEmailCommandHandler,
];

const EVENT_HANDLERS = [
	AuthCreatedEventHandler,
	AuthLoggedInByEmailEventHandler,
	AuthRegisteredByEmailEventHandler,
	AuthUpdatedEventHandler,
];

const SAGAS = [AuthRegistrationSaga];

const FACTORIES = [
	AuthAggregateFactory,
	AuthViewModelFactory,
	AuthUserProfileViewModelFactory,
];

const MAPPERS = [
	AuthTypeormMapper,
	AuthMongoDBMapper,
	AuthGraphQLMapper,
	AuthUserProfileGraphQLMapper,
];

const STRATEGIES = [JwtStrategy];

const GUARDS = [JwtAuthGuard, RolesGuard, OwnerGuard];

const REPOSITORIES = [
	{
		provide: AUTH_WRITE_REPOSITORY_TOKEN,
		useClass: AuthTypeormRepository,
	},
	{
		provide: AUTH_READ_REPOSITORY_TOKEN,
		useClass: AuthMongoRepository,
	},
];

const ENTITIES = [AuthTypeormEntity];

@Global()
@Module({
	imports: [
		SharedModule,
		TypeOrmModule.forFeature(ENTITIES),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret:
					configService.get<string>('JWT_ACCESS_SECRET') || 'access-secret',
				signOptions: {
					expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRATION') ||
						'15m') as any,
				},
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [],
	providers: [
		...RESOLVERS,
		...SERVICES,
		...QUERY_HANDLERS,
		...QUERY_HANDLERS_VIEW_MODELS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...SAGAS,
		...REPOSITORIES,
		...FACTORIES,
		...MAPPERS,
		...STRATEGIES,
		...GUARDS,
	],
	exports: [...SERVICES, ...GUARDS],
})
export class AuthModule {}
