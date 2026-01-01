export const LOCATION_CREATE_MUTATION = `
  mutation CreateLocation($input: LocationCreateRequestDto!) {
    createLocation(input: $input) {
      success
      message
      id
    }
  }
`;

export const LOCATION_UPDATE_MUTATION = `
  mutation UpdateLocation($input: LocationUpdateRequestDto!) {
    updateLocation(input: $input) {
      success
      message
      id
    }
  }
`;

export const LOCATION_DELETE_MUTATION = `
  mutation DeleteLocation($input: LocationDeleteRequestDto!) {
    deleteLocation(input: $input) {
      success
      message
      id
    }
  }
`;

