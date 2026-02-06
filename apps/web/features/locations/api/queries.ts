/**
 * Locations GraphQL Queries
 */

export const LOCATION_FIND_BY_ID_QUERY = `
  query LocationFindById($input: LocationFindByIdRequestDto!) {
    locationFindById(input: $input) {
      id
      name
      type
      description
      createdAt
      updatedAt
    }
  }
`;

export const LOCATIONS_FIND_BY_CRITERIA_QUERY = `
  query LocationsFindByCriteria($input: LocationFindByCriteriaRequestDto) {
    locationsFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        name
        type
        description
        createdAt
        updatedAt
      }
    }
  }
`;
