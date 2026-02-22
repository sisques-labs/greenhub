/**
 * Plant Species Search Query
 * Returns plant species matching a search term (by common name or scientific name).
 * Used in API Routes (BFF layer) to communicate with backend.
 */
export const PLANT_SPECIES_SEARCH_QUERY = `
  query PlantSpeciesSearch($input: PlantSpeciesFindByCriteriaRequestDto) {
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
