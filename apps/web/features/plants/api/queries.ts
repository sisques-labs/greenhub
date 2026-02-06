/**
 * Plants GraphQL Queries
 * Used in API Routes (BFF layer) to communicate with backend
 */

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
      location {
        id
        name
        type
        description
        createdAt
        updatedAt
      }
      growingUnit {
        id
        name
        type
        capacity
      }
      createdAt
      updatedAt
    }
  }
`;

export const PLANTS_FIND_BY_CRITERIA_QUERY = `
  query PlantsFindByCriteria($input: PlantFindByCriteriaRequestDto) {
    plantsFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        growingUnitId
        name
        species
        plantedDate
        notes
        status
        location {
          id
          name
          type
          description
          createdAt
          updatedAt
        }
        growingUnit {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;
