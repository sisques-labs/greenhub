import { PlantChangeStatusCommandHandler } from '@/features/plants/application/commands/plant-change-status/plant-change-status.command-handler';
import { PlantCreateCommandHandler } from '@/features/plants/application/commands/plant-create/plant-create.command-handler';
import { PlantDeleteCommandHandler } from '@/features/plants/application/commands/plant-delete/plant-delete.command-handler';
import { PlantUpdateCommandHandler } from '@/features/plants/application/commands/plant-update/plant-update.command-handler';
import { PlantCreatedEventHandler } from '@/features/plants/application/event-handlers/plant-created/plant-created.event-handler';
import { PlantDeletedEventHandler } from '@/features/plants/application/event-handlers/plant-deleted/plant-deleted.event-handler';
import { PlantStatusChangedEventHandler } from '@/features/plants/application/event-handlers/plant-status-changed/plant-status-changed.event-handler';
import { PlantUpdatedEventHandler } from '@/features/plants/application/event-handlers/plant-updated/plant-updated.event-handler';
import { FindPlantsByCriteriaQueryHandler } from '@/features/plants/application/queries/find-plants-by-criteria/find-plants-by-criteria.query-handler';
import { FindPlantByIdQueryHandler } from '@/features/plants/application/queries/find-plant-by-id/find-plant-by-id.query-handler';
import { PlantViewModelFindByIdQueryHandler } from '@/features/plants/application/queries/plant-view-model-find-by-id/plant-view-model-find-by-id.query-handler';
import { AssertPlantExistsService } from '@/features/plants/application/services/assert-plant-exists/assert-plant-exists.service';
import { AssertPlantViewModelExistsService } from '@/features/plants/application/services/assert-plant-view-model-exists/assert-plant-view-model-exists.service';
import { PlantAggregateFactory } from '@/features/plants/domain/factories/plant-aggregate/plant-aggregate.factory';
import { PlantViewModelFactory } from '@/features/plants/domain/factories/plant-view-model/plant-view-model.factory';
import { PLANT_READ_REPOSITORY_TOKEN } from '@/features/plants/domain/repositories/plant-read/plant-read.repository';
import { PLANT_WRITE_REPOSITORY_TOKEN } from '@/features/plants/domain/repositories/plant-write/plant-write.repository';
import { PlantMongoDBMapper } from '@/features/plants/infrastructure/database/mongodb/mappers/plant-mongodb.mapper';
import { PlantMongoRepository } from '@/features/plants/infrastructure/database/mongodb/repositories/plant-mongodb.repository';
import { PlantTypeormEntity } from '@/features/plants/infrastructure/database/typeorm/entities/plant-typeorm.entity';
import { PlantTypeormMapper } from '@/features/plants/infrastructure/database/typeorm/mappers/plant-typeorm.mapper';
import { PlantTypeormRepository } from '@/features/plants/infrastructure/database/typeorm/repositories/plant-typeorm.repository';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const SERVICES = [AssertPlantExistsService, AssertPlantViewModelExistsService];

const QUERY_HANDLERS = [
  FindPlantsByCriteriaQueryHandler,
  FindPlantByIdQueryHandler,
  PlantViewModelFindByIdQueryHandler,
];

const COMMAND_HANDLERS = [
  PlantCreateCommandHandler,
  PlantUpdateCommandHandler,
  PlantDeleteCommandHandler,
  PlantChangeStatusCommandHandler,
];

const EVENT_HANDLERS = [
  PlantCreatedEventHandler,
  PlantUpdatedEventHandler,
  PlantDeletedEventHandler,
  PlantStatusChangedEventHandler,
];

const FACTORIES = [PlantAggregateFactory, PlantViewModelFactory];

const MAPPERS = [PlantTypeormMapper, PlantMongoDBMapper];

const REPOSITORIES = [
  {
    provide: PLANT_WRITE_REPOSITORY_TOKEN,
    useClass: PlantTypeormRepository,
  },
  {
    provide: PLANT_READ_REPOSITORY_TOKEN,
    useClass: PlantMongoRepository,
  },
];

const ENTITIES = [PlantTypeormEntity];

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
export class PlantsModule {}
