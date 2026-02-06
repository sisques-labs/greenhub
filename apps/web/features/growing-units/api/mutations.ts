/**
 * Growing Units GraphQL Mutations
 * Used in API Routes (BFF layer) to communicate with backend
 */

export const GROWING_UNIT_CREATE_MUTATION = `
  mutation GrowingUnitCreate($input: GrowingUnitCreateRequestDto!) {
    growingUnitCreate(input: $input) {
      success
      message
      id
    }
  }
`;

export const GROWING_UNIT_UPDATE_MUTATION = `
  mutation GrowingUnitUpdate($input: GrowingUnitUpdateRequestDto!) {
    growingUnitUpdate(input: $input) {
      success
      message
      id
    }
  }
`;

export const GROWING_UNIT_DELETE_MUTATION = `
  mutation GrowingUnitDelete($input: GrowingUnitDeleteRequestDto!) {
    growingUnitDelete(input: $input) {
      success
      message
      id
    }
  }
`;
