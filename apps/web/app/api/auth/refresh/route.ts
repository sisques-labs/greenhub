import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { getRefreshToken, setAuthTokens, clearAuthTokens } from '@/lib/server/auth-cookies';

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 }
      );
    }

    // Call backend to refresh tokens
    const result = await graphqlClient.request<{
      refreshToken: {
        accessToken: string;
        refreshToken: string;
      };
    }>({
      query: REFRESH_TOKEN_MUTATION,
      variables: { input: { refreshToken } },
      useAuth: false,
    });

    const { accessToken, refreshToken: newRefreshToken } = result.refreshToken;

    // Update cookies with new tokens
    await setAuthTokens(accessToken, newRefreshToken);

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    // Clear invalid tokens
    await clearAuthTokens();

    return NextResponse.json(
      {
        error: 'Token refresh failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 401 }
    );
  }
}
