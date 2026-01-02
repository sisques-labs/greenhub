import { Global, Module } from '@nestjs/common';

import { PasswordHashingService } from '@/generic/auth/application/services/password-hashing/password-hashing.service';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { ClerkModule } from '@/shared/infrastructure/clerk/clerk.module';
import { TypeOrmModule } from '@/shared/infrastructure/database/typeorm/typeorm.module';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

import { MongoModule } from './infrastructure/database/mongodb/mongodb.module';

// Import enums for GraphQL
import '@/shared/transport/graphql/enums/shared-registered-enums.graphql';

const RESOLVERS = [];

const SERVICES = [PasswordHashingService, PublishIntegrationEventsService];

const QUERY_HANDLERS = [];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [];

const MAPPERS = [MutationResponseGraphQLMapper];

const REPOSITORIES = [];

@Global()
@Module({
	imports: [MongoModule, TypeOrmModule, ClerkModule],
	controllers: [],
	providers: [
		...RESOLVERS,
		...SERVICES,
		...QUERY_HANDLERS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...FACTORIES,
		...MAPPERS,
		...REPOSITORIES,
	],
	exports: [
		MongoModule,
		TypeOrmModule,
		ClerkModule,
		...RESOLVERS,
		...SERVICES,
		...QUERY_HANDLERS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...FACTORIES,
		...MAPPERS,
		...REPOSITORIES,
	],
})
export class SharedModule {}
