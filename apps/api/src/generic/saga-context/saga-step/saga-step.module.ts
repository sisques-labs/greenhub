import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SagaStepChangeStatusCommandHandler } from "@/generic/saga-context/saga-step/application/commands/saga-step-change-status/saga-step-change-status.command-handler";
import { SagaStepCreateCommandHandler } from "@/generic/saga-context/saga-step/application/commands/saga-step-create/saga-step-create.command-handler";
import { SagaStepDeleteCommandHandler } from "@/generic/saga-context/saga-step/application/commands/saga-step-delete/saga-step-delete.command-handler";
import { SagaStepUpdateCommandHandler } from "@/generic/saga-context/saga-step/application/commands/saga-step-update/saga-step-update.command-handler";
import { SagaStepCreatedEventHandler } from "@/generic/saga-context/saga-step/application/event-handlers/saga-step-created/saga-step-created.event-handler";
import { SagaStepDeletedEventHandler } from "@/generic/saga-context/saga-step/application/event-handlers/saga-step-deleted/saga-step-deleted.event-handler";
import { SagaStepStatusChangedEventHandler } from "@/generic/saga-context/saga-step/application/event-handlers/saga-step-status-changed/saga-step-status-changed.event-handler";
import { SagaStepUpdatedEventHandler } from "@/generic/saga-context/saga-step/application/event-handlers/saga-step-updated/saga-step-updated.event-handler";
import { FindSagaStepsByCriteriaQueryHandler } from "@/generic/saga-context/saga-step/application/queries/saga-step-find-by-criteria/saga-step-find-by-criteria.query-handler";
import { FindSagaStepByIdQueryHandler } from "@/generic/saga-context/saga-step/application/queries/saga-step-find-by-id/saga-step-find-by-id.query-handler";
import { FindSagaStepsBySagaInstanceIdQueryHandler } from "@/generic/saga-context/saga-step/application/queries/saga-step-find-by-saga-instance-id/saga-step-find-by-saga-instance-id.query-handler";
import { FindSagaStepViewModelByIdQueryHandler } from "@/generic/saga-context/saga-step/application/queries/saga-step-find-view-model-by-id/saga-step-find-view-model-by-id.query-handler";
import { FindSagaStepViewModelsBySagaInstanceIdQueryHandler } from "@/generic/saga-context/saga-step/application/queries/saga-step-find-view-model-by-saga-instance-id/saga-step-find-view-model-by-saga-instance-id.query-handler";
import { AssertSagaStepExistsService } from "@/generic/saga-context/saga-step/application/services/assert-saga-step-exists/assert-saga-step-exists.service";
import { AssertSagaStepNotExistsService } from "@/generic/saga-context/saga-step/application/services/assert-saga-step-not-exists/assert-saga-step-not-exists.service";
import { AssertSagaStepViewModelExistsService } from "@/generic/saga-context/saga-step/application/services/assert-saga-step-view-model-exists/assert-saga-step-view-model-exists.service";
import { SagaStepAggregateFactory } from "@/generic/saga-context/saga-step/domain/factories/saga-step-aggregate/saga-step-aggregate.factory";
import { SagaStepViewModelFactory } from "@/generic/saga-context/saga-step/domain/factories/saga-step-view-model/saga-step-view-model.factory";
import { SAGA_STEP_READ_REPOSITORY_TOKEN } from "@/generic/saga-context/saga-step/domain/repositories/saga-step-read.repository";
import { SAGA_STEP_WRITE_REPOSITORY_TOKEN } from "@/generic/saga-context/saga-step/domain/repositories/saga-step-write.repository";
import { SagaStepMongoDBMapper } from "@/generic/saga-context/saga-step/infrastructure/database/mongodb/mappers/saga-step-mongodb.mapper";
import { SagaStepMongoRepository } from "@/generic/saga-context/saga-step/infrastructure/database/mongodb/repositories/saga-step-mongodb.repository";
import { SagaStepTypeormEntity } from "@/generic/saga-context/saga-step/infrastructure/database/typeorm/entities/saga-step-typeorm.entity";
import { SagaStepTypeormMapper } from "@/generic/saga-context/saga-step/infrastructure/database/typeorm/mappers/saga-step-typeorm.mapper";
import { SagaStepTypeormRepository } from "@/generic/saga-context/saga-step/infrastructure/database/typeorm/repositories/saga-step-typeorm.repository";
import { SagaStepGraphQLMapper } from "@/generic/saga-context/saga-step/transport/graphql/mappers/saga-step.mapper";
import { SagaStepMutationsResolver } from "@/generic/saga-context/saga-step/transport/graphql/resolvers/saga-step-mutations.resolver";
import { SagaStepQueryResolver } from "@/generic/saga-context/saga-step/transport/graphql/resolvers/saga-step-queries.resolver";
import { SharedModule } from "@/shared/shared.module";

const RESOLVERS = [SagaStepQueryResolver, SagaStepMutationsResolver];

const SERVICES = [
	AssertSagaStepExistsService,
	AssertSagaStepNotExistsService,
	AssertSagaStepViewModelExistsService,
];

const QUERY_HANDLERS = [
	FindSagaStepsByCriteriaQueryHandler,
	FindSagaStepByIdQueryHandler,
	FindSagaStepsBySagaInstanceIdQueryHandler,

	// View models
	FindSagaStepViewModelByIdQueryHandler,
	FindSagaStepViewModelsBySagaInstanceIdQueryHandler,
];

const COMMAND_HANDLERS = [
	SagaStepCreateCommandHandler,
	SagaStepUpdateCommandHandler,
	SagaStepDeleteCommandHandler,
	SagaStepChangeStatusCommandHandler,
];

const EVENT_HANDLERS = [
	SagaStepCreatedEventHandler,
	SagaStepUpdatedEventHandler,
	SagaStepDeletedEventHandler,
	SagaStepStatusChangedEventHandler,
];

const FACTORIES = [SagaStepAggregateFactory, SagaStepViewModelFactory];

const MAPPERS = [
	SagaStepTypeormMapper,
	SagaStepMongoDBMapper,
	SagaStepGraphQLMapper,
];

const REPOSITORIES = [
	{
		provide: SAGA_STEP_WRITE_REPOSITORY_TOKEN,
		useClass: SagaStepTypeormRepository,
	},
	{
		provide: SAGA_STEP_READ_REPOSITORY_TOKEN,
		useClass: SagaStepMongoRepository,
	},
];

const ENTITIES = [SagaStepTypeormEntity];

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
export class SagaStepModule {}
