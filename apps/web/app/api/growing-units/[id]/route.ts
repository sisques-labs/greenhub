import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { GROWING_UNIT_FIND_BY_ID_QUERY } from '@/features/growing-units/api/queries';
import type {
  GrowingUnitApiResponse,
  GrowingUnitResponse,
} from '@/features/growing-units/api/types';
import { transformGrowingUnitResponse } from '@/features/growing-units/api/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Growing unit ID is required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      growingUnitFindById: GrowingUnitApiResponse | null;
    }>({
      query: GROWING_UNIT_FIND_BY_ID_QUERY,
      variables: { input: { id } },
      useAuth: true,
    });

    if (!result.growingUnitFindById) {
      return NextResponse.json(
        { error: 'Growing unit not found' },
        { status: 404 }
      );
    }

    // Transform date strings to Date objects
    const transformedGrowingUnit: GrowingUnitResponse =
      transformGrowingUnitResponse(result.growingUnitFindById);

    return NextResponse.json(transformedGrowingUnit);
  } catch (error) {
    console.error('Growing unit find by ID error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch growing unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
