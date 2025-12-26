import { ContainerCreateCommandHandler } from '@/features/containers/application/commands/container-create/container-create.command-handler';
import { ContainerDeleteCommandHandler } from '@/features/containers/application/commands/container-delete/container-delete.command-handler';
import { ContainerUpdateCommandHandler } from '@/features/containers/application/commands/container-update/container-update.command-handler';
import { ContainerCreatedEventHandler } from '@/features/containers/application/event-handlers/container-created/container-created.event-handler';
import { ContainerDeletedEventHandler } from '@/features/containers/application/event-handlers/container-deleted/container-deleted.event-handler';
import { ContainerUpdatedEventHandler } from '@/features/containers/application/event-handlers/container-updated/container-updated.event-handler';
import { PlantContainerChangedContainerEventHandler } from '@/features/containers/application/event-handlers/plant-container-changed/plant-container-changed.event-handler';
import { PlantCreatedContainerEventHandler } from '@/features/containers/application/event-handlers/plant-created/plant-created.event-handler';
import { PlantDeletedContainerEventHandler } from '@/features/containers/application/event-handlers/plant-deleted/plant-deleted.event-handler';
import { PlantUpdatedContainerEventHandler } from '@/features/containers/application/event-handlers/plant-updated/plant-updated.event-handler';
import { ContainerFindByIdQueryHandler } from '@/features/containers/application/queries/container-find-by-id/container-find-by-id.query-handler';
import { ContainerViewModelFindByIdQueryHandler } from '@/features/containers/application/queries/container-view-model-find-by-id/container-view-model-find-by-id.query-handler';
import { FindContainersByCriteriaQueryHandler } from '@/features/containers/application/queries/find-containers-by-criteria/find-containers-by-criteria.query-handler';
import { AssertContainerExistsService } from '@/features/containers/application/services/assert-container-exists/assert-container-exists.service';
import { AssertContainerViewModelExistsService } from '@/features/containers/application/services/assert-container-view-model-exists/assert-container-view-model-exists.service';
import { ContainerObtainPlantsService } from '@/features/containers/application/services/container-obtain-plants/container-obtain-plants.service';
import { ContainerAggregateFactory } from '@/features/containers/domain/factories/container-aggregate/container-aggregate.factory';
import { ContainerViewModelFactory } from '@/features/containers/domain/factories/container-view-model/container-view-model.factory';
import { CONTAINER_READ_REPOSITORY_TOKEN } from '@/features/containers/domain/repositories/container-read/container-read.repository';
import { CONTAINER_WRITE_REPOSITORY_TOKEN } from '@/features/containers/domain/repositories/container-write/container-write.repository';
import { ContainerMongoDBMapper } from '@/features/containers/infrastructure/database/mongodb/mappers/container-mongodb.mapper';
import { ContainerMongoRepository } from '@/features/containers/infrastructure/database/mongodb/repositories/container-mongodb.repository';
import { ContainerTypeormEntity } from '@/features/containers/infrastructure/database/typeorm/entities/container-typeorm.entity';
import { ContainerTypeormMapper } from '@/features/containers/infrastructure/database/typeorm/mappers/container-typeorm.mapper';
import { ContainerTypeormRepository } from '@/features/containers/infrastructure/database/typeorm/repositories/container-typeorm.repository';
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

const MAPPERS = [ContainerTypeormMapper, ContainerMongoDBMapper];

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
