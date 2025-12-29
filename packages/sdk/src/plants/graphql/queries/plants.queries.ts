export const PLANT_FIND_BY_ID_QUERY = `
  query PlantFindById($input: PlantFindByIdRequestDto!) {
    plantFindById(input: $input) {
      id
      growingUnitId
      name
      species
      plantedDate
      notes
      status
      createdAt
      updatedAt
    }
  }
`;
