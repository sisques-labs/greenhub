import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { GROWING_UNIT_CREATE_MUTATION } from '@/features/growing-units/api/mutations';
import type { IMutationResponse } from '@/shared/interfaces/mutation-response.interface';
import type {
  CreateGrowingUnitInput,
} from '@/features/growing-units/api/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateGrowingUnitInput;

    // Validate input
    if (!body.locationId || !body.name || !body.type || body.capacity === undefined) {
      return NextResponse.json(
        { error: 'Location ID, name, type, and capacity are required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      growingUnitCreate: IMutationResponse;
    }>({
      query: GROWING_UNIT_CREATE_MUTATION,
      variables: { input: body },
      useAuth: true,
    });

    return NextResponse.json(result.growingUnitCreate);
  } catch (error) {
    console.error('Growing unit create error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create growing unit',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
