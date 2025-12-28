import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Data Transfer Object for container documents stored in MongoDB.
 *
 * @remarks
 * This DTO represents the structure of container documents in the MongoDB read database.
 * It matches the structure of ContainerPrimitives for consistency, but also includes
 * calculated fields like numberOfPlants and plants array for read optimization.
 */
export type ContainerMongoDbDto = BaseMongoDto & {
  name: string;
  type: string;
  numberOfPlants: number;
};
