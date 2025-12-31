import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserDeleteCommandHandler } from "@/generic/users/application/commands/delete-user/delete-user.command-handler";
import { UserCreateCommandHandler } from "@/generic/users/application/commands/user-create/user-create.command-handler";
import { UserUpdateCommandHandler } from "@/generic/users/application/commands/user-update/user-update.command-handler";
import { UserCreatedEventHandler } from "@/generic/users/application/event-handlers/user-created/user-created.event-handler";
import { UserDeletedEventHandler } from "@/generic/users/application/event-handlers/user-deleted/user-deleted.event-handler";
import { UserUpdatedEventHandler } from "@/generic/users/application/event-handlers/user-updated/user-updated.event-handler";
import { FindUsersByCriteriaQueryHandler } from "@/generic/users/application/queries/find-users-by-criteria/find-users-by-criteria.query-handler";
import { UserFindByIdQueryHandler } from "@/generic/users/application/queries/user-find-by-id/user-find-by-id.query-handler";
import { UserViewModelFindByIdQueryHandler } from "@/generic/users/application/queries/user-view-model-find-by-id/user-view-model-find-by-id.query-handler";
import { AssertUserExsistsService } from "@/generic/users/application/services/assert-user-exsits/assert-user-exsits.service";
import { AssertUserUsernameIsUniqueService } from "@/generic/users/application/services/assert-user-username-is-unique/assert-user-username-is-unique.service";
import { AssertUserViewModelExsistsService } from "@/generic/users/application/services/assert-user-view-model-exsits/assert-user-view-model-exsits.service";
import { UserAggregateFactory } from "@/generic/users/domain/factories/user-aggregate/user-aggregate.factory";
import { UserViewModelFactory } from "@/generic/users/domain/factories/user-view-model/user-view-model.factory";
import { USER_READ_REPOSITORY_TOKEN } from "@/generic/users/domain/repositories/user-read.repository";
import { USER_WRITE_REPOSITORY_TOKEN } from "@/generic/users/domain/repositories/user-write.repository";
import { UserMongoDBMapper } from "@/generic/users/infrastructure/database/mongodb/mappers/user-mongodb.mapper";
import { UserMongoRepository } from "@/generic/users/infrastructure/database/mongodb/repositories/user-mongodb.repository";
import { UserTypeormEntity } from "@/generic/users/infrastructure/database/typeorm/entities/user-typeorm.entity";
import { UserTypeOrmMapper } from "@/generic/users/infrastructure/database/typeorm/mappers/user-typeorm.mapper";
import { UserTypeormRepository } from "@/generic/users/infrastructure/database/typeorm/repositories/user-typeorm.repository";
import { UserGraphQLMapper } from "@/generic/users/transport/graphql/mappers/user.mapper";
import { UserMutationsResolver } from "@/generic/users/transport/graphql/resolvers/user-mutations.resolver";
import { UserQueryResolver } from "@/generic/users/transport/graphql/resolvers/user-queries.resolver";
import { SharedModule } from "@/shared/shared.module";

const RESOLVERS = [UserQueryResolver, UserMutationsResolver];

const SERVICES = [
	AssertUserExsistsService,
	AssertUserUsernameIsUniqueService,
	AssertUserViewModelExsistsService,
];

const QUERY_HANDLERS = [
	FindUsersByCriteriaQueryHandler,
	UserFindByIdQueryHandler,
	UserViewModelFindByIdQueryHandler,
];

const COMMAND_HANDLERS = [
	UserCreateCommandHandler,
	UserUpdateCommandHandler,
	UserDeleteCommandHandler,
];

const EVENT_HANDLERS = [
	UserCreatedEventHandler,
	UserUpdatedEventHandler,
	UserDeletedEventHandler,
];

const FACTORIES = [UserAggregateFactory, UserViewModelFactory];

const MAPPERS = [UserTypeOrmMapper, UserMongoDBMapper, UserGraphQLMapper];

const REPOSITORIES = [
	{
		provide: USER_WRITE_REPOSITORY_TOKEN,
		useClass: UserTypeormRepository,
	},
	{
		provide: USER_READ_REPOSITORY_TOKEN,
		useClass: UserMongoRepository,
	},
];

const ENTITIES = [UserTypeormEntity];

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
export class UserModule {}
