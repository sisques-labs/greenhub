import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from './auth-cookies';

/**
 * Higher-order function to protect API routes
 * Checks if the user is authenticated before allowing access
 */
export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No access token found' },
        { status: 401 }
      );
    }

    return handler(request, ...args);
  };
}
