import { AUTH_PROFILE_ME_QUERY } from '@/features/auth/api/queries';
import type { UserProfileApiResponse } from '@/features/auth/api/types';
import { graphqlClient } from '@/lib/server/graphql-client';
import { withAuth } from '@/lib/server/with-auth';
import { NextRequest, NextResponse } from 'next/server';

async function handleGetProfile(_request: NextRequest) {
	try {
		// Call GraphQL backend to get user profile
		const result = await graphqlClient.request<{
			authProfileMe: UserProfileApiResponse;
		}>({
			query: AUTH_PROFILE_ME_QUERY,
			useAuth: true,
		});

		return NextResponse.json(result.authProfileMe);
	} catch (error) {
		console.error('Get profile error:', error);

		return NextResponse.json(
			{
				error: 'Failed to get profile',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

// Protect the profile route with authentication
export const GET = withAuth(handleGetProfile);
