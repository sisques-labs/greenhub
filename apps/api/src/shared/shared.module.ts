import { Global, Module } from '@nestjs/common';

import { PasswordHashingService } from '@/generic/auth/application/services/password-hashing/password-hashing.service';
import { PublishDomainEventsService } from '@/shared/application/services/publish-domain-events/publish-domain-events.service';
import { PublishIntegrationEventsService } from '@/shared/application/services/publish-integration-events/publish-integration-events.service';
import { DOMAIN_EVENT_PUBLISHER_TOKEN } from '@/shared/domain/interfaces/domain-event-publisher.interface';
import { INTEGRATION_EVENT_PUBLISHER_TOKEN } from '@/shared/domain/interfaces/integration-event-publisher.interface';
import { TypeOrmModule } from '@/shared/infrastructure/database/typeorm/typeorm.module';
import { EventBusDomainEventPublisher } from '@/shared/infrastructure/event-publishers/event-bus/event-bus-domain-event-publisher';
import { EventBusIntegrationEventPublisher } from '@/shared/infrastructure/event-publishers/event-bus/event-bus-integration-event-publisher';
import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

import { MongoModule } from './infrastructure/database/mongodb/mongodb.module';

// Import enums for GraphQL
import '@/shared/transport/graphql/enums/shared-registered-enums.graphql';

const RESOLVERS = [];

const SERVICES = [
	PasswordHashingService,
	PublishDomainEventsService,
	PublishIntegrationEventsService,
];

const EVENT_PUBLISHERS = [
	{
		provide: DOMAIN_EVENT_PUBLISHER_TOKEN,
		useClass: EventBusDomainEventPublisher,
	},
	{
		provide: INTEGRATION_EVENT_PUBLISHER_TOKEN,
		useClass: EventBusIntegrationEventPublisher,
	},
];

const QUERY_HANDLERS = [];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [];

const MAPPERS = [MutationResponseGraphQLMapper];

const REPOSITORIES = [];

@Global()
@Module({
	imports: [MongoModule, TypeOrmModule],
	controllers: [],
	providers: [
		...RESOLVERS,
		...SERVICES,
		...EVENT_PUBLISHERS,
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
		...RESOLVERS,
		...SERVICES,
		...EVENT_PUBLISHERS,
		...QUERY_HANDLERS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...FACTORIES,
		...MAPPERS,
		...REPOSITORIES,
	],
})
export class SharedModule {}
