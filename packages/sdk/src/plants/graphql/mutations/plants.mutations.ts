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
