import { dataSourceOptions } from '@/shared/infrastructure/database/typeorm/data-source';
import { TypeormMasterService } from '@/shared/infrastructure/database/typeorm/services/typeorm-master/typeorm-master.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

const SERVICES = [TypeormMasterService];
const SUBSCRIBERS = [];

@Global()
@Module({
	imports: [NestTypeOrmModule.forRoot(dataSourceOptions)],
	providers: [...SERVICES, ...SUBSCRIBERS],
	exports: [...SERVICES],
})
export class TypeOrmModule {}
