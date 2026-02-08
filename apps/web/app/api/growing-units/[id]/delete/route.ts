import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { GROWING_UNIT_DELETE_MUTATION } from '@/features/growing-units/api/mutations';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import type {
  DeleteGrowingUnitInput,
} from '@/features/growing-units/api/types';

export async function DELETE(
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

    // Construct delete input
    const input: DeleteGrowingUnitInput = {
      id,
    };

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      growingUnitDelete: IMutationResponse;
    }>({
      query: GROWING_UNIT_DELETE_MUTATION,
      variables: { input },
      useAuth: true,
    });

    return NextResponse.json(result.growingUnitDelete);
  } catch (error) {
    console.error('Growing unit delete error:', error);

    return NextResponse.json(
      {
        error: 'Failed to delete growing unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
