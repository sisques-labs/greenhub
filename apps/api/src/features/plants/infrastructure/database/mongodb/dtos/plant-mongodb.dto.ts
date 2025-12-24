import { BaseMongoWithTenantIdDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo-with-tenant-id.dto';

/**
 * Data Transfer Object for plant documents stored in MongoDB.
 *
 * @remarks
 * This DTO represents the structure of plant documents in the MongoDB read database.
 * It matches the structure of PlantPrimitives for consistency.
 */
export type PlantMongoDbDto = BaseMongoWithTenantIdDto & {
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
};
