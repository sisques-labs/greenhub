/**
 * Plant Species Find Verified Query
 * Returns only verified plant species with optional pagination.
 * Used in API Routes (BFF layer) to communicate with backend.
 */
export const PLANT_SPECIES_FIND_VERIFIED_QUERY = `
  query PlantSpeciesFindVerified($input: PlantSpeciesFindByCriteriaRequestDto) {
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
