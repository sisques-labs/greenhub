import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getRefreshToken, setAuthTokens } from './auth-cookies';
import { graphqlClient } from './graphql-client';
import { AUTH_REFRESH_TOKEN_MUTATION } from '@/features/auth/api/mutations';

/**
 * Try to refresh the access token if it's missing or expired
 */
async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    const result = await graphqlClient.request<{
      refreshToken: {
        accessToken: string;
        refreshToken: string;
      };
    }>({
      query: AUTH_REFRESH_TOKEN_MUTATION,
      variables: { input: { refreshToken } },
      useAuth: false,
    });

    const { accessToken, refreshToken: newRefreshToken } = result.refreshToken;
    await setAuthTokens(accessToken, newRefreshToken);

    return true;
  } catch (error) {
    console.error('Token refresh in withAuth failed:', error);
    return false;
  }
}

/**
 * Higher-order function to protect API routes
 * Attempts to refresh token if access token is missing
 */
export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    let accessToken = await getAccessToken();

    // If no access token, try to refresh
    if (!accessToken) {
      const refreshed = await tryRefreshToken();

      if (refreshed) {
        accessToken = await getAccessToken();
      }
    }

    // If still no access token, return unauthorized
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No access token found' },
        { status: 401 }
      );
    }

    return handler(request, ...args);
  };
}
