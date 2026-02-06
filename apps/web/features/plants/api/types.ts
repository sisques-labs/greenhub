/**
 * Plants API types - matches backend GraphQL schema
 */

export type PlantStatus =
  | 'PLANTED'
  | 'GROWING'
  | 'HARVESTED'
  | 'DEAD'
  | 'ARCHIVED';

export type FilterOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'LIKE'
  | 'IN'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN_OR_EQUAL';

export type SortDirection = 'ASC' | 'DESC';

export interface BaseFilter {
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface BaseSort {
  field: string;
  direction: SortDirection;
}

export interface PaginationInput {
  page: number;
  perPage: number;
}

export interface FindByCriteriaInput {
  filters?: BaseFilter[];
  sorts?: BaseSort[];
  pagination?: PaginationInput;
}

export interface MutationResponse {
  success: boolean;
  message?: string;
  id?: string;
}

// Plant-specific types

export interface PlantGrowingUnitReference {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

export interface LocationCapacity {
  plantCapacity?: number | null;
  animalCapacity?: number | null;
}

export interface LocationDimensions {
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  unit?: string | null;
}

// Raw API response for Location (dates as strings from GraphQL)
export interface LocationApiResponse {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Transformed Location with Date objects (matches SDK type)
export interface LocationResponse {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Raw API response (dates as strings from GraphQL)
export interface PlantApiResponse {
  id: string;
  growingUnitId?: string | null;
  name: string;
  species: string;
  plantedDate?: string | null;
  notes?: string | null;
  status: PlantStatus;
  location?: LocationApiResponse;
  growingUnit?: PlantGrowingUnitReference;
  createdAt?: string;
  updatedAt?: string;
}

// Transformed plant with Date objects
export interface PlantResponse {
  id: string;
  growingUnitId?: string | null;
  name: string;
  species: string;
  plantedDate?: Date | null;
  notes?: string | null;
  status: PlantStatus;
  location?: LocationResponse;
  growingUnit?: PlantGrowingUnitReference;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedPlantResult {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  items: PlantResponse[];
}

// Input types

export type PlantFindByCriteriaInput = FindByCriteriaInput;

export interface PlantFindByIdInput {
  id: string;
}

export interface PlantCreateInput {
  growingUnitId: string;
  name: string;
  species: string;
  plantedDate?: string | null;
  notes?: string | null;
  status?: PlantStatus;
}

export interface PlantUpdateInput {
  id: string;
  name?: string;
  species?: string;
  plantedDate?: string | null;
  notes?: string | null;
  status?: PlantStatus;
}

export interface PlantTransplantInput {
  plantId: string;
  sourceGrowingUnitId: string;
  targetGrowingUnitId: string;
}

// Helper to transform API response to PlantResponse
export function transformPlantResponse(apiResponse: PlantApiResponse): PlantResponse {
  return {
    ...apiResponse,
    plantedDate: apiResponse.plantedDate ? new Date(apiResponse.plantedDate) : null,
    location: apiResponse.location
      ? {
          id: apiResponse.location.id,
          name: apiResponse.location.name,
          type: apiResponse.location.type,
          description: apiResponse.location.description,
          createdAt: new Date(apiResponse.location.createdAt),
          updatedAt: new Date(apiResponse.location.updatedAt),
        }
      : undefined,
    createdAt: apiResponse.createdAt ? new Date(apiResponse.createdAt) : undefined,
    updatedAt: apiResponse.updatedAt ? new Date(apiResponse.updatedAt) : undefined,
  };
}
