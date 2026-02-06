import { httpClient } from '@/lib/client/http-client';
import type {
	CreateGrowingUnitInput,
	GrowingUnitFindByCriteriaInput,
	GrowingUnitFindByIdInput,
	GrowingUnitResponse,
	MutationResponse,
	PaginatedGrowingUnitResult,
	UpdateGrowingUnitInput,
} from './types';

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

		return httpClient.get<PaginatedGrowingUnitResult>(
			`/api/growing-units?${params.toString()}`,
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
	create: async (input: CreateGrowingUnitInput): Promise<MutationResponse> => {
		return httpClient.post<MutationResponse>(
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
	): Promise<MutationResponse> => {
		return httpClient.put<MutationResponse>(
			`/api/growing-units/${id}/update`,
			input,
		);
	},

	/**
	 * Delete a growing unit
	 */
	delete: async (id: string): Promise<MutationResponse> => {
		return httpClient.delete<MutationResponse>(
			`/api/growing-units/${id}/delete`,
		);
	},
};
