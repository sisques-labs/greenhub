import { httpClient } from '@/lib/client/http-client';
import { PaginatedResult } from '@/shared/dtos/paginated-result.entity';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import type {
  PlantFindByCriteriaInput,
  PlantFindByIdInput,
  PlantCreateInput,
  PlantUpdateInput,
  PlantTransplantInput,
  PlantResponse,
  PlantApiResponse,
  PaginatedPlantResult,
} from './types';
import { transformPlantResponse } from './types';

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

    const result = await httpClient.get<{
      items: PlantApiResponse[];
      total: number;
      page: number;
      perPage: number;
    }>(`/api/plants?${params.toString()}`);

    // Use PaginatedResult constructor
    return new PaginatedResult(
      result.items.map(transformPlantResponse),
      result.total,
      result.page,
      result.perPage
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
  create: async (input: PlantCreateInput): Promise<IMutationResponse> => {
    return httpClient.post<IMutationResponse>('/api/plants/create', input);
  },

  /**
   * Update an existing plant
   */
  update: async (
    id: string,
    input: Omit<PlantUpdateInput, 'id'>
  ): Promise<IMutationResponse> => {
    return httpClient.put<IMutationResponse>(`/api/plants/${id}/update`, input);
  },

  /**
   * Transplant a plant to a different growing unit
   */
  transplant: async (
    id: string,
    input: Omit<PlantTransplantInput, 'plantId'>
  ): Promise<IMutationResponse> => {
    return httpClient.post<IMutationResponse>(
      `/api/plants/${id}/transplant`,
      input
    );
  },
};
