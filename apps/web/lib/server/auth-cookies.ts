import { cookies } from 'next/headers';

/**
 * Cookie configuration for authentication tokens
 */
const COOKIE_CONFIG = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  MAX_AGE: {
    ACCESS_TOKEN: 60 * 15, // 15 minutes
    REFRESH_TOKEN: 60 * 60 * 24 * 7, // 7 days
  },
} as const;

/**
 * Cookie options for httpOnly secure cookies
 */
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge,
  path: '/',
});

/**
 * Set authentication tokens as httpOnly cookies
 */
export async function setAuthTokens(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_CONFIG.ACCESS_TOKEN,
    accessToken,
    getCookieOptions(COOKIE_CONFIG.MAX_AGE.ACCESS_TOKEN)
  );

  cookieStore.set(
    COOKIE_CONFIG.REFRESH_TOKEN,
    refreshToken,
    getCookieOptions(COOKIE_CONFIG.MAX_AGE.REFRESH_TOKEN)
  );
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_CONFIG.ACCESS_TOKEN)?.value;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_CONFIG.REFRESH_TOKEN)?.value;
}

/**
 * Clear all authentication cookies
 */
export async function clearAuthTokens(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_CONFIG.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_CONFIG.REFRESH_TOKEN);
}

/**
 * Check if user is authenticated (has access token)
 */
export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return !!accessToken;
}
