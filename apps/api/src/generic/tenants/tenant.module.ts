import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantCreateCommandHandler } from '@/generic/tenants/application/commands/tenant-create/tenant-create.command-handler';
import { TenantDeleteCommandHandler } from '@/generic/tenants/application/commands/tenant-delete/tenant-delete.command-handler';
import { TenantUpdateCommandHandler } from '@/generic/tenants/application/commands/tenant-update/tenant-update.command-handler';
import { TenantCreatedEventHandler } from '@/generic/tenants/application/event-handlers/tenant-created/tenant-created.event-handler';
import { TenantDeletedEventHandler } from '@/generic/tenants/application/event-handlers/tenant-deleted/tenant-deleted.event-handler';
import { TenantUpdatedEventHandler } from '@/generic/tenants/application/event-handlers/tenant-updated/tenant-updated.event-handler';
import { FindTenantsByCriteriaQueryHandler } from '@/generic/tenants/application/queries/find-tenants-by-criteria/find-tenants-by-criteria.query-handler';
import { TenantEnsureExistsQueryHandler } from '@/generic/tenants/application/queries/tenant-ensure-exists/tenant-ensure-exists.query-handler';
import { TenantFindByIdQueryHandler } from '@/generic/tenants/application/queries/tenant-find-by-id/tenant-find-by-id.query-handler';
import { TenantViewModelFindByIdQueryHandler } from '@/generic/tenants/application/queries/tenant-view-model-find-by-id/tenant-view-model-find-by-id.query-handler';
import { AssertTenantExistsService } from '@/generic/tenants/application/services/assert-tenant-exists/assert-tenant-exists.service';
import { AssertTenantViewModelExistsService } from '@/generic/tenants/application/services/assert-tenant-view-model-exists/assert-tenant-view-model-exists.service';
import { TenantAggregateFactory } from '@/generic/tenants/domain/factories/aggregates/tenant-aggregate/tenant-aggregate.factory';
import { TenantViewModelBuilder } from '@/generic/tenants/domain/builders/tenant-view-model/tenant-view-model.builder';
import {
	TENANT_READ_REPOSITORY_TOKEN,
	ITenantReadRepository,
} from '@/generic/tenants/domain/repositories/tenant-read/tenant-read.repository';
import {
	TENANT_WRITE_REPOSITORY_TOKEN,
	ITenantWriteRepository,
} from '@/generic/tenants/domain/repositories/tenant-write/tenant-write.repository';
import { TenantMongoDBMapper } from '@/generic/tenants/infrastructure/database/mongodb/mappers/tenant-mongodb.mapper';
import { TenantMongoRepository } from '@/generic/tenants/infrastructure/database/mongodb/repositories/tenant-mongodb.repository';
import { TenantTypeormEntity } from '@/generic/tenants/infrastructure/database/typeorm/entities/tenant-typeorm.entity';
import { TenantTypeormMapper } from '@/generic/tenants/infrastructure/database/typeorm/mappers/tenant-typeorm.mapper';
import { TenantTypeormRepository } from '@/generic/tenants/infrastructure/database/typeorm/repositories/tenant-typeorm.repository';
import { TenantGraphQLMapper } from '@/generic/tenants/transport/graphql/mappers/tenant.mapper';
import { TenantMutationsResolver } from '@/generic/tenants/transport/graphql/resolvers/tenant-mutations.resolver';
import { TenantQueriesResolver } from '@/generic/tenants/transport/graphql/resolvers/tenant-queries.resolver';
import '@/generic/tenants/transport/graphql/enums/tenant-registered-enums.graphql';
import { SharedModule } from '@/shared/shared.module';

const RESOLVERS = [TenantQueriesResolver, TenantMutationsResolver];

const SERVICES = [
	AssertTenantExistsService,
	AssertTenantViewModelExistsService,
];

const QUERY_HANDLERS = [
	FindTenantsByCriteriaQueryHandler,
	TenantEnsureExistsQueryHandler,
	TenantFindByIdQueryHandler,
	TenantViewModelFindByIdQueryHandler,
];

const COMMAND_HANDLERS = [
	TenantCreateCommandHandler,
	TenantUpdateCommandHandler,
	TenantDeleteCommandHandler,
];

const EVENT_HANDLERS = [
	TenantCreatedEventHandler,
	TenantUpdatedEventHandler,
	TenantDeletedEventHandler,
];

const FACTORIES = [TenantAggregateFactory, TenantViewModelBuilder];

const MAPPERS = [TenantTypeormMapper, TenantMongoDBMapper, TenantGraphQLMapper];

const REPOSITORIES = [
	{
		provide: TENANT_WRITE_REPOSITORY_TOKEN,
		useClass: TenantTypeormRepository,
	},
	{
		provide: TENANT_READ_REPOSITORY_TOKEN,
		useClass: TenantMongoRepository,
	},
];

const ENTITIES = [TenantTypeormEntity];

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
	exports: [...SERVICES],
})
export class TenantModule {}

