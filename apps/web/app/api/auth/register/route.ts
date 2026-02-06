import { NextRequest, NextResponse } from 'next/server';
import { graphqlClient } from '@/lib/server/graphql-client';
import { AUTH_REGISTER_BY_EMAIL_MUTATION } from '@/features/auth/api/mutations';
import type {
  RegisterByEmailInput,
  MutationResponse,
} from '@/features/auth/api/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterByEmailInput;

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call GraphQL backend
    const result = await graphqlClient.request<{
      registerByEmail: MutationResponse;
    }>({
      query: AUTH_REGISTER_BY_EMAIL_MUTATION,
      variables: { input: body },
      useAuth: false, // No auth needed for registration
    });

    return NextResponse.json(result.registerByEmail);
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      {
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
