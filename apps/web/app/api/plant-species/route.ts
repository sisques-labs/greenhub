import { PLANT_SPECIES_FIND_ALL_QUERY } from '@/features/plant-species/api/queries/plant-species-find-all.query';
import type {
	PlantSpeciesApiResponse,
	PlantSpeciesPaginatedApiResponse,
	PlantSpeciesPaginatedResponse,
} from '@/features/plant-species/api/types/plant-species-response.types';
import { transformPlantSpeciesPaginatedResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import type { PlantSpeciesFindByCriteriaInput } from '@/features/plant-species/api/types/plant-species-request.types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

interface PlantSpeciesPaginatedApiResult {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	items: PlantSpeciesApiResponse[];
}

/**
 * GET /api/plant-species
 * Find all plant species with optional filters and pagination
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const inputParam = searchParams.get('input');

		let input: PlantSpeciesFindByCriteriaInput | undefined;
		if (inputParam) {
			input = JSON.parse(inputParam) as PlantSpeciesFindByCriteriaInput;
		}

		const result = await graphqlClient.request<{
			plantSpeciesFindByCriteria: PlantSpeciesPaginatedApiResult;
		}>({
			query: PLANT_SPECIES_FIND_ALL_QUERY,
			variables: input ? { input } : undefined,
			useAuth: true,
		});

		const apiResult = result.plantSpeciesFindByCriteria;

		const transformedResult: PlantSpeciesPaginatedResponse =
			transformPlantSpeciesPaginatedResponse(apiResult);

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Plant species find all error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
