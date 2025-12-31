import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SagaLogCreateCommandHandler } from "@/generic/saga-context/saga-log/application/commands/saga-log-create/saga-log-create.command-handler";
import { SagaLogDeleteCommandHandler } from "@/generic/saga-context/saga-log/application/commands/saga-log-delete/saga-log-delete.command-handler";
import { SagaLogUpdateCommandHandler } from "@/generic/saga-context/saga-log/application/commands/saga-log-update/saga-log-update.command-handler";
import { SagaInstanceCreatedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-instance-created/saga-instance-created.event-handler";
import { SagaInstanceDeletedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-instance-deleted/saga-instance-deleted.event-handler";
import { SagaInstanceStatusChangedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-instance-status-changed/saga-instance-status-changed.event-handler";
import { SagaInstanceUpdatedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-instance-updated/saga-instance-updated.event-handler";
import { SagaLogCreatedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-log-created/saga-log-created.event-handler";
import { SagaLogDeletedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-log-deleted/saga-log-deleted.event-handler";
import { SagaLogUpdatedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-log-updated/saga-log-updated.event-handler";
import { SagaStepCreatedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-step-created/saga-step-created.event-handler";
import { SagaStepDeletedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-step-deleted/saga-step-deleted.event-handler";
import { SagaStepStatusChangedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-step-status-changed/saga-step-status-changed.event-handler";
import { SagaStepUpdatedEventHandler } from "@/generic/saga-context/saga-log/application/event-handlers/saga-step-updated/saga-step-updated.event-handler";
import { FindSagaLogsByCriteriaQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-by-criteria/saga-log-find-by-criteria.query-handler";
import { FindSagaLogByIdQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-by-id/saga-log-find-by-id.query-handler";
import { FindSagaLogsBySagaInstanceIdQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-by-saga-instance-id/saga-log-find-by-saga-instance-id.query-handler";
import { FindSagaLogsBySagaStepIdQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-by-saga-step-id/saga-log-find-by-saga-step-id.query-handler";
import { FindSagaLogViewModelByIdQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-view-model-by-id/saga-log-find-view-model-by-id.query-handler";
import { FindSagaLogViewModelsBySagaInstanceIdQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-instance-id/saga-log-find-view-model-by-saga-instance-id.query-handler";
import { FindSagaLogViewModelsBySagaStepIdQueryHandler } from "@/generic/saga-context/saga-log/application/queries/saga-log-find-view-model-by-saga-step-id/saga-log-find-view-model-by-saga-step-id.query-handler";
import { AssertSagaLogExistsService } from "@/generic/saga-context/saga-log/application/services/assert-saga-log-exists/assert-saga-log-exists.service";
import { AssertSagaLogNotExistsService } from "@/generic/saga-context/saga-log/application/services/assert-saga-log-not-exists/assert-saga-log-not-exists.service";
import { AssertSagaLogViewModelExistsService } from "@/generic/saga-context/saga-log/application/services/assert-saga-log-view-model-exists/assert-saga-log-view-model-exists.service";
import { SagaLogAggregateFactory } from "@/generic/saga-context/saga-log/domain/factories/saga-log-aggregate/saga-log-aggregate.factory";
import { SagaLogViewModelFactory } from "@/generic/saga-context/saga-log/domain/factories/saga-log-view-model/saga-log-view-model.factory";
import { SAGA_LOG_READ_REPOSITORY_TOKEN } from "@/generic/saga-context/saga-log/domain/repositories/saga-log-read.repository";
import { SAGA_LOG_WRITE_REPOSITORY_TOKEN } from "@/generic/saga-context/saga-log/domain/repositories/saga-log-write.repository";
import { SagaLogMongoDBMapper } from "@/generic/saga-context/saga-log/infrastructure/database/mongodb/mappers/saga-log-mongodb.mapper";
import { SagaLogMongoRepository } from "@/generic/saga-context/saga-log/infrastructure/database/mongodb/repositories/saga-log-mongodb.repository";
import { SagaLogTypeormEntity } from "@/generic/saga-context/saga-log/infrastructure/database/typeorm/entities/saga-log-typeorm.entity";
import { SagaLogTypeormMapper } from "@/generic/saga-context/saga-log/infrastructure/database/typeorm/mappers/saga-log-typeorm.mapper";
import { SagaLogTypeormRepository } from "@/generic/saga-context/saga-log/infrastructure/database/typeorm/repositories/saga-log-typeorm.repository";
import { SagaLogGraphQLMapper } from "@/generic/saga-context/saga-log/transport/graphql/mappers/saga-log.mapper";
import { SagaLogMutationsResolver } from "@/generic/saga-context/saga-log/transport/graphql/resolvers/saga-log-mutations.resolver";
import { SagaLogQueryResolver } from "@/generic/saga-context/saga-log/transport/graphql/resolvers/saga-log-queries.resolver";
import { SharedModule } from "@/shared/shared.module";

const RESOLVERS = [SagaLogQueryResolver, SagaLogMutationsResolver];

const SERVICES = [
	AssertSagaLogExistsService,
	AssertSagaLogNotExistsService,
	AssertSagaLogViewModelExistsService,
];

const QUERY_HANDLERS = [
	FindSagaLogsByCriteriaQueryHandler,
	FindSagaLogByIdQueryHandler,
	FindSagaLogsBySagaInstanceIdQueryHandler,
	FindSagaLogsBySagaStepIdQueryHandler,

	// View models
	FindSagaLogViewModelByIdQueryHandler,
	FindSagaLogViewModelsBySagaInstanceIdQueryHandler,
	FindSagaLogViewModelsBySagaStepIdQueryHandler,
];

const COMMAND_HANDLERS = [
	SagaLogCreateCommandHandler,
	SagaLogUpdateCommandHandler,
	SagaLogDeleteCommandHandler,
];

const EVENT_HANDLERS = [
	// Saga log events
	SagaLogCreatedEventHandler,
	SagaLogUpdatedEventHandler,
	SagaLogDeletedEventHandler,

	// Saga instance events
	SagaInstanceCreatedEventHandler,
	SagaInstanceUpdatedEventHandler,
	SagaInstanceDeletedEventHandler,
	SagaInstanceStatusChangedEventHandler,

	// Saga step events
	SagaStepCreatedEventHandler,
	SagaStepUpdatedEventHandler,
	SagaStepDeletedEventHandler,
	SagaStepStatusChangedEventHandler,
];

const FACTORIES = [SagaLogAggregateFactory, SagaLogViewModelFactory];

const MAPPERS = [
	SagaLogTypeormMapper,
	SagaLogMongoDBMapper,
	SagaLogGraphQLMapper,
];

const REPOSITORIES = [
	{
		provide: SAGA_LOG_WRITE_REPOSITORY_TOKEN,
		useClass: SagaLogTypeormRepository,
	},
	{
		provide: SAGA_LOG_READ_REPOSITORY_TOKEN,
		useClass: SagaLogMongoRepository,
	},
];

const ENTITIES = [SagaLogTypeormEntity];

@Module({
	imports: [SharedModule, TypeOrmModule.forFeature(ENTITIES)],
	controllers: [],
	providers: [
		...RESOLVERS,
		...SERVICES,
		...QUERY_HANDLERS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...REPOSITORIES,
		...FACTORIES,
		...MAPPERS,
	],
})
export class SagaLogModule {}
