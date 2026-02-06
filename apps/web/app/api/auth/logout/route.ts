import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { clearAuthTokens } from '@/lib/server/auth-cookies';
import { withAuth } from '@/lib/server/with-auth';
import { AUTH_LOGOUT_MUTATION } from '@/features/auth/api/mutations';
import type { MutationResponse, LogoutInput } from '@/features/auth/api/types';

async function handleLogout(request: NextRequest) {
  try {
    const body = (await request.json()) as LogoutInput;

    // Validate input
    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend to logout
    const result = await graphqlClient.request<{
      logout: MutationResponse;
    }>({
      query: AUTH_LOGOUT_MUTATION,
      variables: { input: body },
      useAuth: true,
    });

    // Clear auth cookies
    await clearAuthTokens();

    return NextResponse.json(result.logout);
  } catch (error) {
    console.error('Logout error:', error);

    // Even if backend fails, clear cookies locally
    await clearAuthTokens();

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
      },
      { status: 500 }
    );
  }
}

// Protect the logout route with authentication
export const POST = withAuth(handleLogout);
