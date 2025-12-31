import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SagaInstanceChangeStatusCommandHandler } from "@/generic/saga-context/saga-instance/application/commands/saga-instance-change-status/saga-instance-change-status.command-handler";
import { SagaInstanceCreateCommandHandler } from "@/generic/saga-context/saga-instance/application/commands/saga-instance-create/saga-instance-create.command-handler";
import { SagaInstanceDeleteCommandHandler } from "@/generic/saga-context/saga-instance/application/commands/saga-instance-delete/saga-instance-delete.command-handler";
import { SagaInstanceUpdateCommandHandler } from "@/generic/saga-context/saga-instance/application/commands/saga-instance-update/saga-instance-update.command-handler";
import { SagaInstanceCreatedEventHandler } from "@/generic/saga-context/saga-instance/application/event-handlers/saga-instance-created/saga-instance-created.event-handler";
import { SagaInstanceDeletedEventHandler } from "@/generic/saga-context/saga-instance/application/event-handlers/saga-instance-deleted/saga-instance-deleted.event-handler";
import { SagaInstanceStatusChangedEventHandler } from "@/generic/saga-context/saga-instance/application/event-handlers/saga-instance-status-chaged/saga-instance-status-changed.event-handler";
import { SagaInstanceUpdatedEventHandler } from "@/generic/saga-context/saga-instance/application/event-handlers/saga-instance-updated/saga-instance-updated.event-handler";
import { FindSagaInstancesByCriteriaQueryHandler } from "@/generic/saga-context/saga-instance/application/queries/saga-instance-find-by-criteria/saga-instance-find-by-criteria.query-handler";
import { FindSagaInstanceByIdQueryHandler } from "@/generic/saga-context/saga-instance/application/queries/saga-instance-find-by-id/saga-instance-find-by-id.query-handler";
import { FindSagaInstanceViewModelByIdQueryHandler } from "@/generic/saga-context/saga-instance/application/queries/saga-instance-view-model-find-by-id/saga-instance-view-model-find-by-id.query-handler";
import { AssertSagaInstanceExistsService } from "@/generic/saga-context/saga-instance/application/services/assert-saga-instance-exists/assert-saga-instance-exists.service";
import { AssertSagaInstanceNotExistsService } from "@/generic/saga-context/saga-instance/application/services/assert-saga-instance-not-exists/assert-saga-instance-not-exists.service";
import { AssertSagaInstanceViewModelExistsService } from "@/generic/saga-context/saga-instance/application/services/assert-saga-instance-view-model-exists/assert-saga-instance-view-model-exists.service";
import { SagaInstanceAggregateFactory } from "@/generic/saga-context/saga-instance/domain/factories/saga-instance-aggregate/saga-instance-aggregate.factory";
import { SagaInstanceViewModelFactory } from "@/generic/saga-context/saga-instance/domain/factories/saga-instance-view-model/saga-instance-view-model.factory";
import { SAGA_INSTANCE_READ_REPOSITORY_TOKEN } from "@/generic/saga-context/saga-instance/domain/repositories/saga-instance-read.repository";
import { SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN } from "@/generic/saga-context/saga-instance/domain/repositories/saga-instance-write.repository";
import { SagaInstanceMongoDBMapper } from "@/generic/saga-context/saga-instance/infrastructure/database/mongodb/mappers/saga-instance-mongodb.mapper";
import { SagaInstanceMongoRepository } from "@/generic/saga-context/saga-instance/infrastructure/database/mongodb/repositories/saga-instance-mongodb.repository";
import { SagaInstanceTypeormEntity } from "@/generic/saga-context/saga-instance/infrastructure/database/typeorm/entities/saga-instance-typeorm.entity";
import { SagaInstanceTypeormMapper } from "@/generic/saga-context/saga-instance/infrastructure/database/typeorm/mappers/saga-instance-typeorm.mapper";
import { SagaInstanceTypeormRepository } from "@/generic/saga-context/saga-instance/infrastructure/database/typeorm/repositories/saga-instance-typeorm.repository";
import { SagaInstanceGraphQLMapper } from "@/generic/saga-context/saga-instance/transport/graphql/mappers/saga-instance.mapper";
import { SagaInstanceMutationsResolver } from "@/generic/saga-context/saga-instance/transport/graphql/resolvers/saga-instance-mutations.resolver";
import { SagaInstanceQueryResolver } from "@/generic/saga-context/saga-instance/transport/graphql/resolvers/saga-instance-queries.resolver";
import { SharedModule } from "@/shared/shared.module";

const RESOLVERS = [SagaInstanceQueryResolver, SagaInstanceMutationsResolver];

const SERVICES = [
	AssertSagaInstanceExistsService,
	AssertSagaInstanceNotExistsService,
	AssertSagaInstanceViewModelExistsService,
];

const QUERY_HANDLERS = [
	FindSagaInstancesByCriteriaQueryHandler,
	FindSagaInstanceByIdQueryHandler,
];

const QUERY_HANDLERS_VIEW_MODELS = [FindSagaInstanceViewModelByIdQueryHandler];

const COMMAND_HANDLERS = [
	SagaInstanceCreateCommandHandler,
	SagaInstanceUpdateCommandHandler,
	SagaInstanceDeleteCommandHandler,
	SagaInstanceChangeStatusCommandHandler,
];

const EVENT_HANDLERS = [
	SagaInstanceCreatedEventHandler,
	SagaInstanceUpdatedEventHandler,
	SagaInstanceDeletedEventHandler,
	SagaInstanceStatusChangedEventHandler,
];

const FACTORIES = [SagaInstanceAggregateFactory, SagaInstanceViewModelFactory];

const MAPPERS = [
	SagaInstanceTypeormMapper,
	SagaInstanceMongoDBMapper,
	SagaInstanceGraphQLMapper,
];

const REPOSITORIES = [
	{
		provide: SAGA_INSTANCE_WRITE_REPOSITORY_TOKEN,
		useClass: SagaInstanceTypeormRepository,
	},
	{
		provide: SAGA_INSTANCE_READ_REPOSITORY_TOKEN,
		useClass: SagaInstanceMongoRepository,
	},
];

const ENTITIES = [SagaInstanceTypeormEntity];
@Module({
	imports: [SharedModule, TypeOrmModule.forFeature(ENTITIES)],
	controllers: [],
	providers: [
		...RESOLVERS,
		...SERVICES,
		...QUERY_HANDLERS,
		...QUERY_HANDLERS_VIEW_MODELS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...REPOSITORIES,
		...FACTORIES,
		...MAPPERS,
	],
})
export class SagaInstanceModule {}
