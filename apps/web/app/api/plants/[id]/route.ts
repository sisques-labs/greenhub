import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { PLANT_FIND_BY_ID_QUERY } from '@/features/plants/api/queries';
import type {
  PlantApiResponse,
  PlantResponse,
} from '@/features/plants/api/types';
import { transformPlantResponse } from '@/features/plants/api/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Plant ID is required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      plantFindById: PlantApiResponse | null;
    }>({
      query: PLANT_FIND_BY_ID_QUERY,
      variables: { input: { id } },
      useAuth: true,
    });

    if (!result.plantFindById) {
      return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    }

    // Transform date strings to Date objects
    const transformedPlant: PlantResponse = transformPlantResponse(
      result.plantFindById
    );

    return NextResponse.json(transformedPlant);
  } catch (error) {
    console.error('Plant find by ID error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch plant',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
