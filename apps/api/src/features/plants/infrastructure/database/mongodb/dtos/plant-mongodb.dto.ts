/**
 * Data Transfer Object for plant documents stored in MongoDB.
 *
 * @remarks
 * This DTO represents the structure of plant documents in the MongoDB read database.
 * It matches the structure of PlantPrimitives for consistency.
 */
export type PlantMongoDbDto = {
  id: string;
  name: string;
  species: string;
  plantedDate: Date | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
