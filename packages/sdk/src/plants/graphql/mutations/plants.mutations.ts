export const PLANT_CREATE_MUTATION = `
  mutation CreatePlant($input: CreatePlantRequestDto!) {
    createPlant(input: $input) {
      success
      message
      id
    }
  }
`;

export const PLANT_UPDATE_MUTATION = `
  mutation UpdatePlant($input: UpdatePlantRequestDto!) {
    updatePlant(input: $input) {
      success
      message
      id
    }
  }
`;

export const PLANT_DELETE_MUTATION = `
  mutation DeletePlant($input: DeletePlantRequestDto!) {
    deletePlant(input: $input) {
      success
      message
      id
    }
  }
`;

export const PLANT_CHANGE_STATUS_MUTATION = `
  mutation ChangePlantStatus($input: ChangePlantStatusRequestDto!) {
    changePlantStatus(input: $input) {
      success
      message
      id
    }
  }
`;
