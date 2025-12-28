export const CONTAINER_FIND_BY_CRITERIA_QUERY = `
  query ContainersFindByCriteria($input: ContainerFindByCriteriaRequestDto) {
    containersFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        name
        type
        plants {
          id
          name
          species
          plantedDate
          notes
          status
          createdAt
          updatedAt
        }
        numberOfPlants
        createdAt
        updatedAt
      }
    }
  }
`;

export const CONTAINER_FIND_BY_ID_QUERY = `
  query ContainerFindById($input: ContainerFindByIdRequestDto!) {
    containerFindById(input: $input) {
      id
      name
      type
      plants {
        id
        name
        species
        plantedDate
        notes
        status
        createdAt
        updatedAt
      }
      numberOfPlants
      createdAt
      updatedAt
    }
  }
`;
