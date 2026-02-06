/**
 * Locations API Client
 * HTTP client for locations endpoints
 */

import type {
  LocationFindByCriteriaInput,
  LocationFindByIdInput,
  LocationCreateInput,
  LocationUpdateInput,
  LocationDeleteInput,
  LocationResponse,
  LocationsPaginatedResponse,
  MutationResponse,
} from "./types";

/**
 * Locations API Client
 */
class LocationsApiClient {
  /**
   * Find locations by criteria (list with pagination)
   */
  async findByCriteria(
    input?: LocationFindByCriteriaInput
  ): Promise<LocationsPaginatedResponse> {
    const params = new URLSearchParams();
    if (input?.page) params.append("page", input.page.toString());
    if (input?.perPage) params.append("perPage", input.perPage.toString());
    if (input?.search) params.append("search", input.search);
    if (input?.sortBy) params.append("sortBy", input.sortBy);
    if (input?.sortOrder) params.append("sortOrder", input.sortOrder);

    const response = await fetch(`/api/locations?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch locations");
    }

    return response.json();
  }

  /**
   * Find location by ID
   */
  async findById(input: LocationFindByIdInput): Promise<LocationResponse> {
    const response = await fetch(`/api/locations/${input.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch location");
    }

    return response.json();
  }

  /**
   * Create new location
   */
  async create(input: LocationCreateInput): Promise<MutationResponse> {
    const response = await fetch("/api/locations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create location");
    }

    return response.json();
  }

  /**
   * Update location
   */
  async update(input: LocationUpdateInput): Promise<MutationResponse> {
    const response = await fetch(`/api/locations/${input.id}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update location");
    }

    return response.json();
  }

  /**
   * Delete location
   */
  async delete(input: LocationDeleteInput): Promise<MutationResponse> {
    const response = await fetch(`/api/locations/${input.id}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete location");
    }

    return response.json();
  }
}

export const locationsApiClient = new LocationsApiClient();
