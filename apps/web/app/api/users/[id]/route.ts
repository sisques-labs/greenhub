import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { USER_FIND_BY_ID_QUERY } from '@/features/users/api/queries';
import type {
  UserApiResponse,
  UserResponse,
} from '@/features/users/api/types';
import { transformUserResponse } from '@/features/users/api/types';

/**
 * GET /api/users/[id]
 * Find user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      userFindById: UserApiResponse | null;
    }>({
      query: USER_FIND_BY_ID_QUERY,
      variables: { input: { id } },
      useAuth: true,
    });

    if (!result.userFindById) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform dates from strings to Date objects
    const transformedUser: UserResponse = transformUserResponse(
      result.userFindById
    )!;

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('User find by ID error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
