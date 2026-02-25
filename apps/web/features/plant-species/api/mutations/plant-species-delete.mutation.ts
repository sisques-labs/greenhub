/**
 * Plant Species Delete Mutation
 * Used in API Routes (BFF layer) to communicate with backend
 */
export const PLANT_SPECIES_DELETE_MUTATION = `
  mutation PlantSpeciesDelete($input: PlantSpeciesDeleteRequestDto!) {
    plantSpeciesDelete(input: $input) {
      success
      message
      id
    }
  }
`;
