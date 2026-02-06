import { OVERVIEW_QUERY } from '@/features/dashboard/api/queries';
import type {
	OverviewApiResponse,
	OverviewResponse,
} from '@/features/dashboard/api/types';
import { transformOverviewResponse } from '@/features/dashboard/api/types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard/overview
 * Get overview/dashboard data
 */
export async function GET(_request: NextRequest) {
	try {
		// Call GraphQL backend
		const result = await graphqlClient.request<{
			overviewFind: OverviewApiResponse;
		}>({
			query: OVERVIEW_QUERY,
			variables: {},
			useAuth: true,
		});

		if (!result.overviewFind) {
			return NextResponse.json(
				{ error: 'Overview data not available' },
				{ status: 404 },
			);
		}

		// Transform from backend naming to frontend naming
		const overview: OverviewResponse = transformOverviewResponse(
			result.overviewFind,
		);

		return NextResponse.json(overview);
	} catch (error) {
		console.error('Overview fetch error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch overview data',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
