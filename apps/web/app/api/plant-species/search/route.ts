import { PLANT_SPECIES_SEARCH_QUERY } from '@/features/plant-species/api/queries/plant-species-search.query';
import type {
	PlantSpeciesApiResponse,
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
 * GET /api/plant-species/search?q=...
 * Search plant species by common name or scientific name
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q');
		const page = searchParams.get('page');
		const perPage = searchParams.get('perPage');

		if (!query) {
			return NextResponse.json(
				{ error: 'Search query (q) is required' },
				{ status: 400 },
			);
		}

		const input: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'commonName',
					operator: 'CONTAINS',
					value: query,
				},
			],
			pagination: {
				page: page ? Number.parseInt(page) : undefined,
				perPage: perPage ? Number.parseInt(perPage) : undefined,
			},
		};

		const result = await graphqlClient.request<{
			plantSpeciesFindByCriteria: PlantSpeciesPaginatedApiResult;
		}>({
			query: PLANT_SPECIES_SEARCH_QUERY,
			variables: { input },
			useAuth: true,
		});

		const transformedResult: PlantSpeciesPaginatedResponse =
			transformPlantSpeciesPaginatedResponse(result.plantSpeciesFindByCriteria);

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Plant species search error:', error);

		return NextResponse.json(
			{
				error: 'Failed to search plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
