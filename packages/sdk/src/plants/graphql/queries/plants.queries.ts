export const PLANT_FIND_BY_CRITERIA_QUERY = `
  query PlantsFindByCriteria($input: PlantFindByCriteriaRequestDto) {
    plantsFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        containerId
        name
        species
        plantedDate
        notes
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const PLANT_FIND_BY_ID_QUERY = `
  query PlantFindById($input: PlantFindByIdRequestDto!) {
    plantFindById(input: $input) {
      id
      containerId
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
