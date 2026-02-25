import { httpClient } from '@/lib/client/http-client';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import type {
	PlantSpeciesCreateInput,
	PlantSpeciesDeleteInput,
	PlantSpeciesFindByCategoryInput,
	PlantSpeciesFindByCriteriaInput,
	PlantSpeciesFindByDifficultyInput,
	PlantSpeciesFindByIdInput,
	PlantSpeciesSearchInput,
	PlantSpeciesFindVerifiedInput,
} from '../types/plant-species-request.types';
import type {
	PlantSpeciesApiResponse,
	PlantSpeciesPaginatedApiResponse,
	PlantSpeciesResponse,
	PlantSpeciesPaginatedResponse,
} from '../types/plant-species-response.types';
import {
	transformPlantSpeciesResponse,
	transformPlantSpeciesPaginatedResponse,
} from '../types/plant-species-response.types';
import type { PlantSpeciesUpdateInput } from '../types/plant-species-request.types';

/**
 * Plant Species API client for frontend
 * Calls Next.js API Routes (BFF layer)
 */
export const plantSpeciesClient = {
	/**
	 * Create a new plant species
	 */
	create: async (input: PlantSpeciesCreateInput): Promise<IMutationResponse> => {
		return httpClient.post<IMutationResponse>(
			'/api/plant-species/create',
			input,
		);
	},

	/**
	 * Update an existing plant species
	 */
	update: async (
		id: string,
		input: Omit<PlantSpeciesUpdateInput, 'id'>,
	): Promise<IMutationResponse> => {
		return httpClient.put<IMutationResponse>(
			`/api/plant-species/${id}/update`,
			input,
		);
	},

	/**
	 * Delete a plant species
	 */
	delete: async (input: PlantSpeciesDeleteInput): Promise<IMutationResponse> => {
		return httpClient.delete<IMutationResponse>(
			`/api/plant-species/${input.id}/delete`,
		);
	},

	/**
	 * Find a plant species by ID
	 */
	findById: async (
		input: PlantSpeciesFindByIdInput,
	): Promise<PlantSpeciesResponse | null> => {
		const result = await httpClient.get<PlantSpeciesApiResponse | null>(
			`/api/plant-species/${input.id}`,
		);

		if (!result) return null;
		return transformPlantSpeciesResponse(result);
	},

	/**
	 * Find all plant species with optional pagination
	 */
	findAll: async (
		input?: PlantSpeciesFindByCriteriaInput,
	): Promise<PlantSpeciesPaginatedResponse> => {
		const params = new URLSearchParams();
		if (input) {
			params.append('input', JSON.stringify(input));
		}

		const result = await httpClient.get<PlantSpeciesPaginatedApiResponse>(
			`/api/plant-species?${params.toString()}`,
		);

		return transformPlantSpeciesPaginatedResponse(result);
	},

	/**
	 * Find plant species by category
	 */
	findByCategory: async (
		input: PlantSpeciesFindByCategoryInput,
	): Promise<PlantSpeciesPaginatedResponse> => {
		const criteria: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'category',
					operator: 'EQUALS',
					value: input.category,
				},
			],
			pagination: input.pagination,
		};

		const params = new URLSearchParams();
		params.append('input', JSON.stringify(criteria));

		const result = await httpClient.get<PlantSpeciesPaginatedApiResponse>(
			`/api/plant-species?${params.toString()}`,
		);

		return transformPlantSpeciesPaginatedResponse(result);
	},

	/**
	 * Find plant species by difficulty level
	 */
	findByDifficulty: async (
		input: PlantSpeciesFindByDifficultyInput,
	): Promise<PlantSpeciesPaginatedResponse> => {
		const criteria: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'difficulty',
					operator: 'EQUALS',
					value: input.difficulty,
				},
			],
			pagination: input.pagination,
		};

		const params = new URLSearchParams();
		params.append('input', JSON.stringify(criteria));

		const result = await httpClient.get<PlantSpeciesPaginatedApiResponse>(
			`/api/plant-species?${params.toString()}`,
		);

		return transformPlantSpeciesPaginatedResponse(result);
	},

	/**
	 * Search plant species by name (common name or scientific name)
	 */
	search: async (
		input: PlantSpeciesSearchInput,
	): Promise<PlantSpeciesPaginatedResponse> => {
		const criteria: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'commonName',
					operator: 'CONTAINS',
					value: input.query,
				},
			],
			pagination: input.pagination,
		};

		const params = new URLSearchParams();
		params.append('input', JSON.stringify(criteria));

		const result = await httpClient.get<PlantSpeciesPaginatedApiResponse>(
			`/api/plant-species?${params.toString()}`,
		);

		return transformPlantSpeciesPaginatedResponse(result);
	},

	/**
	 * Find verified plant species
	 */
	findVerified: async (
		input?: PlantSpeciesFindVerifiedInput,
	): Promise<PlantSpeciesPaginatedResponse> => {
		const criteria: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'isVerified',
					operator: 'EQUALS',
					value: true,
				},
			],
			pagination: input?.pagination,
		};

		const params = new URLSearchParams();
		params.append('input', JSON.stringify(criteria));

		const result = await httpClient.get<PlantSpeciesPaginatedApiResponse>(
			`/api/plant-species?${params.toString()}`,
		);

		return transformPlantSpeciesPaginatedResponse(result);
	},
};
