import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { setAuthTokens } from '@/lib/server/auth-cookies';
import { AUTH_LOGIN_BY_EMAIL_MUTATION } from '@/features/auth/api/mutations';
import type {
  LoginByEmailInput,
  LoginResponse,
} from '@/features/auth/api/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginByEmailInput;

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      loginByEmail: LoginResponse;
    }>({
      query: AUTH_LOGIN_BY_EMAIL_MUTATION,
      variables: { input: body },
      useAuth: false, // No auth needed for login
    });

    const { accessToken, refreshToken } = result.loginByEmail;

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set tokens as httpOnly cookies on the response
    await setAuthTokens(accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      {
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 401 }
    );
  }
}
