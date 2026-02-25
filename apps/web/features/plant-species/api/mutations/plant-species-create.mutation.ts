/**
 * Plant Species Create Mutation
 * Used in API Routes (BFF layer) to communicate with backend
 */
export const PLANT_SPECIES_CREATE_MUTATION = `
  mutation PlantSpeciesCreate($input: PlantSpeciesCreateRequestDto!) {
    plantSpeciesCreate(input: $input) {
      success
      message
      id
    }
  }
`;
