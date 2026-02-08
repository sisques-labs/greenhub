import { httpClient } from '@/lib/client/http-client';
import { PaginatedResult } from '@/shared/dtos/paginated-result.entity';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import type {
	CreateGrowingUnitInput,
	GrowingUnitFindByCriteriaInput,
	GrowingUnitFindByIdInput,
	GrowingUnitResponse,
	GrowingUnitApiResponse,
	PaginatedGrowingUnitResult,
	UpdateGrowingUnitInput,
} from './types';
import { transformGrowingUnitResponse } from './types';

/**
 * Growing Units API client for frontend
 * Calls Next.js API Routes (BFF layer)
 */
export const growingUnitsApiClient = {
	/**
	 * Find growing units by criteria (with filters, sorting, pagination)
	 */
	findByCriteria: async (
		input?: GrowingUnitFindByCriteriaInput,
	): Promise<PaginatedGrowingUnitResult> => {
		// Convert input to query params
		const params = new URLSearchParams();
		if (input) {
			params.append('input', JSON.stringify(input));
		}

		const result = await httpClient.get<{
			items: GrowingUnitApiResponse[];
			total: number;
			page: number;
			perPage: number;
		}>(`/api/growing-units?${params.toString()}`);

		// Use PaginatedResult constructor
		return new PaginatedResult(
			result.items.map(transformGrowingUnitResponse),
			result.total,
			result.page,
			result.perPage,
		);
	},

	/**
	 * Find growing unit by ID
	 */
	findById: async (
		input: GrowingUnitFindByIdInput,
	): Promise<GrowingUnitResponse | null> => {
		return httpClient.get<GrowingUnitResponse | null>(
			`/api/growing-units/${input.id}`,
		);
	},

	/**
	 * Create a new growing unit
	 */
	create: async (input: CreateGrowingUnitInput): Promise<IMutationResponse> => {
		return httpClient.post<IMutationResponse>(
			'/api/growing-units/create',
			input,
		);
	},

	/**
	 * Update an existing growing unit
	 */
	update: async (
		id: string,
		input: Omit<UpdateGrowingUnitInput, 'id'>,
	): Promise<IMutationResponse> => {
		return httpClient.put<IMutationResponse>(
			`/api/growing-units/${id}/update`,
			input,
		);
	},

	/**
	 * Delete a growing unit
	 */
	delete: async (id: string): Promise<IMutationResponse> => {
		return httpClient.delete<IMutationResponse>(
			`/api/growing-units/${id}/delete`,
		);
	},
};
