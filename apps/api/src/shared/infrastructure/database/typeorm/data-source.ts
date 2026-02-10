import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

/**
 * TypeORM DataSource used by the CLI for migrations (generate, run, revert, show).
 * The NestJS app uses TypeOrmModule.forRootAsync() in typeorm.module.ts instead.
 *
 * @see https://typeorm.io/migrations#using-cli
 */
export const dataSourceOptions: DataSourceOptions = {
	// @ts-expect-error // TypeORM expects predefined strings for type
	type: configService.getOrThrow<string>('DATABASE_DRIVER'),
	host: configService.getOrThrow<string>('DATABASE_HOST'),
	port: configService.getOrThrow<number>('DATABASE_PORT'),
	username: configService.getOrThrow<string>('DATABASE_USERNAME'),
	password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
	database: configService.getOrThrow<string>('DATABASE_DATABASE'),
	entities: [__dirname + '/../../../../**/*-typeorm.entity{.ts,.js}'],
	migrations: [__dirname + '/../../../../migrations/*{.ts,.js}'],
	migrationsTableName:
		configService.getOrThrow<string>('DATABASE_MIGRATIONS_TABLE_NAME') ||
		'migrations',
	migrationsRun: false,
	synchronize: configService.getOrThrow<string>('NODE_ENV') !== 'production',
	logging: configService.getOrThrow<string>('NODE_ENV') !== 'production',
	extra: {
		connectionLimit: 10, // Adjust based on your database connection pool requirements
	},
};

export const dataSource = new DataSource(dataSourceOptions);
