/**
 * Plant Species Find By Difficulty Query
 * Returns plant species filtered by difficulty level with optional pagination.
 * Used in API Routes (BFF layer) to communicate with backend.
 */
export const PLANT_SPECIES_FIND_BY_DIFFICULTY_QUERY = `
  query PlantSpeciesFindByDifficulty($input: PlantSpeciesFindByCriteriaRequestDto) {
    plantSpeciesFindByCriteria(input: $input) {
      total
      page
      perPage
      totalPages
      items {
        id
        commonName
        scientificName
        family
        description
        category
        difficulty
        growthRate
        lightRequirements
        waterRequirements
        temperatureRange {
          min
          max
        }
        humidityRequirements
        soilType
        phRange {
          min
          max
        }
        matureSize {
          height
          width
        }
        growthTime
        tags
        isVerified
        contributorId
        createdAt
        updatedAt
      }
    }
  }
`;
