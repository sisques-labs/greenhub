/**
 * Plant Species Update Mutation
 * Used in API Routes (BFF layer) to communicate with backend
 */
export const PLANT_SPECIES_UPDATE_MUTATION = `
  mutation PlantSpeciesUpdate($input: PlantSpeciesUpdateRequestDto!) {
    plantSpeciesUpdate(input: $input) {
      success
      message
      id
    }
  }
`;
