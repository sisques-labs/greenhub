/**
 * Growing Units API types - matches backend GraphQL schema
 */

import type { PlantResponse, LocationResponse } from 'features/plants/api/types';

export type GrowingUnitType = 'POT' | 'GARDEN_BED' | 'HANGING_BASKET' | 'WINDOW_BOX';

export type LengthUnit =
  | 'MILLIMETER'
  | 'CENTIMETER'
  | 'METER'
  | 'INCH'
  | 'FOOT';

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

// Growing Unit specific types

export interface GrowingUnitDimensions {
  length: number;
  width: number;
  height: number;
  unit: LengthUnit;
}

// Raw API response (dates as strings from GraphQL)
export interface GrowingUnitApiResponse {
  id: string;
  location: LocationResponse;
  name: string;
  type: string;
  capacity: number;
  dimensions?: GrowingUnitDimensions | null;
  plants: PlantResponse[];
  numberOfPlants: number;
  remainingCapacity: number;
  volume: number;
  createdAt: string;
  updatedAt: string;
}

// Transformed GrowingUnit with Date objects
export interface GrowingUnitResponse {
  id: string;
  location: LocationResponse;
  name: string;
  type: string;
  capacity: number;
  dimensions?: GrowingUnitDimensions | null;
  plants: PlantResponse[];
  numberOfPlants: number;
  remainingCapacity: number;
  volume: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedGrowingUnitResult {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  items: GrowingUnitResponse[];
}

// Input types

export type GrowingUnitFindByCriteriaInput = FindByCriteriaInput;

export interface GrowingUnitFindByIdInput {
  id: string;
}

export interface CreateGrowingUnitInput {
  locationId: string;
  name: string;
  type: GrowingUnitType;
  capacity: number;
  length?: number;
  width?: number;
  height?: number;
  unit?: LengthUnit;
}

export interface UpdateGrowingUnitInput {
  id: string;
  locationId?: string;
  name?: string;
  type?: GrowingUnitType;
  capacity?: number;
  length?: number;
  width?: number;
  height?: number;
  unit?: LengthUnit;
}

export interface DeleteGrowingUnitInput {
  id: string;
}

// Helper to transform API response to GrowingUnitResponse
export function transformGrowingUnitResponse(
  apiResponse: GrowingUnitApiResponse
): GrowingUnitResponse {
  return {
    ...apiResponse,
    createdAt: new Date(apiResponse.createdAt),
    updatedAt: new Date(apiResponse.updatedAt),
  };
}
