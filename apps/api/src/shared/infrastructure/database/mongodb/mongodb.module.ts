import { Global, Module } from '@nestjs/common';

import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

const SERVICES = [MongoMasterService];

@Global()
@Module({
	providers: [...SERVICES],
	exports: [...SERVICES],
})
export class MongoModule {}
