import { LOCATIONS_FIND_BY_CRITERIA_QUERY } from '@/features/locations/api/queries';
import type {
	LocationsPaginatedApiResponse,
	LocationsPaginatedResponse,
} from '@/features/locations/api/types';
import { transformLocationsPaginatedResponse } from '@/features/locations/api/types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/locations
 * Get locations list with pagination and filters
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl;
		const page = searchParams.get('page');
		const perPage = searchParams.get('perPage');

		const input = {
			pagination: {
				page: page ? Number.parseInt(page) : 1,
				perPage: perPage ? Number.parseInt(perPage) : 10,
			},
		};

		// Call GraphQL backend
		const result = await graphqlClient.request<{
			locationsFindByCriteria: LocationsPaginatedApiResponse;
		}>({
			query: LOCATIONS_FIND_BY_CRITERIA_QUERY,
			variables: { input },
			useAuth: true,
		});

		if (!result.locationsFindByCriteria) {
			return NextResponse.json(
				{ error: 'Locations not found' },
				{ status: 404 },
			);
		}

		// Transform response
		const locations: LocationsPaginatedResponse =
			transformLocationsPaginatedResponse(result.locationsFindByCriteria);

		return NextResponse.json(locations);
	} catch (error) {
		console.error('Locations fetch error:', error);

		return NextResponse.json(
			{
				error: 'Failed to fetch locations',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
