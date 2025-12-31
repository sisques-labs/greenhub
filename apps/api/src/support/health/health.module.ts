import { Module } from "@nestjs/common";
import { SharedModule } from "@/shared/shared.module";
import { HealthCheckQueryHandler } from "@/support/health/application/queries/health-check/health-check.query-handler";
import { HealthCheckService } from "@/support/health/application/services/health-check/health-check.service";
import { HealthReadDatabaseCheckService } from "@/support/health/application/services/health-read-database-check/health-read-database-check.service";
import { HealthWriteDatabaseCheckService } from "@/support/health/application/services/health-write-database-check/health-write-database-check.service";
import { HealthViewModelFactory } from "@/support/health/domain/factories/health-view-model.factory";
import { HealthGraphQLMapper } from "@/support/health/transport/graphql/mappers/health.mapper";
import { HealthQueryResolver } from "@/support/health/transport/graphql/resolvers/health-queries.resolver";
import { HealthController } from "@/support/health/transport/rest/controllers/health.controller";
import { HealthRestMapper } from "@/support/health/transport/rest/mappers/health-rest.mapper";

const RESOLVERS = [HealthQueryResolver];

const SERVICES = [
	HealthCheckService,
	HealthWriteDatabaseCheckService,
	HealthReadDatabaseCheckService,
];

const QUERY_HANDLERS = [HealthCheckQueryHandler];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [HealthViewModelFactory];

const MAPPERS = [HealthGraphQLMapper, HealthRestMapper];

const REPOSITORIES = [];

const CONTROLLERS = [HealthController];

@Module({
	imports: [SharedModule],
	controllers: [...CONTROLLERS],
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
export class HealthModule {}
