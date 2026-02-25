import { PLANT_SPECIES_FIND_BY_DIFFICULTY_QUERY } from '@/features/plant-species/api/queries/plant-species-find-by-difficulty.query';
import type {
	PlantSpeciesApiResponse,
	PlantSpeciesPaginatedResponse,
} from '@/features/plant-species/api/types/plant-species-response.types';
import { transformPlantSpeciesPaginatedResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import type { PlantSpeciesFindByCriteriaInput } from '@/features/plant-species/api/types/plant-species-request.types';
import { PlantSpeciesDifficulty } from '@/features/plant-species/api/types/plant-species.types';
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
 * GET /api/plant-species/difficulty/[difficulty]
 * Find plant species filtered by difficulty level
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ difficulty: string }> },
) {
	try {
		const { difficulty } = await params;
		const { searchParams } = new URL(request.url);
		const page = searchParams.get('page');
		const perPage = searchParams.get('perPage');

		if (!difficulty) {
			return NextResponse.json(
				{ error: 'Difficulty is required' },
				{ status: 400 },
			);
		}

		const upperDifficulty = difficulty.toUpperCase();
		if (!Object.values(PlantSpeciesDifficulty).includes(upperDifficulty as PlantSpeciesDifficulty)) {
			return NextResponse.json(
				{ error: `Invalid difficulty. Valid values: ${Object.values(PlantSpeciesDifficulty).join(', ')}` },
				{ status: 400 },
			);
		}

		const input: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'difficulty',
					operator: 'EQUALS',
					value: upperDifficulty,
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
			query: PLANT_SPECIES_FIND_BY_DIFFICULTY_QUERY,
			variables: { input },
			useAuth: true,
		});

		const transformedResult: PlantSpeciesPaginatedResponse =
			transformPlantSpeciesPaginatedResponse(result.plantSpeciesFindByCriteria);

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Plant species find by difficulty error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch plant species by difficulty',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
