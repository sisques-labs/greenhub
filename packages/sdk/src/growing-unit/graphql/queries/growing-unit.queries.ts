export const GROWING_UNIT_FIND_BY_ID_QUERY = `
  query GrowingUnitFindById($input: GrowingUnitFindByIdRequestDto!) {
    growingUnitFindById(input: $input) {
      id
      name
      type
      capacity
      dimensions {
        length
        width
        height
        unit
      }
      plants {
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
      numberOfPlants
      remainingCapacity
      volume
      createdAt
      updatedAt
    }
  }
`;

export const GROWING_UNITS_FIND_BY_CRITERIA_QUERY = `
  query GrowingUnitsFindByCriteria($input: GrowingUnitFindByCriteriaRequestDto) {
    growingUnitsFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        name
        type
        capacity
        dimensions {
          length
          width
          height
          unit
        }
        plants {
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
        numberOfPlants
        remainingCapacity
        volume
        createdAt
        updatedAt
      }
    }
  }
`;


