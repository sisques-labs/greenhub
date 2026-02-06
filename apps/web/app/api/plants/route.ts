import { PLANTS_FIND_BY_CRITERIA_QUERY } from '@/features/plants/api/queries';
import type {
	PaginatedPlantResult,
	PlantApiResponse,
	PlantFindByCriteriaInput,
} from '@/features/plants/api/types';
import { transformPlantResponse } from '@/features/plants/api/types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

interface PaginatedPlantApiResult {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	items: PlantApiResponse[];
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const inputParam = searchParams.get('input');

		let input: PlantFindByCriteriaInput | undefined;
		if (inputParam) {
			input = JSON.parse(inputParam) as PlantFindByCriteriaInput;
		}

		// Call GraphQL backend
		const result = await graphqlClient.request<{
			plantsFindByCriteria: PaginatedPlantApiResult;
		}>({
			query: PLANTS_FIND_BY_CRITERIA_QUERY,
			variables: input ? { input } : undefined,
			useAuth: true,
		});

		const apiResult = result.plantsFindByCriteria;

		// Transform date strings to Date objects
		const transformedResult: PaginatedPlantResult = {
			...apiResult,
			items: apiResult.items.map(transformPlantResponse),
		};

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Plants find by criteria error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch plants',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
