import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { GROWING_UNIT_UPDATE_MUTATION } from '@/features/growing-units/api/mutations';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import type {
  UpdateGrowingUnitInput,
} from '@/features/growing-units/api/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Omit<UpdateGrowingUnitInput, 'id'>;

    if (!id) {
      return NextResponse.json(
        { error: 'Growing unit ID is required' },
        { status: 400 }
      );
    }

    // Construct full update input with ID
    const input: UpdateGrowingUnitInput = {
      id,
      ...body,
    };

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      growingUnitUpdate: IMutationResponse;
    }>({
      query: GROWING_UNIT_UPDATE_MUTATION,
      variables: { input },
      useAuth: true,
    });

    return NextResponse.json(result.growingUnitUpdate);
  } catch (error) {
    console.error('Growing unit update error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update growing unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
