import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

export type LocationMongoDbDto = BaseMongoDto & {
	name: string;
	type: string;
	description: string | null;
};
