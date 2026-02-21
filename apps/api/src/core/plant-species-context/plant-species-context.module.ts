import { PlantSpeciesCreateCommandHandler } from '@/core/plant-species-context/application/commands/plant-species/plant-species-create/plant-species-create.command-handler';
import { PlantSpeciesDeleteCommandHandler } from '@/core/plant-species-context/application/commands/plant-species/plant-species-delete/plant-species-delete.command-handler';
import { PlantSpeciesUpdateCommandHandler } from '@/core/plant-species-context/application/commands/plant-species/plant-species-update/plant-species-update.command-handler';
import { PlantSpeciesFindByCriteriaQueryHandler } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-criteria/plant-species-find-by-criteria.query-handler';
import { PlantSpeciesFindByIdQueryHandler } from '@/core/plant-species-context/application/queries/plant-species/plant-species-find-by-id/plant-species-find-by-id.query-handler';
import { AssertPlantSpeciesExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-exists/assert-plant-species-exists.service';
import { AssertPlantSpeciesViewModelExistsService } from '@/core/plant-species-context/application/services/plant-species/assert-plant-species-view-model-exists/assert-plant-species-view-model-exists.service';
import { PlantSpeciesAggregateBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-aggregate.builder';
import { PlantSpeciesViewModelBuilder } from '@/core/plant-species-context/domain/builders/plant-species/plant-species-view-model.builder';
import { PLANT_SPECIES_READ_REPOSITORY_TOKEN } from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-read/plant-species-read.repository';
import { PLANT_SPECIES_WRITE_REPOSITORY_TOKEN } from '@/core/plant-species-context/domain/repositories/plant-species/plant-species-write/plant-species-write.repository';
import { PlantSpeciesCreatedEventHandler } from '@/core/plant-species-context/infrastructure/event-handlers/plant-species/plant-species-created/plant-species-created.event-handler';
import { PlantSpeciesDeletedEventHandler } from '@/core/plant-species-context/infrastructure/event-handlers/plant-species/plant-species-deleted/plant-species-deleted.event-handler';
import { PlantSpeciesUpdatedEventHandler } from '@/core/plant-species-context/infrastructure/event-handlers/plant-species/plant-species-updated/plant-species-updated.event-handler';
import { PlantSpeciesMongoDBMapper } from '@/core/plant-species-context/infrastructure/database/mongodb/mappers/plant-species/plant-species-mongodb.mapper';
import { PlantSpeciesMongoRepository } from '@/core/plant-species-context/infrastructure/database/mongodb/repositories/plant-species/plant-species-mongodb.repository';
import { PlantSpeciesTypeormEntity } from '@/core/plant-species-context/infrastructure/database/typeorm/entities/plant-species-typeorm.entity';
import { PlantSpeciesTypeormMapper } from '@/core/plant-species-context/infrastructure/database/typeorm/mappers/plant-species/plant-species-typeorm.mapper';
import { PlantSpeciesTypeormRepository } from '@/core/plant-species-context/infrastructure/database/typeorm/repositories/plant-species/plant-species-typeorm.repository';
import '@/core/plant-species-context/transport/graphql/enums/plant-species/plant-species-registered-enums.graphql';
import { PlantSpeciesGraphQLMapper } from '@/core/plant-species-context/transport/graphql/mappers/plant-species/plant-species.mapper';
import { PlantSpeciesMutationsResolver } from '@/core/plant-species-context/transport/graphql/resolvers/plant-species/plant-species-mutations.resolver';
import { PlantSpeciesQueriesResolver } from '@/core/plant-species-context/transport/graphql/resolvers/plant-species/plant-species-queries.resolver';
import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

const RESOLVERS = [PlantSpeciesMutationsResolver, PlantSpeciesQueriesResolver];

const APPLICATION_SERVICES = [
	AssertPlantSpeciesExistsService,
	AssertPlantSpeciesViewModelExistsService,
];

const QUERY_HANDLERS = [
	PlantSpeciesFindByIdQueryHandler,
	PlantSpeciesFindByCriteriaQueryHandler,
];

const COMMAND_HANDLERS = [
	PlantSpeciesCreateCommandHandler,
	PlantSpeciesUpdateCommandHandler,
	PlantSpeciesDeleteCommandHandler,
];

const EVENT_HANDLERS = [
	PlantSpeciesCreatedEventHandler,
	PlantSpeciesUpdatedEventHandler,
	PlantSpeciesDeletedEventHandler,
];

const BUILDERS = [PlantSpeciesAggregateBuilder, PlantSpeciesViewModelBuilder];

const MAPPERS = [
	PlantSpeciesTypeormMapper,
	PlantSpeciesMongoDBMapper,
	PlantSpeciesGraphQLMapper,
];

const REPOSITORIES = [
	{
		provide: PLANT_SPECIES_WRITE_REPOSITORY_TOKEN,
		useClass: PlantSpeciesTypeormRepository,
	},
	{
		provide: PLANT_SPECIES_READ_REPOSITORY_TOKEN,
		useClass: PlantSpeciesMongoRepository,
	},
];

const ENTITIES = [PlantSpeciesTypeormEntity];

@Module({
	imports: [SharedModule, TypeOrmModule.forFeature(ENTITIES)],
	controllers: [],
	providers: [
		...RESOLVERS,
		...APPLICATION_SERVICES,
		...QUERY_HANDLERS,
		...COMMAND_HANDLERS,
		...EVENT_HANDLERS,
		...REPOSITORIES,
		...BUILDERS,
		...MAPPERS,
	],
})
export class PlantSpeciesContextModule {}
