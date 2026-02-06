import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/shared/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const ACCESS_TOKEN_KEY = "access_token";

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ["/auth"];

/**
 * Checks if a path is a public route
 */
function isPublicRoute(path: string): boolean {
	return PUBLIC_ROUTES.some(
		(route) => path === route || path.startsWith(`${route}/`),
	);
}

/**
 * Gets access token from cookies
 */
function getAccessTokenFromCookies(request: NextRequest): string | null {
	const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

	// Return token only if it exists and is not empty
	return token && token.trim().length > 0 ? token : null;
}

export default function middleware(request: NextRequest) {
	// Get the pathname without locale
	const pathname = request.nextUrl.pathname;

	// Extract locale from pathname (format: /locale/path)
	const localeMatch = pathname.match(/^\/([^/]+)/);
	const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
	const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

	// Redirect root path to /home
	if (pathWithoutLocale === "/") {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}/home`;
		return NextResponse.redirect(url);
	}

	// Check if accessing auth page or other public routes
	const isAuthPage = pathWithoutLocale === "/auth";
	const isPublic = isPublicRoute(pathWithoutLocale);

	// Get access token from cookies
	const accessToken = getAccessTokenFromCookies(request);

	// Case 1: User is authenticated (has valid token) and tries to access auth page
	// Redirect to home
	if (accessToken && isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}/home`;
		return NextResponse.redirect(url);
	}

	// Case 2: User is NOT authenticated (no token) and tries to access protected route
	// Redirect to auth page
	if (!accessToken && !isPublic) {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}/auth`;
		return NextResponse.redirect(url);
	}

	// Continue with intl middleware for all other cases
	return intlMiddleware(request);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
