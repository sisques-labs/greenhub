import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';

const SERVICES = [TypeormMasterService];
const SUBSCRIBERS = [];

@Global()
@Module({
	imports: [
		NestTypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				url: configService.get<string>('DATABASE_URL'),
				autoLoadEntities: true,
				synchronize: configService.get<string>('NODE_ENV') === 'development',
				logging: configService.get<string>('NODE_ENV') === 'development',
				subscribers: [...SUBSCRIBERS],
			}),
		}),
	],
	providers: [...SERVICES, ...SUBSCRIBERS],
	exports: [...SERVICES],
})
export class TypeOrmModule {}
