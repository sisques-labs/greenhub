import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { PLANT_TRANSPLANT_MUTATION } from '@/features/plants/api/mutations';
import type {
  PlantTransplantInput,
  MutationResponse,
} from '@/features/plants/api/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Omit<
      PlantTransplantInput,
      'plantId'
    >;

    if (!id) {
      return NextResponse.json(
        { error: 'Plant ID is required' },
        { status: 400 }
      );
    }

    if (!body.sourceGrowingUnitId || !body.targetGrowingUnitId) {
      return NextResponse.json(
        { error: 'Source and target growing unit IDs are required' },
        { status: 400 }
      );
    }

    // Construct full transplant input with plant ID
    const input: PlantTransplantInput = {
      plantId: id,
      ...body,
    };

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      plantTransplant: MutationResponse;
    }>({
      query: PLANT_TRANSPLANT_MUTATION,
      variables: { input },
      useAuth: true,
    });

    return NextResponse.json(result.plantTransplant);
  } catch (error) {
    console.error('Plant transplant error:', error);

    return NextResponse.json(
      {
        error: 'Failed to transplant plant',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
