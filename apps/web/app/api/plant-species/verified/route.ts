import { PLANT_SPECIES_FIND_VERIFIED_QUERY } from '@/features/plant-species/api/queries/plant-species-find-verified.query';
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
 * GET /api/plant-species/verified
 * Find all verified plant species
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = searchParams.get('page');
		const perPage = searchParams.get('perPage');

		const input: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'isVerified',
					operator: 'EQUALS',
					value: true,
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
			query: PLANT_SPECIES_FIND_VERIFIED_QUERY,
			variables: { input },
			useAuth: true,
		});

		const transformedResult: PlantSpeciesPaginatedResponse =
			transformPlantSpeciesPaginatedResponse(result.plantSpeciesFindByCriteria);

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Plant species find verified error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch verified plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
