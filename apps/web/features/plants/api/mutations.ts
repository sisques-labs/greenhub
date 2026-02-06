/**
 * Plants GraphQL Mutations
 * Used in API Routes (BFF layer) to communicate with backend
 */

export const PLANT_ADD_MUTATION = `
  mutation PlantAdd($input: PlantAddRequestDto!) {
    plantAdd(input: $input) {
      success
      message
      id
    }
  }
`;

export const PLANT_UPDATE_MUTATION = `
  mutation PlantUpdate($input: PlantUpdateRequestDto!) {
    plantUpdate(input: $input) {
      success
      message
      id
    }
  }
`;

export const PLANT_TRANSPLANT_MUTATION = `
  mutation PlantTransplant($input: PlantTransplantRequestDto!) {
    plantTransplant(input: $input) {
      success
      message
      id
    }
  }
`;
