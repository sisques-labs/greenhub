import { httpClient } from '@/lib/client/http-client';
import type {
  PlantFindByCriteriaInput,
  PlantFindByIdInput,
  PlantCreateInput,
  PlantUpdateInput,
  PlantTransplantInput,
  PaginatedPlantResult,
  PlantResponse,
  MutationResponse,
} from './types';

/**
 * Plants API client for frontend
 * Calls Next.js API Routes (BFF layer)
 */
export const plantsApiClient = {
  /**
   * Find plants by criteria (with filters, sorting, pagination)
   */
  findByCriteria: async (
    input?: PlantFindByCriteriaInput
  ): Promise<PaginatedPlantResult> => {
    // Convert input to query params
    const params = new URLSearchParams();
    if (input) {
      params.append('input', JSON.stringify(input));
    }

    return httpClient.get<PaginatedPlantResult>(
      `/api/plants?${params.toString()}`
    );
  },

  /**
   * Find plant by ID
   */
  findById: async (input: PlantFindByIdInput): Promise<PlantResponse | null> => {
    return httpClient.get<PlantResponse | null>(`/api/plants/${input.id}`);
  },

  /**
   * Create a new plant
   */
  create: async (input: PlantCreateInput): Promise<MutationResponse> => {
    return httpClient.post<MutationResponse>('/api/plants/create', input);
  },

  /**
   * Update an existing plant
   */
  update: async (
    id: string,
    input: Omit<PlantUpdateInput, 'id'>
  ): Promise<MutationResponse> => {
    return httpClient.put<MutationResponse>(`/api/plants/${id}/update`, input);
  },

  /**
   * Transplant a plant to a different growing unit
   */
  transplant: async (
    id: string,
    input: Omit<PlantTransplantInput, 'plantId'>
  ): Promise<MutationResponse> => {
    return httpClient.post<MutationResponse>(
      `/api/plants/${id}/transplant`,
      input
    );
  },
};
