import { getAccessToken, getRefreshToken, setAuthTokens } from './auth-cookies';
import { AUTH_REFRESH_TOKEN_MUTATION } from '@/features/auth/api/mutations';

/**
 * GraphQL request options
 */
interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  useAuth?: boolean;
}

/**
 * GraphQL response
 */
interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: {
      code?: string;
    };
  }>;
}

/**
 * GraphQL client for server-side API routes (BFF)
 * Handles communication with the backend GraphQL API
 */
export class GraphQLClient {
  private baseURL: string;
  private isRefreshing = false;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4100';
  }

  /**
   * Make a GraphQL request
   */
  async request<T>(options: GraphQLRequestOptions): Promise<T> {
    const { query, variables, useAuth = true } = options;

    // Get access token if auth is required
    const accessToken = useAuth ? await getAccessToken() : undefined;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseURL}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = (await response.json()) as GraphQLResponse<T>;

    // Handle GraphQL errors
    if (result.errors) {
      const isUnauthenticated = result.errors.some(
        (error) => error.extensions?.code === 'UNAUTHENTICATED'
      );

      // Try to refresh token if unauthenticated
      if (isUnauthenticated && !this.isRefreshing) {
        await this.refreshToken();
        // Retry the request
        return this.request<T>(options);
      }

      throw new Error(result.errors[0].message);
    }

    if (!result.data) {
      throw new Error('No data returned from GraphQL API');
    }

    return result.data;
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshToken(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: AUTH_REFRESH_TOKEN_MUTATION,
          variables: {
            input: {
              refreshToken,
            },
          },
        }),
      });

      const result = (await response.json()) as GraphQLResponse<{
        refreshToken: {
          accessToken: string;
          refreshToken: string;
        };
      }>;

      if (result.errors || !result.data) {
        throw new Error('Failed to refresh token');
      }

      // Update both tokens
      const { accessToken, refreshToken: newRefreshToken } = result.data.refreshToken;
      await setAuthTokens(accessToken, newRefreshToken);
    } finally {
      this.isRefreshing = false;
    }
  }
}

/**
 * Singleton instance of the GraphQL client
 */
export const graphqlClient = new GraphQLClient();
