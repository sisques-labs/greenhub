/**
 * Represents a simplified growing unit reference for plant responses.
 * Contains only basic information without the plants array to avoid circular references.
 */
export type PlantGrowingUnitReference = {
  id: string;
  name: string;
  type: string;
  capacity: number;
};
