import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { PLANT_UPDATE_MUTATION } from '@/features/plants/api/mutations';
import type {
  PlantUpdateInput,
  MutationResponse,
} from '@/features/plants/api/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Omit<PlantUpdateInput, 'id'>;

    if (!id) {
      return NextResponse.json(
        { error: 'Plant ID is required' },
        { status: 400 }
      );
    }

    // Construct full update input with ID
    const input: PlantUpdateInput = {
      id,
      ...body,
    };

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      plantUpdate: MutationResponse;
    }>({
      query: PLANT_UPDATE_MUTATION,
      variables: { input },
      useAuth: true,
    });

    return NextResponse.json(result.plantUpdate);
  } catch (error) {
    console.error('Plant update error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update plant',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
