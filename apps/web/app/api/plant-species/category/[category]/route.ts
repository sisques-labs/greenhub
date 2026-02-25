import { PLANT_SPECIES_FIND_BY_CATEGORY_QUERY } from '@/features/plant-species/api/queries/plant-species-find-by-category.query';
import type {
	PlantSpeciesApiResponse,
	PlantSpeciesPaginatedResponse,
} from '@/features/plant-species/api/types/plant-species-response.types';
import { transformPlantSpeciesPaginatedResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import type {
	PlantSpeciesFindByCriteriaInput,
} from '@/features/plant-species/api/types/plant-species-request.types';
import { PlantSpeciesCategory } from '@/features/plant-species/api/types/plant-species.types';
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
 * GET /api/plant-species/category/[category]
 * Find plant species filtered by category
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ category: string }> },
) {
	try {
		const { category } = await params;
		const { searchParams } = new URL(request.url);
		const page = searchParams.get('page');
		const perPage = searchParams.get('perPage');

		if (!category) {
			return NextResponse.json(
				{ error: 'Category is required' },
				{ status: 400 },
			);
		}

		const upperCategory = category.toUpperCase();
		if (!Object.values(PlantSpeciesCategory).includes(upperCategory as PlantSpeciesCategory)) {
			return NextResponse.json(
				{ error: `Invalid category. Valid values: ${Object.values(PlantSpeciesCategory).join(', ')}` },
				{ status: 400 },
			);
		}

		const input: PlantSpeciesFindByCriteriaInput = {
			filters: [
				{
					field: 'category',
					operator: 'EQUALS',
					value: upperCategory,
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
			query: PLANT_SPECIES_FIND_BY_CATEGORY_QUERY,
			variables: { input },
			useAuth: true,
		});

		const transformedResult: PlantSpeciesPaginatedResponse =
			transformPlantSpeciesPaginatedResponse(result.plantSpeciesFindByCriteria);

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Plant species find by category error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch plant species by category',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
