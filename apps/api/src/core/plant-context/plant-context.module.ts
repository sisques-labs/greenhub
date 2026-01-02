import { GrowingUnitCreateCommandHandler } from '@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command-handler';
import { GrowingUnitDeleteCommandHandler } from '@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command-handler';
import { GrowingUnitUpdateCommandHandler } from '@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command-handler';
import { PlantAddCommandHandler } from '@/core/plant-context/application/commands/plant/plant-add/plant-add.command-handler';
import { PlantRemoveCommandHandler } from '@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command-handler';
import { PlantTransplantCommandHandler } from '@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command-handler';
import { PlantUpdateCommandHandler } from '@/core/plant-context/application/commands/plant/plant-update/plant-update.command-handler';
import { GrowingUnitCreatedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-created/growing-unit-created.event-handler';
import { GrowingUnitDeletedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-deleted/growing-unit-deleted.event-handler';
import { GrowingUnitPlantAddedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-plant-added/growing-unit-added.event-handler';
import { GrowingUnitPlantRemovedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-plant-removed/growing-unit-removed.event-handler';
import { GrowingUnitUpdatedEventHandler } from '@/core/plant-context/application/event-handlers/growing-unit/growing-unit-updated/growing-unit-updated.event-handler';
import { PlantCreatedEventHandler } from '@/core/plant-context/application/event-handlers/plant/plant-created/plant-created.event-handler';
import { PlantDeletedEventHandler } from '@/core/plant-context/application/event-handlers/plant/plant-deleted/plant-deleted.event-handler';
import { PlantUpdatedEventHandler } from '@/core/plant-context/application/event-handlers/plant/plant-updated/plant-updated.event-handler';
import { GrowingUnitFindByCriteriaQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria-by-criteria.query-handler';
import { GrowingUnitFindByIdQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.query-handler';
import { GrowingUnitFindByLocationIdQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-location-id/growing-unit-find-by-location-id.query-handler';
import { GrowingUnitViewModelFindByIdQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query-handler';
import { GrowingUnitViewModelFindByLocationIdQueryHandler } from '@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-location-id/growing-unit-view-model-find-by-location-id.query-handler';
import { FindPlantsByCriteriaQueryHandler } from '@/core/plant-context/application/queries/plant/find-plants-by-criteria/find-plants-by-criteria.query-handler';
import { PlantViewModelFindByIdQueryHandler } from '@/core/plant-context/application/queries/plant/plant-view-model-find-by-id/plant-view-model-find-by-id.query-handler';
import { AssertGrowingUnitExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service';
import { AssertGrowingUnitViewModelExistsService } from '@/core/plant-context/application/services/growing-unit/assert-growing-unit-view-model-exists/assert-growing-unit-view-model-exists.service';
import { AssertPlantExistsInGrowingUnitService } from '@/core/plant-context/application/services/growing-unit/assert-plant-exists-in-growing-unit/assert-plant-exists-in-growing-unit.service';
import { AssertPlantViewModelExistsService } from '@/core/plant-context/application/services/plant/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { GrowingUnitViewModelBuilder } from '@/core/plant-context/domain/builders/growing-unit/growing-unit-view-model.builder';
import { LocationViewModelBuilder } from '@/core/plant-context/domain/builders/location/location-view-model.builder';
import { PlantViewModelBuilder } from '@/core/plant-context/domain/builders/plant/plant-view-model.builder';
import { GrowingUnitAggregateFactory } from '@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory';
import { PlantEntityFactory } from '@/core/plant-context/domain/factories/entities/plant/plant-entity.factory';
import { GROWING_UNIT_READ_REPOSITORY_TOKEN } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository';
import { GROWING_UNIT_WRITE_REPOSITORY_TOKEN } from '@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository';
import { PLANT_READ_REPOSITORY_TOKEN } from '@/core/plant-context/domain/repositories/plant/plant-read/plant-read.repository';
import { PlantTransplantService } from '@/core/plant-context/domain/services/plant/plant-transplant/plant-transplant.service';
import { GrowingUnitMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/growing-unit/growing-unit-mongodb.mapper';
import { LocationMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/location/location-mongodb.mapper';
import { PlantMongoDBMapper } from '@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper';
import { GrowingUnitMongoRepository } from '@/core/plant-context/infrastructure/database/mongodb/repositories/growing-unit/growing-unit-mongodb.repository';
import { PlantMongoRepository } from '@/core/plant-context/infrastructure/database/mongodb/repositories/plant/plant-mongodb.repository';
import { GrowingUnitTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity';
import { PlantTypeormEntity } from '@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { GrowingUnitTypeormMapper } from '@/core/plant-context/infrastructure/database/typeorm/mappers/growing-unit/growing-unit-typeorm.mapper';
import { PlantTypeormMapper } from '@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper';
import { GrowingUnitTypeormRepository } from '@/core/plant-context/infrastructure/database/typeorm/repositories/growing-unit/growing-unit-typeorm.repository';
import '@/core/plant-context/transport/graphql/enums/growing-unit/growing-unit-registered-enums.graphql';
import '@/core/plant-context/transport/graphql/enums/plant/plant-registered-enums.graphql';
import { GrowingUnitGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/growing-unit/growing-unit.mapper';
import { LocationGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/location/location.mapper';
import { PlantGraphQLMapper } from '@/core/plant-context/transport/graphql/mappers/plant/plant.mapper';
import { GrowingUnitMutationsResolver } from '@/core/plant-context/transport/graphql/resolvers/growing-unit/growing-unit-mutations.resolver';
import { GrowingUnitQueriesResolver } from '@/core/plant-context/transport/graphql/resolvers/growing-unit/growing-unit-queries.resolver';
import { PlantMutationsResolver } from '@/core/plant-context/transport/graphql/resolvers/plant/plant-mutations.resolver';
import { PlantQueriesResolver } from '@/core/plant-context/transport/graphql/resolvers/plant/plant-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [
	// Growing Unit resolvers
	GrowingUnitMutationsResolver,
	GrowingUnitQueriesResolver,

	// Plant resolvers
	PlantMutationsResolver,
	PlantQueriesResolver,
];

const DOMAIN_SERVICES = [
	// Plant services
	PlantTransplantService,
];

const APPLICATION_SERVICES = [
	// Growing Unit services
	AssertGrowingUnitExistsService,
	AssertGrowingUnitViewModelExistsService,

	// Plant services
	AssertPlantViewModelExistsService,
	AssertPlantExistsInGrowingUnitService,
];

const QUERY_HANDLERS = [
	// Growing Unit query handlers
	GrowingUnitFindByCriteriaQueryHandler,
	GrowingUnitFindByIdQueryHandler,
	GrowingUnitFindByLocationIdQueryHandler,
	GrowingUnitViewModelFindByIdQueryHandler,
	GrowingUnitViewModelFindByLocationIdQueryHandler,

	// Plant query handlers
	PlantViewModelFindByIdQueryHandler,
	FindPlantsByCriteriaQueryHandler,
];

const COMMAND_HANDLERS = [
	// Growing Unit command handlers
	GrowingUnitCreateCommandHandler,
	GrowingUnitUpdateCommandHandler,
	GrowingUnitDeleteCommandHandler,

	// Plant command handlers
	PlantAddCommandHandler,
	PlantUpdateCommandHandler,
	PlantRemoveCommandHandler,
	PlantTransplantCommandHandler,
];

const EVENT_HANDLERS = [
	// Growing Unit event handlers
	GrowingUnitCreatedEventHandler,
	GrowingUnitDeletedEventHandler,
	GrowingUnitUpdatedEventHandler,

	// Plant event handlers
	PlantCreatedEventHandler,
	PlantDeletedEventHandler,
	PlantUpdatedEventHandler,
	GrowingUnitPlantAddedEventHandler,
	GrowingUnitPlantRemovedEventHandler,
];

const BUILDERS = [
	// Plant builders
	PlantViewModelBuilder,
	// Location builders
	LocationViewModelBuilder,
	// Growing unit builders
	GrowingUnitViewModelBuilder,
];

const FACTORIES = [
	// Growing unit factories
	GrowingUnitAggregateFactory,

	// Plant factories
	PlantEntityFactory,
];

const MAPPERS = [
	// Growing unit mappers
	GrowingUnitTypeormMapper,
	GrowingUnitMongoDBMapper,
	GrowingUnitGraphQLMapper,

	// Plant mappers
	PlantTypeormMapper,
	PlantMongoDBMapper,
	PlantGraphQLMapper,

	// Location mappers
	LocationMongoDBMapper,
	LocationGraphQLMapper,
];

const REPOSITORIES = [
	{
		provide: GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
		useClass: GrowingUnitTypeormRepository,
	},
	{
		provide: GROWING_UNIT_READ_REPOSITORY_TOKEN,
		useClass: GrowingUnitMongoRepository,
	},
	{
		provide: PLANT_READ_REPOSITORY_TOKEN,
		useClass: PlantMongoRepository,
	},
];

const ENTITIES = [GrowingUnitTypeormEntity, PlantTypeormEntity];

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
		...BUILDERS,
		...FACTORIES,
		...MAPPERS,
	],
})
export class PlantContextModule {}
