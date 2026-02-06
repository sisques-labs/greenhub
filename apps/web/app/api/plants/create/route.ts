import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { PLANT_ADD_MUTATION } from '@/features/plants/api/mutations';
import type {
  PlantCreateInput,
  MutationResponse,
} from '@/features/plants/api/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PlantCreateInput;

    // Validate input
    if (!body.growingUnitId || !body.name || !body.species) {
      return NextResponse.json(
        { error: 'Growing unit ID, name, and species are required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      plantAdd: MutationResponse;
    }>({
      query: PLANT_ADD_MUTATION,
      variables: { input: body },
      useAuth: true,
    });

    return NextResponse.json(result.plantAdd);
  } catch (error) {
    console.error('Plant create error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create plant',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
