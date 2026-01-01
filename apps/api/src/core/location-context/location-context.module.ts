import { LocationCreateCommandHandler } from '@/core/location-context/application/commands/location/location-create/location-create.command-handler';
import { LocationDeleteCommandHandler } from '@/core/location-context/application/commands/location/location-delete/location-delete.command-handler';
import { LocationUpdateCommandHandler } from '@/core/location-context/application/commands/location/location-update/location-update.command-handler';
import { LocationCreatedEventHandler } from '@/core/location-context/application/event-handlers/location/location-created/location-created.event-handler';
import { LocationDeletedEventHandler } from '@/core/location-context/application/event-handlers/location/location-deleted/location-deleted.event-handler';
import { LocationUpdatedEventHandler } from '@/core/location-context/application/event-handlers/location/location-updated/location-updated.event-handler';
import { LocationFindByCriteriaQueryHandler } from '@/core/location-context/application/queries/location/location-find-by-criteria/location-find-by-criteria.query-handler';
import { LocationFindByIdQueryHandler } from '@/core/location-context/application/queries/location/location-find-by-id/location-find-by-id.query-handler';
import { LocationViewModelFindByIdQueryHandler } from '@/core/location-context/application/queries/location/location-view-model-find-by-id/location-view-model-find-by-id.query-handler';
import { AssertLocationExistsService } from '@/core/location-context/application/services/location/assert-location-exists/assert-location-exists.service';
import { AssertLocationViewModelExistsService } from '@/core/location-context/application/services/location/assert-location-view-model-exists/assert-location-view-model-exists.service';
import { LocationAggregateFactory } from '@/core/location-context/domain/factories/aggregates/location-aggregate/location-aggregate.factory';
import { LocationViewModelFactory } from '@/core/location-context/domain/factories/view-models/location-view-model/location-view-model.factory';
import { LOCATION_READ_REPOSITORY_TOKEN } from '@/core/location-context/domain/repositories/location-read/location-read.repository';
import { LOCATION_WRITE_REPOSITORY_TOKEN } from '@/core/location-context/domain/repositories/location-write/location-write.repository';
import { LocationMongoDBMapper } from '@/core/location-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';
import { LocationMongoRepository } from '@/core/location-context/infrastructure/database/mongodb/repositories/location-mongodb.repository';
import { LocationTypeormEntity } from '@/core/location-context/infrastructure/database/typeorm/entities/location-typeorm.entity';
import { LocationTypeormMapper } from '@/core/location-context/infrastructure/database/typeorm/mappers/location/location-typeorm.mapper';
import { LocationTypeormRepository } from '@/core/location-context/infrastructure/database/typeorm/repositories/location/location-typeorm.repository';
import '@/core/location-context/transport/graphql/enums/location/location-registered-enums.graphql';
import { LocationGraphQLMapper } from '@/core/location-context/transport/graphql/mappers/location/location.mapper';
import { LocationMutationsResolver } from '@/core/location-context/transport/graphql/resolvers/location/location-mutations.resolver';
import { LocationQueriesResolver } from '@/core/location-context/transport/graphql/resolvers/location/location-queries.resolver';
import '@/core/plant-context/transport/graphql/enums/growing-unit/growing-unit-registered-enums.graphql';
import '@/core/plant-context/transport/graphql/enums/plant/plant-registered-enums.graphql';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [
	// Location resolvers
	LocationMutationsResolver,
	LocationQueriesResolver,
];

const DOMAIN_SERVICES = [];

const APPLICATION_SERVICES = [
	// Location services
	AssertLocationExistsService,
	AssertLocationViewModelExistsService,
];

const QUERY_HANDLERS = [
	// Location query handlers
	LocationFindByCriteriaQueryHandler,
	LocationFindByIdQueryHandler,
	LocationViewModelFindByIdQueryHandler,
];

const COMMAND_HANDLERS = [
	// Location command handlers
	LocationCreateCommandHandler,
	LocationUpdateCommandHandler,
	LocationDeleteCommandHandler,
];

const EVENT_HANDLERS = [
	// Location event handlers
	LocationCreatedEventHandler,
	LocationUpdatedEventHandler,
	LocationDeletedEventHandler,
];

const FACTORIES = [
	// Location factories
	LocationAggregateFactory,
	LocationViewModelFactory,
];

const MAPPERS = [
	// Location mappers
	LocationTypeormMapper,
	LocationMongoDBMapper,
	LocationGraphQLMapper,
];

const REPOSITORIES = [
	// Location repositories
	{
		provide: LOCATION_WRITE_REPOSITORY_TOKEN,
		useClass: LocationTypeormRepository,
	},
	{
		provide: LOCATION_READ_REPOSITORY_TOKEN,
		useClass: LocationMongoRepository,
	},
];

const ENTITIES = [LocationTypeormEntity];

@Module({
	imports: [SharedModule, TypeOrmModule.forFeature(ENTITIES)],
	controllers: [],
	providers: [
		...RESOLVERS,
		...DOMAIN_SERVICES,
		...APPLICATION_SERVICES,
		...QUERY_HANDLERS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...REPOSITORIES,
		...FACTORIES,
		...MAPPERS,
	],
})
export class LocationContextModule {}
