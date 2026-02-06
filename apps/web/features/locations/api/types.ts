/**
 * Locations API Types
 * Defines request/response interfaces for locations data
 */

/**
 * Location Response from API
 */
export interface LocationResponse {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Location API Response (from GraphQL - with Date objects)
 */
export interface LocationApiResponse {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated Locations Response
 */
export interface LocationsPaginatedResponse {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  items: LocationResponse[];
}

/**
 * Paginated Locations API Response (from GraphQL)
 */
export interface LocationsPaginatedApiResponse {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  items: LocationApiResponse[];
}

/**
 * Location Find By Criteria Input
 */
export interface LocationFindByCriteriaInput {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Location Find By ID Input
 */
export interface LocationFindByIdInput {
  id: string;
}

/**
 * Location Create Input
 */
export interface LocationCreateInput {
  name: string;
  type: string;
  description?: string;
}

/**
 * Location Update Input
 */
export interface LocationUpdateInput {
  id: string;
  name?: string;
  type?: string;
  description?: string;
}

/**
 * Location Delete Input
 */
export interface LocationDeleteInput {
  id: string;
}

/**
 * Mutation Response
 */
export interface MutationResponse {
  success: boolean;
  message: string;
  id: string;
}

/**
 * Transform location from API response
 */
export function transformLocationResponse(
  apiResponse: LocationApiResponse
): LocationResponse {
  return {
    id: apiResponse.id,
    name: apiResponse.name,
    type: apiResponse.type,
    description: apiResponse.description,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
  };
}

/**
 * Transform paginated locations from API response
 */
export function transformLocationsPaginatedResponse(
  apiResponse: LocationsPaginatedApiResponse
): LocationsPaginatedResponse {
  return {
    total: apiResponse.total,
    page: apiResponse.page,
    perPage: apiResponse.perPage,
    totalPages: apiResponse.totalPages,
    items: apiResponse.items.map(transformLocationResponse),
  };
}
