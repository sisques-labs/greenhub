import { PLANT_SPECIES_FIND_BY_ID_QUERY } from '@/features/plant-species/api/queries/plant-species-find-by-id.query';
import type {
	PlantSpeciesApiResponse,
	PlantSpeciesResponse,
} from '@/features/plant-species/api/types/plant-species-response.types';
import { transformPlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/plant-species/[id]
 * Find a plant species by ID
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		if (!id) {
			return NextResponse.json(
				{ error: 'Plant species ID is required' },
				{ status: 400 },
			);
		}

		const result = await graphqlClient.request<{
			plantSpeciesFindById: PlantSpeciesApiResponse | null;
		}>({
			query: PLANT_SPECIES_FIND_BY_ID_QUERY,
			variables: { input: { id } },
			useAuth: true,
		});

		if (!result.plantSpeciesFindById) {
			return NextResponse.json(
				{ error: 'Plant species not found' },
				{ status: 404 },
			);
		}

		const transformedPlantSpecies: PlantSpeciesResponse = transformPlantSpeciesResponse(
			result.plantSpeciesFindById,
		);

		return NextResponse.json(transformedPlantSpecies);
	} catch (error) {
		console.error('Plant species find by ID error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch plant species',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
