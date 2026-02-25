/**
 * Plant Species Find By ID Query
 * Used in API Routes (BFF layer) to communicate with backend
 */
export const PLANT_SPECIES_FIND_BY_ID_QUERY = `
  query PlantSpeciesFindById($input: PlantSpeciesFindByIdRequestDto!) {
    plantSpeciesFindById(input: $input) {
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
`;
