import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AppResolver } from '@/app.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { CoreModule } from '@/core/core.module';
import { GenericModule } from '@/generic/generic.module';
import { SharedModule } from '@/shared/shared.module';
import '@/shared/transport/graphql/registered-enums/registered-enums.graphql';
import { SupportModule } from '@/support/generic.module';

const MODULES = [CoreModule, SharedModule, SupportModule, GenericModule];

@Module({
	imports: [
		CqrsModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			playground: true,
			introspection: true,
			context: ({ req }) => ({ req }),
		}),
		...MODULES,
	],
	providers: [AppResolver],
})
export class AppModule {}
