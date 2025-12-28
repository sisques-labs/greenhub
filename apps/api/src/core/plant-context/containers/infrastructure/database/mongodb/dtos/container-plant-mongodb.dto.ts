import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for container plant documents stored in MongoDB.
 *
 * @remarks
 * This DTO represents the structure of container plant documents within container documents
 * in the MongoDB read database. It matches the structure of ContainerPlantViewModel for consistency.
 */
export type ContainerPlantMongoDbDto = BaseMongoDto & {
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
};
