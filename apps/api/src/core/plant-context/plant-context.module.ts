import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GrowingUnitCreateCommandHandler } from "@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command-handler";
import { GrowingUnitDeleteCommandHandler } from "@/core/plant-context/application/commands/growing-unit/growing-unit-delete/growing-unit-delete.command-handler";
import { GrowingUnitUpdateCommandHandler } from "@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command-handler";
import { PlantAddCommandHandler } from "@/core/plant-context/application/commands/plant/plant-add/plant-add.command-handler";
import { PlantRemoveCommandHandler } from "@/core/plant-context/application/commands/plant/plant-remove/plant-remove.command-handler";
import { PlantTransplantCommandHandler } from "@/core/plant-context/application/commands/plant/plant-transplant/plant-transplant.command-handler";
import { PlantUpdateCommandHandler } from "@/core/plant-context/application/commands/plant/plant-update/plant-update.command-handler";
import { GrowingUnitCreatedEventHandler } from "@/core/plant-context/application/event-handlers/growing-unit/growing-unit-created/growing-unit-created.event-handler";
import { GrowingUnitDeletedEventHandler } from "@/core/plant-context/application/event-handlers/growing-unit/growing-unit-deleted/growing-unit-deleted.event-handler";
import { GrowingUnitUpdatedEventHandler } from "@/core/plant-context/application/event-handlers/growing-unit/growing-unit-updated/growing-unit-updated.event-handler";
// Import enums for GraphQL
import { PlantCreatedEventHandler } from "@/core/plant-context/application/event-handlers/plant/plant-added/plant-added.event-handler";
import { PlantDeletedEventHandler } from "@/core/plant-context/application/event-handlers/plant/plant-removed/plant-removed.event-handler";
import { PlantUpdatedEventHandler } from "@/core/plant-context/application/event-handlers/plant/plant-updated/plant-updated.event-handler";
import { GrowingUnitFindByCriteriaQueryHandler } from "@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-criteria/growing-unit-find-by-criteria-by-criteria.query-handler";
import { GrowingUnitFindByIdQueryHandler } from "@/core/plant-context/application/queries/growing-unit/growing-unit-find-by-id/growing-unit-find-by-id.query-handler";
import { GrowingUnitViewModelFindByIdQueryHandler } from "@/core/plant-context/application/queries/growing-unit/growing-unit-view-model-find-by-id/growing-unit-view-model-find-by-id.query-handler";
import { PlantFindByIdQueryHandler } from "@/core/plant-context/application/queries/plant/plant-find-by-id/plant-find-by-id.query-handler";
import { AssertGrowingUnitExistsService } from "@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service";
import { AssertGrowingUnitViewModelExistsService } from "@/core/plant-context/application/services/growing-unit/assert-growing-unit-view-model-exists/assert-growing-unit-view-model-exists.service";
import { AssertPlantExistsService } from "@/core/plant-context/application/services/plant/assert-plant-exists/assert-plant-exists.service";
import { GrowingUnitAggregateFactory } from "@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory";
import { PlantEntityFactory } from "@/core/plant-context/domain/factories/entities/plant/plant-entity.factory";
import { GrowingUnitViewModelFactory } from "@/core/plant-context/domain/factories/view-models/growing-unit-view-model/growing-unit-view-model.factory";
import { PlantViewModelFactory } from "@/core/plant-context/domain/factories/view-models/plant-view-model/plant-view-model.factory";
import { GROWING_UNIT_READ_REPOSITORY_TOKEN } from "@/core/plant-context/domain/repositories/growing-unit/growing-unit-read/growing-unit-read.repository";
import { GROWING_UNIT_WRITE_REPOSITORY_TOKEN } from "@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository";
import { PLANT_WRITE_REPOSITORY_TOKEN } from "@/core/plant-context/domain/repositories/plant/plant-write/plant-write.repository";
import { PlantTransplantService } from "@/core/plant-context/domain/services/plant/plant-transplant/plant-transplant.service";
import { GrowingUnitMongoDBMapper } from "@/core/plant-context/infrastructure/database/mongodb/mappers/growing-unit/growing-unit-mongodb.mapper";
import { PlantMongoDBMapper } from "@/core/plant-context/infrastructure/database/mongodb/mappers/plant/plant-mongodb.mapper";
import { GrowingUnitMongoRepository } from "@/core/plant-context/infrastructure/database/mongodb/repositories/growing-unit-mongodb.repository";
import { GrowingUnitTypeormEntity } from "@/core/plant-context/infrastructure/database/typeorm/entities/growing-unit-typeorm.entity";
import { PlantTypeormEntity } from "@/core/plant-context/infrastructure/database/typeorm/entities/plant-typeorm.entity";
import { GrowingUnitTypeormMapper } from "@/core/plant-context/infrastructure/database/typeorm/mappers/growing-unit/growing-unit-typeorm.mapper";
import { PlantTypeormMapper } from "@/core/plant-context/infrastructure/database/typeorm/mappers/plant/plant-typeorm.mapper";
import { GrowingUnitTypeormRepository } from "@/core/plant-context/infrastructure/database/typeorm/repositories/growing-unit/growing-unit-typeorm.repository";
import { PlantTypeormRepository } from "@/core/plant-context/infrastructure/database/typeorm/repositories/plant/plant-typeorm.repository";
import { GrowingUnitGraphQLMapper } from "@/core/plant-context/transport/graphql/mappers/growing-unit/growing-unit.mapper";
import { PlantGraphQLMapper } from "@/core/plant-context/transport/graphql/mappers/plant/plant.mapper";
import { GrowingUnitMutationsResolver } from "@/core/plant-context/transport/graphql/resolvers/growing-unit/growing-unit-mutations.resolver";
import { GrowingUnitQueriesResolver } from "@/core/plant-context/transport/graphql/resolvers/growing-unit/growing-unit-queries.resolver";
import { PlantMutationsResolver } from "@/core/plant-context/transport/graphql/resolvers/plant/plant-mutations.resolver";
import { PlantQueriesResolver } from "@/core/plant-context/transport/graphql/resolvers/plant/plant-queries.resolver";
import { SharedModule } from "@/shared/shared.module";
import "@/core/plant-context/transport/graphql/enums/growing-unit/growing-unit-registered-enums.graphql";
import "@/core/plant-context/transport/graphql/enums/plant/plant-registered-enums.graphql";

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
	AssertPlantExistsService,
];

const QUERY_HANDLERS = [
	// Growing Unit query handlers
	GrowingUnitFindByCriteriaQueryHandler,
	GrowingUnitFindByIdQueryHandler,
	GrowingUnitViewModelFindByIdQueryHandler,

	// Plant query handlers
	PlantFindByIdQueryHandler,
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
];

const FACTORIES = [
	// Growing unit factories
	GrowingUnitAggregateFactory,
	GrowingUnitViewModelFactory,

	// Plant factories
	PlantEntityFactory,
	PlantViewModelFactory,
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
		provide: PLANT_WRITE_REPOSITORY_TOKEN,
		useClass: PlantTypeormRepository,
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
		...FACTORIES,
		...MAPPERS,
	],
})
export class PlantContextModule {}
