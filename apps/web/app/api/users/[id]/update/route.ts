import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { USER_UPDATE_MUTATION } from '@/features/users/api/mutations';
import type {
  UpdateUserInput,
  UserMutationResponse,
} from '@/features/users/api/types';

/**
 * PUT /api/users/[id]/update
 * Update user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = (await request.json()) as Omit<UpdateUserInput, 'id'>;

    // Build update input
    const input: UpdateUserInput = {
      id,
      ...body,
    };

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      userUpdate: UserMutationResponse;
    }>({
      query: USER_UPDATE_MUTATION,
      variables: { input },
      useAuth: true,
    });

    return NextResponse.json(result.userUpdate);
  } catch (error) {
    console.error('User update error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
