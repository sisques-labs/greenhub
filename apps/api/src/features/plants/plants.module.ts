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
import { Module } from '@nestjs/common';

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

@Module({
  imports: [],
  controllers: [],
  providers: [
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...FACTORIES,
  ],
})
export class PlantsModule {}
