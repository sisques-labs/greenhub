import { ContainerCreateCommandHandler } from '@/core/plant-context/containers/application/commands/container-create/container-create.command-handler';
import { ContainerDeleteCommandHandler } from '@/core/plant-context/containers/application/commands/container-delete/container-delete.command-handler';
import { ContainerUpdateCommandHandler } from '@/core/plant-context/containers/application/commands/container-update/container-update.command-handler';
import { ContainerCreatedEventHandler } from '@/core/plant-context/containers/application/event-handlers/container-created/container-created.event-handler';
import { ContainerDeletedEventHandler } from '@/core/plant-context/containers/application/event-handlers/container-deleted/container-deleted.event-handler';
import { ContainerUpdatedEventHandler } from '@/core/plant-context/containers/application/event-handlers/container-updated/container-updated.event-handler';
import { PlantContainerChangedContainerEventHandler } from '@/core/plant-context/containers/application/event-handlers/plant-container-changed/plant-container-changed.event-handler';
import { PlantCreatedContainerEventHandler } from '@/core/plant-context/containers/application/event-handlers/plant-created/plant-created.event-handler';
import { PlantDeletedContainerEventHandler } from '@/core/plant-context/containers/application/event-handlers/plant-deleted/plant-deleted.event-handler';
import { PlantUpdatedContainerEventHandler } from '@/core/plant-context/containers/application/event-handlers/plant-updated/plant-updated.event-handler';
import { ContainerFindByIdQueryHandler } from '@/core/plant-context/containers/application/queries/container-find-by-id/container-find-by-id.query-handler';
import { ContainerViewModelFindByIdQueryHandler } from '@/core/plant-context/containers/application/queries/container-view-model-find-by-id/container-view-model-find-by-id.query-handler';
import { FindContainersByCriteriaQueryHandler } from '@/core/plant-context/containers/application/queries/find-containers-by-criteria/find-containers-by-criteria.query-handler';
import { AssertContainerExistsService } from '@/core/plant-context/containers/application/services/assert-container-exists/assert-container-exists.service';
import { AssertContainerViewModelExistsService } from '@/core/plant-context/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/core/plant-context/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerAggregateFactory } from '@/core/plant-context/containers/domain/factories/container-aggregate/container-aggregate.factory';
import { ContainerViewModelFactory } from '@/core/plant-context/containers/domain/factories/container-view-model/container-view-model.factory';
import { CONTAINER_READ_REPOSITORY_TOKEN } from '@/core/plant-context/containers/domain/repositories/container-read/container-read.repository';
import { CONTAINER_WRITE_REPOSITORY_TOKEN } from '@/core/plant-context/containers/domain/repositories/container-write/container-write.repository';
import { ContainerMongoDBMapper } from '@/core/plant-context/containers/infrastructure/database/mongodb/mappers/container-mongodb.mapper';
import { ContainerMongoRepository } from '@/core/plant-context/containers/infrastructure/database/mongodb/repositories/container-mongodb.repository';
import { ContainerTypeormEntity } from '@/core/plant-context/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { ContainerTypeormMapper } from '@/core/plant-context/containers/infrastructure/database/typeorm/mappers/container-typeorm.mapper';
import { ContainerTypeormRepository } from '@/core/plant-context/containers/infrastructure/database/typeorm/repositories/container-typeorm.repository';
import { ContainerGraphQLMapper } from '@/core/plant-context/containers/transport/graphql/mappers/container.mapper';
import { ContainerMutationsResolver } from '@/core/plant-context/containers/transport/graphql/resolvers/container-mutations/container-mutations.resolver';
import { ContainerQueriesResolver } from '@/core/plant-context/containers/transport/graphql/resolvers/container-queries/container-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const SERVICES = [
  AssertContainerExistsService,
  AssertContainerViewModelExistsService,
  ContainerObtainPlantsService,
];

const QUERY_HANDLERS = [
  ContainerFindByIdQueryHandler,
  ContainerViewModelFindByIdQueryHandler,
  FindContainersByCriteriaQueryHandler,
];

const COMMAND_HANDLERS = [
  ContainerCreateCommandHandler,
  ContainerUpdateCommandHandler,
  ContainerDeleteCommandHandler,
];

const EVENT_HANDLERS = [
  ContainerCreatedEventHandler,
  ContainerUpdatedEventHandler,
  ContainerDeletedEventHandler,
  PlantContainerChangedContainerEventHandler,
  PlantCreatedContainerEventHandler,
  PlantDeletedContainerEventHandler,
  PlantUpdatedContainerEventHandler,
];

const FACTORIES = [ContainerAggregateFactory, ContainerViewModelFactory];

const MAPPERS = [
  ContainerTypeormMapper,
  ContainerMongoDBMapper,
  ContainerGraphQLMapper,
];

const RESOLVERS = [ContainerQueriesResolver, ContainerMutationsResolver];

const REPOSITORIES = [
  {
    provide: CONTAINER_WRITE_REPOSITORY_TOKEN,
    useClass: ContainerTypeormRepository,
  },
  {
    provide: CONTAINER_READ_REPOSITORY_TOKEN,
    useClass: ContainerMongoRepository,
  },
];

const ENTITIES = [ContainerTypeormEntity];

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
export class ContainersModule {}
