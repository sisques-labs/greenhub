import { GROWING_UNITS_FIND_BY_CRITERIA_QUERY } from '@/features/growing-units/api/queries';
import type {
	GrowingUnitApiResponse,
	GrowingUnitFindByCriteriaInput,
	PaginatedGrowingUnitResult,
} from '@/features/growing-units/api/types';
import { transformGrowingUnitResponse } from '@/features/growing-units/api/types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

interface PaginatedGrowingUnitApiResult {
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
	items: GrowingUnitApiResponse[];
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const inputParam = searchParams.get('input');

		let input: GrowingUnitFindByCriteriaInput | undefined;
		if (inputParam) {
			input = JSON.parse(inputParam) as GrowingUnitFindByCriteriaInput;
		}

		// Call GraphQL backend
		const result = await graphqlClient.request<{
			growingUnitsFindByCriteria: PaginatedGrowingUnitApiResult;
		}>({
			query: GROWING_UNITS_FIND_BY_CRITERIA_QUERY,
			variables: input ? { input } : undefined,
			useAuth: true,
		});

		const apiResult = result.growingUnitsFindByCriteria;

		// Transform date strings to Date objects
		const transformedResult: PaginatedGrowingUnitResult = {
			...apiResult,
			items: apiResult.items.map(transformGrowingUnitResponse),
		};

		return NextResponse.json(transformedResult);
	} catch (error) {
		console.error('Growing units find by criteria error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch growing units',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
